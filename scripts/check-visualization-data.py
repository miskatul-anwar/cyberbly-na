#!/usr/bin/env python3
"""Verify that every visualization's original node and edge values are intact."""

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = json.loads((ROOT / 'scripts/visualization-data-manifest.json').read_text())
DATA_PATTERN = r'\b{kind}\s*=\s*new vis\.DataSet\((\[.*?\])\);'


def fingerprint(markup, kind):
    match = re.search(DATA_PATTERN.format(kind=kind), markup, re.S)
    if match is None:
        raise ValueError(f'missing {kind} data')
    values = json.loads(match.group(1))
    normalized = json.dumps(values, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
    return {
        'count': len(values),
        'sha256': hashlib.sha256(normalized.encode()).hexdigest(),
    }


failed = False
for relative_path, expected in MANIFEST.items():
    path = ROOT / relative_path
    try:
        markup = path.read_text()
        actual = {kind: fingerprint(markup, kind) for kind in ('nodes', 'edges')}
        if actual != expected:
            print(f'CHANGED: {relative_path}')
            failed = True
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(f'ERROR: {relative_path}: {error}')
        failed = True

found = {str(path.relative_to(ROOT)) for path in (ROOT / 'public/figures').rglob('*.html')
         if path.name != 'diffusion_community_5_all_methods.html'}
for extra in sorted(found - set(MANIFEST)):
    print(f'UNTRACKED GRAPH: {extra}')
    failed = True

if failed:
    sys.exit(1)
print(f'All {len(MANIFEST)} visualization data sets match the original values.')
