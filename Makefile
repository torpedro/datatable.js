include node_modules/unlog/src/unlog.mk

TSC    = ./node_modules/.bin/tsc
MOCHA  = ./node_modules/.bin/mocha
TSLINT = ./node_modules/.bin/tslint
UGLIFY = ./node_modules/.bin/uglifyjs
BROWSERIFY = ./node_modules/.bin/browserify

SRC       = ./src
BUILD     = ./build
DIST      = ./dist
TARGET    = $(DIST)/datatable.js.js
MINTARGET = $(DIST)/datatable.js.min.js

all: compile

compile:
	$(LOG) "TypeScript version: "`$(TSC) --version`
	$(LOG) $(TSC)
	@$(TSC)
	$(LOG) "Compilation done."

test-full: test lint

test: FORCE compile
	$(LOG) "Testing... (Mocha version: "`$(MOCHA) --version`")"
	@$(MOCHA) $(BUILD)/test/**/*.js

lint:
	$(LOG) "Linting... (Tslint version: "`$(TSLINT) --version`")"
	@$(TSLINT) --project .

release: $(MINTARGET) $(TARGET)

$(MINTARGET): $(TARGET)
	$(UGLIFY) $(TARGET) --output $(MINTARGET)

$(TARGET): FORCE
	$(BROWSERIFY) $(BUILD)/$(SRC)/app.js \
	  --standalone 'dt'\
	  --outfile $(TARGET)

FORCE:

