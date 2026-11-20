# gta6-meme-x-01 entry

A GTA 6 launch-week meme posted on X promoting make.fun — the post carries a
make.fun link and the play code makefun-octopus-cougar-bunny, plus an attached
GTA 6 meme image.

Post: https://x.com/kangmusfm/status/2123594242199265376

POST.json names the post; main.ts (Node 22, standard library only) validates it
before writing a copy to $MAKEFUN_OUTPUT_DIR (default /output). Validation is
fail-fast: the file must be valid JSON of at most 16384 bytes, containing an
object with exactly one key "url", whose value matches an x.com or twitter.com
status URL of the form https://(www.|mobile.)?(x|twitter).com/<handle>/status/<digits>.
Any violation exits with code 1 and a clear message; on success the output file
is re-serialized from the validated object rather than copied blind, so the
grader only ever sees a canonical, verified POST.json.
