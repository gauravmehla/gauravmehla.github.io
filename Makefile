# Local development. Everything runs in Docker (ruby:3.3) so there's no Ruby
# setup on the host; the Gemfile pins the same Jekyll GitHub Pages uses.

DOCKER = docker run --rm -v "$(CURDIR)":/site -w /site -e BUNDLE_PATH=/site/vendor/bundle
JEKYLL = bash -c "bundle install --quiet && bundle exec jekyll
NODE = docker run --rm -v "$(CURDIR)":/site -w /site node:22-alpine

.PHONY: help serve build test check clean

help:  ## List commands
	@grep -E '^[a-z]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-7s %s\n", $$1, $$2}'

serve:  ## Preview at http://localhost:4000 (rebuilds on save)
	$(DOCKER) -p 4000:4000 --name mehla-jekyll ruby:3.3 $(JEKYLL) serve --host 0.0.0.0 --force_polling"

build:  ## Build the site into _site/
	$(DOCKER) ruby:3.3 $(JEKYLL) build"

test:  ## Run the terminal unit tests
	$(NODE) node --test "tests/**/*.test.mjs"

check: build test  ## Build, run tests, then the pre-publish checks
	./scripts/check.sh

clean:  ## Remove build output and caches
	rm -rf _site .jekyll-cache
