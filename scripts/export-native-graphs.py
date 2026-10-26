#!/usr/bin/env python3
"""Extract exact vis-network data and options from the retained HTML sources."""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIGURES = ROOT / 'public' / 'figures'
OUTPUT = ROOT / 'public' / 'native-graphs'
SOURCES = {
    'perpetrator-similarity': FIGURES / 'network_structure' / 'perp-similarity-graph-minSim-0.80.html',
    'perpetrator-community': FIGURES / 'network_structure' / 'perpetrator_community_network.html',
    'perpetrator-subcommunity': FIGURES / 'network_structure' / 'perp_subcommunity_network.html',
    'community-behavior': FIGURES / 'community_interaction' / 'community_behavior_graphA.html',
    'community-context': FIGURES / 'community_interaction' / 'community_context_graphB.html',
}


def extract(markup):
    pieces = {}
    for kind in ('nodes', 'edges'):
        match = re.search(r'\b' + kind + r'\s*=\s*new vis\.DataSet\((\[.*?\])\);', markup, re.S)
        if match is None:
            raise ValueError(f'missing {kind} array')
        pieces[kind] = match.group(1)
    options = re.search(r'\bvar options = (\{.*?\});', markup, re.S)
    if options is None:
        raise ValueError('missing graph options')
    pieces['options'] = options.group(1)
    for kind, raw in pieces.items():
        json.loads(raw)
    return '{"nodes":' + pieces['nodes'] + ',"edges":' + pieces['edges'] + ',"options":' + pieces['options'] + '}\n'


def write(source, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    output = extract(source.read_text())
    json.loads(output)
    target.write_text(output)


for slug, source in SOURCES.items():
    write(source, OUTPUT / f'{slug}.json')

frames = FIGURES / 'diffusion_visualization' / 'frames'
count = 0
for source in sorted(frames.glob('frame_*_step_*.html')):
    match = re.fullmatch(r'frame_(imgreedy|bullyonly|weighteddegree|pagerank)_step_(\d+)\.html', source.name)
    if match is None:
        raise ValueError(source.name)
    method, step = match.groups()
    write(source, OUTPUT / 'diffusion' / method / f'step-{step}.json')
    count += 1

if count != 23:
    raise ValueError(f'expected 23 diffusion states, found {count}')
print(f'Exported {len(SOURCES)} standalone graphs and {count} diffusion states.')
