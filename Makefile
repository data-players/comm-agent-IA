# Makefile for comm-agent-IA project

# HTML source files to watch
HTML_FILES = pitch-commercial.html agent-interne.html agent-public.html

# Default target
.PHONY: build
build:
	@echo "Building navigation page..."
	@node build-navigation.js
	@echo "Navigation page built successfully!"

# Watch mode - rebuild on HTML file changes
.PHONY: watch
watch:
	@echo "Starting watch mode..."
	@node build-navigation.js --watch

# Development mode with auto-rebuild
.PHONY: dev
dev: watch

# Build only if HTML files are newer than index.html
.PHONY: build-if-needed
build-if-needed: index.html

index.html: $(HTML_FILES) build-navigation.js
	@echo "HTML files changed, rebuilding navigation..."
	@node build-navigation.js
	@echo "Navigation page updated!"

# Clean target
.PHONY: clean
clean:
	@echo "Cleaning generated files..."
	@rm -f index.html
	@echo "Clean completed!"

# Install dependencies (if needed)
.PHONY: install
install:
	@echo "No dependencies to install for this static project"

# Help target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  build           - Build the navigation page once"
	@echo "  watch           - Watch HTML files and rebuild automatically"
	@echo "  dev             - Alias for watch (development mode)"
	@echo "  build-if-needed - Build only if HTML files are newer than index.html"
	@echo "  clean           - Remove generated index.html file"
	@echo "  install         - Install dependencies (none needed)"
	@echo "  help            - Show this help message"

# Default target when just running 'make'
.DEFAULT_GOAL := build 