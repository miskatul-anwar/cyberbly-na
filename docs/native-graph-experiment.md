# Native graph experiment

This branch renders the six visualization routes with a Next.js client component instead of iframes. The original HTML files remain available through each page's **Original HTML** button for comparison.

## Accuracy boundary

- The viewer uses `vis-network@9.1.2`, matching the version embedded in the original HTML.
- `scripts/export-native-graphs.py` copies the source node arrays, edge arrays, and vis-network options into JSON without recomputing or rounding values.
- `npm run check:native-data` compares all 28 exported graph states with their retained HTML sources and the original data checksums. It covers 4,875 node entries and 133,613 edge entries across those states; these totals include repeated nodes and edges in the 23 diffusion snapshots.
- Browser checks cover the five standalone graphs and every diffusion method and step. The graph filters and diffusion view controls are implemented in React while vis-network still draws the graph.

The browser's physics simulation and font rasterization can produce small visual differences between sessions or viewport sizes. This trial guarantees equality of the source node, edge, and option values, rather than identical pixels in every browser.

## Loading

The viewer fetches only the selected graph state. Diffusion data is about 1.7 MB as JSON per state before HTTP compression, and the graph library is cached after its first load. The former HTML viewer and all source data remain on this branch for side-by-side review.

## Verification

```sh
npm run check:data
npm run check:native-data
npm run build
```
