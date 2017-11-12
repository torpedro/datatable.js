include node_modules/unlog/src/unlog.mk

TSC    = ./node_modules/.bin/tsc
MOCHA  = ./node_modules/.bin/mocha
TSLINT = ./node_modules/.bin/tslint

BUILD  = ./build

all: compile

compile:
	$(LOG) "TypeScript version: "`$(TSC) --version`
	$(LOG) $(TSC)
	@$(TSC)
	$(LOG) "Compilation done."

test: FORCE compile
	$(LOG) "Mocha version: "`$(MOCHA) --version`
	@$(MOCHA) $(BUILD)/test/**/*.js

lint:
	$(LOG) "Tslint version: "`$(TSLINT) --version`
	$(TSLINT) --project .


FORCE:

