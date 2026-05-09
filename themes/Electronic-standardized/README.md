# Electronic Theme (Standardized Contracts)

This is the contract-standardized version of the Electronic theme.

## Purpose

- Keep theme-specific UI/branding (Voltix style)
- Enforce common rendering contracts used by the platform
- Make runtime data injection uniform across all themes

## Structure

- `layouts/main.liquid`
- `templates/index.liquid`, `templates/collection.liquid`, `templates/product.liquid`
- `sections/header.liquid`, `sections/footer.liquid`, `sections/hero.liquid`, `sections/collection-grid.liquid`, `sections/featured-products.liquid`
- `components/product-card.liquid`
- `config/schema.json`
- `assets/` (theme-local CSS/JS entry points)

## Status

Phase 1 complete: contract scaffolding + template placeholders are ready.
