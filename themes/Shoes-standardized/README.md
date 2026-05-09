# Shoes Theme (Standardized Contracts)

This folder is the standardized, Liquid-style version of the Shoes theme.

## Goal

Keep visual freedom while enforcing stable rendering contracts.

- Platform owns data and business logic.
- Theme owns presentation and section styling.
- Renderer injects data into known contracts.

## Structure

- `layouts/main.liquid` - global shell
- `templates/*.liquid` - route templates
- `sections/*.liquid` - contract sections
- `components/*.liquid` - reusable visual blocks
- `config/schema.json` - declared section/data contracts

## Current Phase

Phase 1 baseline:

- Contract names defined
- Core templates created (`index`, `collection`, `product`)
- Hardcoded samples replaced by contract-driven placeholders where needed

Next phase is wiring runtime renderer + data injection.
