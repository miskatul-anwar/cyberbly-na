#!/usr/bin/env python3
"""Compare every native graph against its retained HTML source and original manifest."""

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ORIGINAL = json.loads((ROOT / 'scripts/visualization-data-manifest.json').read_text())
FIGURES = ROOT / 'public' / 'figures'
NATIVE = ROOT / 'public' / 'native-graphs'
STANDALONE = {
    FIGURES / 'network_structure' / 'perp-similarity-graph-minSim-0.80.html': NATIVE / 'perpetrator-similarity.json',
    FIGURES / 'network_structure' / 'perpetrator_community_network.html': NATIVE / 'perpetrator-community.json',
    FIGURES / 'network_structure' / 'perp_subcommunity_network.html': NATIVE / 'perpetrator-subcommunity.json',
    FIGURES / 'community_interaction' / 'community_behavior_graphA.html': NATIVE / 'community-behavior.json',
    FIGURES / 'community_interaction' / 'community_context_graphB.html': NATIVE / 'community-context.json',
}


def source_parts(markup):
    result = {}
    for kind in ('nodes', 'edges'):
        match = re.search(r'\b' + kind + r'\s*=\s*new vis\.DataSet\((\[.*?\])\);', markup, re.S)
        if match is None:
            raise ValueError(f'missing {kind} source data')
        result[kind] = json.loads(match.group(1))
    options = re.search(r'\bvar options = (\{.*?\});', markup, re.S)
    if options is None:
        raise ValueError('missing source options')
    result['options'] = json.loads(options.group(1))
    return result


def digest(values):
    normalized = json.dumps(values, sort_keys=True, separators=(',', ':'), ensure_ascii=False)
    return {'count': len(values), 'sha256': hashlib.sha256(normalized.encode()).hexdigest()}


pairs = dict(STANDALONE)
for source in sorted((FIGURES / 'diffusion_visualization' / 'frames').glob('frame_*_step_*.html')):
    match = re.fullmatch(r'frame_(imgreedy|bullyonly|weighteddegree|pagerank)_step_(\d+)\.html', source.name)
    if match is None:
        raise ValueError(source.name)
    method, step = match.groups()
    pairs[source] = NATIVE / 'diffusion' / method / f'step-{step}.json'

failed = len(pairs) != len(ORIGINAL)
for source, target in pairs.items():
    try:
        original = source_parts(source.read_text())
        converted = json.loads(target.read_text())
        expected = ORIGINAL[str(source.relative_to(ROOT))]
        if converted != original:
            print(f'DATA OR OPTIONS CHANGED: {target.relative_to(ROOT)}')
            failed = True
        for kind in ('nodes', 'edges'):
            if digest(converted[kind]) != expected[kind]:
                print(f'ORIGINAL CHECKSUM FAILED: {target.relative_to(ROOT)} {kind}')
                failed = True
    except (OSError, ValueError, KeyError) as error:
        print(f'ERROR: {target.relative_to(ROOT)}: {error}')
        failed = True

actual_files = set(NATIVE.rglob('*.json'))
if actual_files != set(pairs.values()):
    print('Native graph file set does not match the 28 source states.')
    failed = True

if failed:
    sys.exit(1)
print(f'All {len(pairs)} native graphs exactly match source nodes, edges, and options.')
