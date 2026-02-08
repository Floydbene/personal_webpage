.PHONY: help install dev build preview start clean lint format check test

# Default target
help:
	@echo "Available commands:"
	@echo "  make install   - Install dependencies"
	@echo "  make dev       - Start development server"
	@echo "  make build     - Build for production"
	@echo "  make preview   - Preview production build"
	@echo "  make start     - Alias for dev"
	@echo "  make clean     - Remove build artifacts and node_modules"
	@echo "  make lint      - Run linter (requires ESLint setup)"
	@echo "  make format    - Format code (requires Prettier setup)"
	@echo "  make check     - Run lint and type check"
	@echo "  make test      - Run tests (requires test setup)"

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Preview production build
preview:
	npm run preview

# Alias for dev
start: dev

# Clean build artifacts and dependencies
clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf .vite

# Lint code (add ESLint to package.json first)
lint:
	@if grep -q "eslint" package.json; then \
		npm run lint; \
	else \
		echo "ESLint not configured. Add 'eslint' to devDependencies and 'lint' script to package.json"; \
	fi

# Format code (add Prettier to package.json first)
format:
	@if grep -q "prettier" package.json; then \
		npm run format; \
	else \
		echo "Prettier not configured. Add 'prettier' to devDependencies and 'format' script to package.json"; \
	fi

# Run checks (lint + type check)
check:
	@echo "Running checks..."
	@$(MAKE) lint

# Run tests (add test framework to package.json first)
test:
	@if grep -q "\"test\":" package.json; then \
		npm test; \
	else \
		echo "Tests not configured. Add a test framework and 'test' script to package.json"; \
	fi
