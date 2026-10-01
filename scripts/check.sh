#!/usr/bin/env bash
# Pre-publish checks. Run via `make check` (which builds _site/ first).
#
#   1. Private terms: nothing listed in .private-terms (gitignored, one term
#      per line) may appear anywhere in the built site.
#   2. Post front matter: every post has a title and a description.
#   3. Build output: the pages that must exist do exist.
#   4. Terminal data: assets/terminal.json parses as JSON.
set -uo pipefail
cd "$(dirname "$0")/.."

failures=0
pass() { printf '  ok    %s\n' "$1"; }
fail() { printf '  FAIL  %s\n' "$1"; failures=$((failures + 1)); }

[ -d _site ] || { echo "No _site/ — run 'make build' first."; exit 1; }

# 1. Private terms
if [ -f .private-terms ]; then
    terms=$(grep -v '^\s*#' .private-terms | grep -v '^\s*$')
    hits=$(grep -rilwF -f <(printf '%s\n' "$terms") _site || true)
    if [ -z "$hits" ]; then
        pass "no private terms in built site"
    else
        fail "private terms found in: $(echo $hits)"
    fi
else
    fail ".private-terms missing — create it (see docs/maintenance.md)"
fi

# 2. Post front matter
before=$failures
for post in _posts/*.md; do
    front_matter=$(awk 'NR==1 && /^---$/ {fm=1; next} fm && /^---$/ {exit} fm' "$post")
    for key in title description; do
        echo "$front_matter" | grep -q "^$key:" || fail "$post is missing '$key' in front matter"
    done
done
[ "$failures" -eq "$before" ] && pass "all posts have title + description"

# 3. Required pages
before=$failures
for page in index.html 404.html feed.xml sitemap.xml assets/css/main.css assets/terminal.json; do
    [ -f "_site/$page" ] || fail "_site/$page was not generated"
done
[ "$failures" -eq "$before" ] && pass "required pages generated"

# 4. Terminal data must be valid JSON
if python3 -c 'import json, sys; json.load(open(sys.argv[1]))' _site/assets/terminal.json 2>/dev/null; then
    pass "terminal.json is valid JSON"
else
    fail "_site/assets/terminal.json is not valid JSON"
fi

echo
if [ "$failures" -gt 0 ]; then
    echo "$failures check(s) failed."
    exit 1
fi
echo "All checks passed."
