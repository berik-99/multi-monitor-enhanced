# Metadata for the GNOME Shell extension
FRIENDLY_NAME=Multi Monitor Enhanced
NAME=multi-monitor-enhanced
DOMAIN=berik-99
DESCRIPTION=Enhance multi-monitor support in GNOME Shell
URL=https://github.com/berik-99/multi-monitor-enhanced
SETTINGS_SCHEMA_ID=org.gnome.shell.extensions.
GETTEXT_DOMAIN=$(NAME)
VERSION=1
SHELL_VERSION=45,46,47,48,49

# Build and packaging settings
GEN_ENV_SCRIPT=./gen-env.js
GENERATED_DIR=./src/generated
PACK_DIR := ./dist
BUILD_DIR := ./_build
UUID=$(NAME)@$(DOMAIN)

.PHONY: build pack install clean prebuild deps

deps: package.json
	npm install

prebuild: deps
	FRIENDLY_NAME="$(FRIENDLY_NAME)" \
	NAME="$(NAME)" \
	DOMAIN="$(DOMAIN)" \
	DESCRIPTION="$(DESCRIPTION)" \
	URL="$(URL)" \
	SETTINGS_SCHEMA_ID="$(SETTINGS_SCHEMA_ID)" \
	GETTEXT_DOMAIN="$(GETTEXT_DOMAIN)" \
	VERSION="$(VERSION)" \
	SHELL_VERSION="$(SHELL_VERSION)" \
	GENERATED_DIR="$(GENERATED_DIR)" \
	BUILD_DIR="$(BUILD_DIR)" \
	UUID="$(UUID)" \
	node $(GEN_ENV_SCRIPT)

build: prebuild
	npx tsc --outDir $(BUILD_DIR) --rootDir src
	@cp -r ./src/resources/schemas $(BUILD_DIR)
	glib-compile-schemas $(BUILD_DIR)/schemas

$(NAME).zip: build 
	@rm -rf $(PACK_DIR)
	@mkdir -p $(PACK_DIR)
	@zip -9r $(PACK_DIR)/$(NAME).zip $(BUILD_DIR)

pack: $(NAME).zip

install: build
	@rm -rf ~/.local/share/gnome-shell/extensions/$(UUID)
	@cp -r $(BUILD_DIR) ~/.local/share/gnome-shell/extensions/$(UUID)

clean:
	@rm -rf $(BUILD_DIR) $(PACK_DIR) $(GENERATED_DIR) node_modules