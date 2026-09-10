#!/usr/bin/env python3
"""Parse Preistabellen (Stadtteil level) from the pdftotext -layout output of the
Grundstücksmarktbericht Köln 2026 into JSON.

Family A: chapter 6.1.1 Eigentumswohnungen (Umwandlung / Weiterverkauf / Neubau,
          plus Baujahrklassen under Weiterverkauf)
Family B: chapter 5.1.2 Ein- und Zweifamilienhäuser (freistehend /
          Doppelhaushälfte / Reihenendhaus / Reihenmittelhaus)

Usage: python3 parse_gmb.py [gmb2026.txt]
"""
import json
import os
import random
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "gmb2026.txt")
OUT_ETW = os.path.join(HERE, "gmb2026_etw_stadtteile.json")
OUT_HAUS = os.path.join(HERE, "gmb2026_haus_stadtteile.json")

NUM = r"\d+(?:\.\d{3})*"
DASH = r"[-–—]"
RE_NUM_TOKEN = re.compile(rf"^{NUM}$")
RE_RANGE_TOKEN = re.compile(rf"^({NUM})\s*{DASH}\s*({NUM})$")
RE_BEZIRK = re.compile(r"^\s*Preistabelle Stadtbezirk\s+(\d+)\s*[-–]\s*(.+?)\s*$")
RE_LABEL = re.compile(r"^\s*▮\s+(.+?)\s{2,}(\d+)\s*$")
RE_SUBROW = re.compile(r"^\s*-\s*Baujahre\s+(vor 1941|1941\s*[-–]\s*1990|ab 1991)\s+(\d+)\s*$")
RE_STADTTEIL = re.compile(r"^\s{0,3}([A-ZÄÖÜ][A-Za-zäöüÄÖÜß/\-\.\s]*?)\s*$")

STADTTEIL_BLACKLIST_PREFIX = (
    "Stadtteil", "Zum Inhaltsverzeichnis", "Der Gutachterausschuss", "Eine Karten",
    "Preistabelle", "Kaufpreis", "Grundstücks", "Reihenendhaus", "Wohnfläche",
    "Baujahr", "Euro je", "Anzahl", "Übersicht", "Kennzahlen", "Informationen",
)


def to_int(s):
    return int(s.replace(".", ""))


def split_tokens(line):
    """Split a data line into cells separated by >=2 spaces (range cells keep 'a - b')."""
    return [t.strip() for t in re.split(r"\s{2,}", line.strip()) if t.strip()]


def _pad(vals, ncols):
    # Some rows lack Wohnfläche and Euro/m² (shown as "/" on a following line):
    # then only the first ncols-2 cells are present -> pad with None.
    if len(vals) == ncols:
        return vals
    if len(vals) == ncols - 2:
        return vals + [None, None]
    return None


def parse_mean(line, ncols):
    toks = split_tokens(line)
    if not toks or not all(RE_NUM_TOKEN.match(t) for t in toks):
        return None
    return _pad([to_int(t) for t in toks], ncols)


def parse_range(line, ncols):
    toks = split_tokens(line)
    out = []
    for t in toks:
        m = RE_RANGE_TOKEN.match(t)
        if not m:
            return None
        out.append((to_int(m.group(1)), to_int(m.group(2))))
    if not out:
        return None
    return _pad(out, ncols)


def is_stadtteil_line(line):
    if not line.strip() or "▮" in line or any(ch.isdigit() for ch in line):
        return False
    m = RE_STADTTEIL.match(line)
    if not m:
        return False
    name = m.group(1).strip()
    if any(name.startswith(p) for p in STADTTEIL_BLACKLIST_PREFIX):
        return False
    if " - " in name or len(name) < 3:
        return False
    return True


def normalize_label(label):
    label = re.sub(r"\s+", " ", label).strip()
    if label.startswith("Doppelhaushälfte"):
        return "Doppelhaushälfte / Reihenendhaus"
    return label


def parse_family(lines, start, end, ncols, family):
    """Return (rows, problems). `family` is 'etw' or 'haus'."""
    rows, problems = [], []
    bezirk = None
    # events collected per Stadtteil
    cur = None  # dict(name, lineno, labels, means, ranges)
    stadtteile = []

    def flush():
        if cur is not None:
            stadtteile.append(cur)

    for i in range(start, end):
        raw = lines[i]
        line = raw.rstrip("\n")
        if not line.strip():
            continue
        mb = RE_BEZIRK.match(line)
        if mb:
            flush(); cur = None
            bezirk = f"{int(mb.group(1))} - {mb.group(2).strip()}"
            continue
        if bezirk is None:
            continue
        ml = RE_LABEL.match(line)
        if ml:
            if cur is None:
                problems.append(f"line {i+1}: label without Stadtteil: {line.strip()}")
                continue
            cur["labels"].append((i, normalize_label(ml.group(1)), int(ml.group(2)), None))
            continue
        ms = RE_SUBROW.match(line)
        if ms:
            if cur is None:
                problems.append(f"line {i+1}: sub-row without Stadtteil: {line.strip()}")
                continue
            klasse = re.sub(r"\s*[-–]\s*", " - ", ms.group(1))
            cur["labels"].append((i, "Weiterverkauf", int(ms.group(2)), klasse))
            continue
        # strip the wrapped 'Reihenendhaus' label prefix from data lines
        data_line = re.sub(r"^\s*Reihenendhaus\s+", "", line) if line.strip().startswith("Reihenendhaus") else line
        mean = parse_mean(data_line, ncols)
        if mean is not None and cur is not None:
            cur["means"].append((i, mean)); continue
        rng = parse_range(data_line, ncols)
        if rng is not None and cur is not None:
            cur["ranges"].append((i, rng)); continue
        if is_stadtteil_line(line):
            flush()
            cur = {"bezirk": bezirk, "name": line.strip(), "lineno": i, "labels": [], "means": [], "ranges": []}
            continue
        # anything else (page headers, footers, column headers) is ignored
    flush()

    for st in stadtteile:
        L, M, R = st["labels"], st["means"], st["ranges"]
        if not L:
            if M or R:
                problems.append(f"{st['bezirk']} / {st['name']} (line {st['lineno']+1}): data without labels")
            continue  # a heading-like line with no data, not a Stadtteil
        if not (len(L) == len(M) == len(R)):
            problems.append(f"{st['bezirk']} / {st['name']} (line {st['lineno']+1}): "
                            f"{len(L)} labels, {len(M)} means, {len(R)} ranges -> omitted")
            continue
        prev_range_line = st["lineno"]
        for (lline, label, anzahl, klasse), (mline, mean), (rline, rng) in zip(L, M, R):
            # positional sanity: range after label; mean between previous range and this range
            ok = rline > lline and prev_range_line < mline < rline and abs(mline - lline) <= 3
            # value sanity: min <= mean <= max in every column
            ok = ok and all(
                (mv is None) == (lohi is None) and (mv is None or lohi[0] <= mv <= lohi[1])
                for mv, lohi in zip(mean, rng))
            if not ok:
                problems.append(f"{st['bezirk']} / {st['name']} '{label}' {klasse or ''} (label line {lline+1}): "
                                f"ambiguous assignment -> omitted")
                prev_range_line = rline
                continue
            prev_range_line = rline
            row = {"stadtbezirk": st["bezirk"], "stadtteil": st["name"]}
            if family == "etw":
                row["verkaufsart"] = label
                row["baujahrklasse"] = klasse
                keys = ["kaufpreis", "baujahr", "wohnflaeche", "eur_je_qm"]
            else:
                row["gebaeudeart"] = label
                keys = ["kaufpreis", "grundstueck", "baujahr", "wohnflaeche", "eur_je_qm"]
            row["anzahl"] = anzahl
            for k, mv, lohi in zip(keys, mean, rng):
                row[f"{k}_mittel"] = mv
                row[f"{k}_min"] = lohi[0] if lohi else None
                row[f"{k}_max"] = lohi[1] if lohi else None
            row["_zeile"] = lline + 1  # 1-based source line of the label (for verification)
            rows.append(row)
    return rows, problems


def find_line(lines, pattern, start=0):
    for i in range(start, len(lines)):
        if re.match(pattern, lines[i]):
            return i
    raise ValueError(f"pattern not found: {pattern}")


def main():
    with open(SRC, encoding="utf-8") as f:
        lines = f.readlines()

    # Family A: chapter 6.1.1 ETW -> from first 'Preistabelle Stadtbezirk 1' after heading 6.1.1 to heading 6.1.2
    a_head = find_line(lines, r"^6\.1\.1\s+Kaufpreisspannen")
    a_start = find_line(lines, r"^\s*Preistabelle Stadtbezirk 1\b", a_head)
    a_end = find_line(lines, r"^6\.1\.2\s", a_start)
    # Family B: chapter 5.1.2 EZFH Weiterverkauf -> from heading 5.1.2 to heading 5.1.3
    b_head = find_line(lines, r"^5\.1\.2\s+Kaufpreisspannen")
    b_end = find_line(lines, r"^5\.1\.3\s", b_head)

    etw, prob_a = parse_family(lines, a_start, a_end, 4, "etw")
    haus, prob_b = parse_family(lines, b_head, b_end, 5, "haus")

    def dump(path, kapitel, key, rows):
        clean = [{k: v for k, v in r.items() if not k.startswith("_")} for r in rows]
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"quelle": "gmb_koeln_2026", "kapitel": kapitel, "einheit": "EUR", key: clean},
                      f, ensure_ascii=False, indent=1)

    dump(OUT_ETW, "6.1.1", "stadtteile", etw)
    dump(OUT_HAUS, "5.1.2", "stadtteile", haus)

    # ---------------- report ----------------
    def counts(rows):
        c = {}
        for r in rows:
            c[r["stadtbezirk"]] = c.get(r["stadtbezirk"], 0) + 1
        return c

    print(f"Source: {SRC}")
    print(f"ETW  section lines {a_start+1}-{a_end}, rows: {len(etw)}, Stadtteile: {len({(r['stadtbezirk'], r['stadtteil']) for r in etw})}")
    for k, v in sorted(counts(etw).items(), key=lambda kv: int(kv[0].split(' ')[0])):
        print(f"   Stadtbezirk {k}: {v} rows")
    print(f"HAUS section lines {b_head+1}-{b_end}, rows: {len(haus)}, Stadtteile: {len({(r['stadtbezirk'], r['stadtteil']) for r in haus})}")
    for k, v in sorted(counts(haus).items(), key=lambda kv: int(kv[0].split(' ')[0])):
        print(f"   Stadtbezirk {k}: {v} rows")
    print("Problems / omitted:")
    for p in prob_a + prob_b:
        print("   " + p)
    if not (prob_a or prob_b):
        print("   none")

    # spot checks
    def get(rows, **kw):
        hits = [r for r in rows if all(r.get(k) == v for k, v in kw.items())]
        return hits[0] if len(hits) == 1 else None

    checks = [
        ("ETW Altstadt/Nord Weiterverkauf", get(etw, stadtteil="Altstadt/Nord", verkaufsart="Weiterverkauf", baujahrklasse=None),
         {"anzahl": 63, "kaufpreis_mittel": 457657, "eur_je_qm_mittel": 5894, "eur_je_qm_min": 2592, "eur_je_qm_max": 11737}),
        ("ETW Altstadt/Süd Weiterverkauf 1941 - 1990", get(etw, stadtteil="Altstadt/Süd", verkaufsart="Weiterverkauf", baujahrklasse="1941 - 1990"),
         {"anzahl": 94, "eur_je_qm_mittel": 5062}),
        ("Haus Hahnwald freistehend", get(haus, stadtteil="Hahnwald", gebaeudeart="freistehend"),
         {"anzahl": 10, "kaufpreis_mittel": 2574976, "grundstueck_mittel": 1785, "eur_je_qm_mittel": 7689}),
        ("Haus Marienburg DHH/REH", get(haus, stadtteil="Marienburg", gebaeudeart="Doppelhaushälfte / Reihenendhaus"),
         {"anzahl": 3, "eur_je_qm_mittel": 9296}),
    ]
    print("Spot checks:")
    all_ok = True
    for name, row, expected in checks:
        if row is None:
            print(f"   FAIL {name}: row not found"); all_ok = False; continue
        bad = {k: (row.get(k), v) for k, v in expected.items() if row.get(k) != v}
        if bad:
            print(f"   FAIL {name}: {bad}"); all_ok = False
        else:
            print(f"   PASS {name}")

    # random rows with source lines
    rng = random.Random(int(os.environ.get("GMB_SEED", "2026")))
    print("Random rows for manual check (source lines around the label line):")
    for r in rng.sample(etw, 2) + rng.sample(haus, 1):
        print("   ROW:", json.dumps({k: v for k, v in r.items() if not k.startswith("_")}, ensure_ascii=False))
        ln = r["_zeile"]
        for j in range(ln - 2, ln + 2):
            print(f"   {j:>5}: {lines[j-1].rstrip()}")
        print()
    print("Outputs:", OUT_ETW, OUT_HAUS)
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
