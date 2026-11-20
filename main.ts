// Entry program for gta6-meme-x-01 (Node 22, standard library only).
//
// The graded artifact is the X post itself — a GTA 6 launch-week meme carrying
// the make.fun link and play code makefun-octopus-cougar-bunny. POST.json names
// that post; this program's only job is to place a copy of POST.json from the
// repo root into the output directory the gate reads.
//
// Outside the grader's container MAKEFUN_BOT_DIR / MAKEFUN_OUTPUT_DIR stand in
// for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUT, { recursive: true });
try {
  copyFileSync(join(SRC, 'POST.json'), join(OUT, 'POST.json'));
} catch (e) {
  console.error(`failed to copy POST.json from ${SRC}: ${(e as Error).message}`);
  process.exit(1);
}
