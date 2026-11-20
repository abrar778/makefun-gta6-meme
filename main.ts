// Entry program for gta6-meme-x-01 (Node 22, standard library only).
//
// The graded artifact is the X post itself — a GTA 6 launch-week meme carrying
// the make.fun link and play code makefun-octopus-cougar-bunny. POST.json
// declares exactly which post that is, and this program is responsible for
// validating that declaration and writing a verified copy into the output
// directory the gate reads.
//
// Validation contract (fail fast, exit 1 on any violation):
//   1. POST.json exists, is valid JSON, and is at most 16384 bytes.
//   2. It is an object with exactly one key, "url", and nothing else.
//   3. That url points at a status on x.com or twitter.com (www./mobile.
//      subdomains allowed): https://(www.|mobile.)?(x|twitter).com/<handle>/
//      status/<digits>.
// Only a POST.json passing all three checks is re-serialized and written out —
// the output file is produced from the validated object, never copied blind.
//
// Outside the grader's container MAKEFUN_BOT_DIR / MAKEFUN_OUTPUT_DIR stand in
// for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// x.com or twitter.com status URL, optionally behind www. or mobile.
const URL_RE =
  /^https:\/\/(www\.|mobile\.)?(x|twitter)\.com\/[^/?#]+\/status\/\d+$/;

const MAX_BYTES = 16384;

function bail(msg: string): void {
  console.error(`POST.json validation failed: ${msg}`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const postPath = join(SRC, 'POST.json');

// Guard the size first so a bloated file never reaches the JSON parser.
let size = -1;
try {
  size = statSync(postPath).size;
} catch (e) {
  bail(`cannot stat ${postPath}: ${(e as Error).message}`);
}
if (size > MAX_BYTES) {
  bail(`file is ${size} bytes, exceeds the ${MAX_BYTES}-byte limit`);
}

let raw = '';
try {
  raw = readFileSync(postPath, 'utf8');
} catch (e) {
  bail(`cannot read ${postPath}: ${(e as Error).message}`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (e) {
  bail(`not valid JSON: ${(e as Error).message}`);
}

if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
  bail('expected a JSON object');
}
const keys = Object.keys(parsed as Record<string, unknown>);
if (keys.length !== 1 || keys[0] !== 'url') {
  bail(`expected exactly one key "url", found [${keys.join(', ')}]`);
}

const url = (parsed as Record<string, unknown>).url;
if (typeof url !== 'string' || !URL_RE.test(url)) {
  bail(
    `"url" must be an x.com/twitter.com status URL ` +
      `(https://(www.|mobile.)?(x|twitter).com/<handle>/status/<digits>), got: ${JSON.stringify(url)}`,
  );
}

// Write the canonical re-serialization of the validated object.
try {
  writeFileSync(join(OUT, 'POST.json'), JSON.stringify(parsed, null, 2) + '\n');
} catch (e) {
  bail(`cannot write to ${OUT}: ${(e as Error).message}`);
}
console.log(`validated ${url} -> ${join(OUT, 'POST.json')}`);
