# Makefile for comm-agent-IA project

# HTML source files to watch
HTML_FILES = pitch-commercial.html agent-interne.html agent-public.html

# Server configuration
PORT = 8000

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

# Static file server using inline Node.js code
.PHONY: serve
serve:
	@echo "Starting static HTTP server on port $(PORT)..."
	@echo "Open http://localhost:$(PORT) in your browser"
	@echo "Press Ctrl+C to stop the server"
	@node -e " \
		const http = require('http'); \
		const fs = require('fs'); \
		const path = require('path'); \
		const url = require('url'); \
		const mimes = { \
			'.html': 'text/html', \
			'.css': 'text/css', \
			'.js': 'application/javascript', \
			'.json': 'application/json', \
			'.webp': 'image/webp', \
			'.svg': 'image/svg+xml', \
			'.csv': 'text/csv', \
			'.md': 'text/markdown', \
			'.txt': 'text/plain' \
		}; \
		http.createServer((req, res) => { \
			let pathname = url.parse(req.url).pathname; \
			if (pathname === '/') pathname = '/index.html'; \
			const filePath = path.join(__dirname, pathname); \
			fs.readFile(filePath, (err, data) => { \
				if (err) { \
					res.writeHead(404, { 'Content-Type': 'text/plain' }); \
					res.end('404 - File Not Found'); \
					console.log('404:', pathname); \
					return; \
				} \
				const ext = path.extname(filePath); \
				const contentType = mimes[ext] || 'application/octet-stream'; \
				res.writeHead(200, { 'Content-Type': contentType }); \
				res.end(data); \
				console.log('200:', pathname); \
			}); \
		}).listen($(PORT), () => { \
			console.log('Static HTTP server running at http://localhost:$(PORT)'); \
			console.log('Press Ctrl+C to stop the server'); \
		}); \
	"

# Development server: serve + watch in parallel
.PHONY: start
start: build
	@echo "Starting development environment..."
	@echo "- HTTP server on http://localhost:$(PORT)"
	@echo "- Auto-rebuild on file changes"
	@echo "Press Ctrl+C to stop both server and watch"
	@trap 'kill %1 %2 2>/dev/null; exit' INT; \
	make serve & \
	make watch & \
	wait

# Legacy alias for dev-serve
.PHONY: dev-serve
dev-serve: start

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
	@echo "  serve           - Start static HTTP server only"
	@echo "  start           - Start HTTP server + watch (recommended for development)"
	@echo "  dev-serve       - Alias for start"
	@echo "  build-if-needed - Build only if HTML files are newer than index.html"
	@echo "  clean           - Remove generated index.html file"
	@echo "  install         - Install dependencies (none needed)"
	@echo "  help            - Show this help message"

# Default target when just running 'make'
.DEFAULT_GOAL := build 