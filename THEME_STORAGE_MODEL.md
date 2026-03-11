## Theme Storage & Access – Theoretical Model

### 1. High‑Level Overview

A theme system lets you define how a site looks and behaves (layout, styles, components) separately from the content.

- **Core idea**: Treat a theme as a versioned, structured bundle of:
  - Layout templates (HTML / component schema)
  - Styling (CSS / design tokens)
  - Behavior (JS, config)
  - Assets (images, fonts, etc.)
- **Two main consumers**:
  - **Runtime renderer**: serves real pages to end users.
  - **Builder/editor**: visual or code editors that allow humans to modify theme resources.

---

### 2. Data Model for Themes

#### 2.1 Theme Entity

A **Theme** is the top‑level object representing a design package.

**Recommended fields:**

- **Identity & metadata**
  - `id`: unique identifier (UUID / ObjectId / integer).
  - `name`: human‑readable theme name.
  - `slug`: URL‑safe identifier.
  - `description`: optional description / notes.
- **Lifecycle**
  - `status`: `draft | published | archived`.
  - `version`: current version label (e.g. `1.3.0` or build number).
  - `currentVersionId`: pointer to the active `ThemeVersion` used at runtime.
- **Ownership & multi‑tenant**
  - `ownerId`: user or team that owns the theme.
  - `tenantId` / `workspaceId`: for multi‑tenant separation.
- **Timestamps**
  - `createdAt`, `updatedAt`, `publishedAt`.

The **Theme** record is a stable anchor. All editable data is attached via theme versions.

#### 2.2 Theme Version

A **ThemeVersion** stores a snapshot of a theme’s structure and styles at a given point in time.

**Fields:**

- `id`
- `themeId`: foreign key to `Theme`.
- `versionNumber`: sequential integer or semantic version.
- `status`: `draft | published`.
- `label`: short description (e.g. “Homepage redesign – March 2026”).
- `changelog`: optional text describing changes.
- Links (IDs/foreign keys) to:
  - Page templates.
  - Blocks/components configuration.
  - Design tokens / settings.
  - Compiled CSS / JS bundle references.

This design allows:

- Drafting multiple versions simultaneously.
- Rolling back to previous versions.
- Previewing a specific version without affecting production.

#### 2.3 Page Templates

Themes generally define one or more **page templates** (also called layouts or routes):

**Examples:**

- `home`, `product`, `category`, `blog-post`, `404`, `landing-page`.

**Fields for each template:**

- `id`
- `themeVersionId`
- `name`
- `type`: semantic type (home/product/etc.) for routing logic.
- `routePattern`: URL pattern (e.g. `/products/:slug`, `/blog/:slug`).
- **Structure** (two common representations):
  - **HTML‑first**:
    - Raw HTML string with placeholders (e.g. `{{title}}`, `{{body}}`).
  - **Schema‑first**:
    - JSON describing a component/block tree (sections, columns, widgets).
- **Regions / slots**:
  - Named areas (`header`, `main`, `sidebar`, `footer`) where dynamic content can be injected.
- **Data bindings**:
  - Expressions describing where content comes from (e.g. `product.title`, `post.featuredImage`).

#### 2.4 Components / Blocks

To make themes modular and reusable, most systems define **blocks** (widgets).

**Block definition:**

- `blockType`: unique identifier (e.g. `hero-banner`, `product-grid`, `testimonial-slider`).
- `schema`: JSON schema of configurable properties:
  - e.g. `title: string`, `buttonLabel: string`, `images: array`, `layout: enum`.
- **Default markup**:
  - HTML snippet or React/Vue component definition.
- **Styling hooks**:
  - Default CSS classes and/or data attributes.

**Block instances in templates:**

Page templates then store a **tree of block instances**, for example:

```json
{
  "type": "section",
  "props": { "background": "primary", "padding": "40px 20px" },
  "children": [
    {
      "type": "hero-banner",
      "props": {
        "title": "Welcome",
        "subtitle": "Shop our latest collection",
        "ctaLabel": "Shop now"
      }
    },
    {
      "type": "product-grid",
      "props": {
        "collection": "featured",
        "itemsPerRow": 4
      }
    }
  ]
}
```

This structure is what a visual builder manipulates during drag‑and‑drop and property editing.

#### 2.5 Styling (CSS & Design Tokens)

Styling is commonly split into:

- **Design tokens / theme settings** (structured):
  - Colors (`primaryColor`, `backgroundColor`, `textColor`).
  - Typography (`fontFamily`, `fontSizeScale`, `lineHeights`).
  - Spacing (`spacingScale`, `containerWidth`).
  - Border radius, shadows, breakpoints, etc.
  - Stored as JSON (e.g. `theme_settings` table or JSON column).
- **CSS sources** (unstructured but referenced):
  - Raw SCSS/LESS files if using a preprocessor.
  - Compiled CSS bundles:
    - `base.css` (resets, base typography).
    - `components.css` (buttons, cards, navbars).
    - `layout.css` (grid, containers, spacing).
  - Each CSS asset is stored in:
    - A static assets bucket (like S3/GCS).
    - Or a dedicated static files service.

At runtime, design tokens often map to **CSS variables**:

```css
:root {
  --primary-color: #5e72e4;
  --font-family-base: 'Inter', system-ui, sans-serif;
}
```

which are then used across theme CSS.

#### 2.6 Assets (Images, Fonts, JS)

Non‑content assets that belong to the theme include:

- Logos, brand images, decorative backgrounds.
- Icon sets and illustrations.
- Web fonts (self‑hosted or referenced from external CDNs).
- JavaScript bundles for interactive components (carousels, animations, product grids).

**Storage strategy:**

- Store as objects (e.g. in S3 or a similar storage).
- Record metadata in DB:
  - `assetId`, `themeVersionId`, `type` (`image`, `font`, `js`).
  - `url`, `checksum`, `dimensions` (for images), `mimeType`.

---

### 3. Storage Layers

#### 3.1 Database Layer

A relational or document database stores:

- Themes & theme versions (`themes`, `theme_versions`).
- Templates & block trees (`templates`, `template_blocks`).
- Design tokens & settings (`theme_settings`).
- Optional configuration and mapping tables (e.g. template ↔ route mapping).

**Why DB?**

- Strong consistency for edits.
- Querying capability (e.g. find all themes for tenant X, all versions, etc.).
- Transactional updates for multi‑step publish flows.

#### 3.2 Object / Blob Storage

Binary and static artifacts are better stored outside the DB:

- Compiled CSS and JS bundles.
- Image and font files.
- Pre‑rendered HTML snapshots (optional).

**Why?**

- Efficient for large / binary content.
- CDN‑friendly URLs.
- Can be versioned by file name (e.g. `theme-1234-v5.ab12cd.css`).

Fields in DB reference these assets via URLs or storage keys.

#### 3.3 Cache & CDN

For performance:

- **CDN**:
  - Caches public assets: CSS, JS, fonts, images.
  - Serves them from edge locations near users.
- **Application cache** (Redis, memory):
  - Caches:
    - Resolved theme for a tenant (`tenantId + themeId + version`).
    - Template structures for popular pages.
    - Pre‑rendered layout fragments (header/footer).

Cache keys usually encode `themeId` + `themeVersion` so invalidation is straightforward.

---

### 4. Access Patterns – How Themes Are Used

#### 4.1 Access in the Visual Builder

When a user edits a theme via a builder (visual or code editor):

1. **Fetch theme + active version**  
   API example:

   - `GET /api/themes/:themeId?version=current`
   - Response:
     - Theme/entity metadata.
     - Active `ThemeVersion` info.
     - List of templates and block trees.
     - Theme settings & design tokens.
     - Asset URLs (CSS/JS/images).

2. **Load into editor engine**  
   Visual editor (like a GrapesJS‑style builder):

   - Converts stored template structure to an **in‑memory component tree**.
   - Injects theme CSS and JS into an iframe or preview environment.
   - Marks all elements/components as draggable/selectable/stylable based on metadata.

3. **Editing loop**  

   As the user interacts:

   - Structural edits (drag/drop, add/remove sections):
     - Modify the in‑memory block/tree representation.
   - Style edits (colors, fonts, spacing):
     - Update design tokens and/or inline styles on components.
   - Content placeholder edits (labels, placeholder text):
     - Update block props within the tree.

   The builder then serializes changes back to the backend:

   - `PUT /api/themes/:themeId/versions/:versionId/templates/:templateId`
   - Payload: updated block tree or HTML.

4. **Previewing edits (draft mode)**  

   A dedicated preview endpoint uses the same rendering logic as production but with a **draft version**:

   - `GET /preview/:themeId/:pageSlug?version=draft`

   This allows QA and stakeholders to see changes in situ without going live.

#### 4.2 Access in Runtime (Serving Real Users)

When an end user requests a page (e.g. `/products/some-product`):

1. **Resolve tenant & theme**  

   - Determine which tenant/site the request belongs to.
   - Look up active theme: `Theme` with `currentVersionId`.
   - Determine which theme version to use (often `currentVersionId` unless A/B testing).

2. **Resolve template**  

   - Use routing rules from the theme:
     - Match the request path against `routePattern`s.
     - Select the appropriate template (e.g. `product` template).

3. **Fetch theme assets**  

   - From cache or DB:
     - Template structure (block tree or HTML).
     - Design tokens/settings.
     - CSS/JS URLs.

4. **Fetch content data**  

   - Using bindings defined in the template (e.g. `productId` from route):
     - Fetch product/blog/post data from the content database or API.

5. **Compose response**  

   Depending on implementation:

   - **HTML‑first approach**:
     - Render HTML server‑side:
       - Fill placeholders in template (e.g. `{{product.title}}`).
     - Include `<link>` tags for CSS and `<script>` tags for JS.
   - **Component‑schema approach**:
     - Render components (React/Vue/other) either:
       - On server (SSR) or
       - On client (CSR) using JSON schema + data.
     - The runtime renderer maps block types to component implementations.

6. **Send to client**  

   - HTTP response contains:
     - HTML (including theme markup).
     - References to theme CSS/JS assets.
     - Any necessary inline critical CSS or JS.

---

### 5. Access Control & Multi‑Tenant Isolation

In multi‑tenant systems:

- **Per‑tenant themes**:
  - `theme.tenantId` ensures themes are scoped to one tenant/workspace.
  - All API queries must filter by `tenantId` derived from authentication context.

- **Permissions**:
  - Roles per tenant:
    - `theme_admin`: can create/edit/publish themes.
    - `theme_designer`: can edit drafts.
    - `theme_viewer`: can view/preview.
  - Backend enforces:
    - Only authorized roles can modify `ThemeVersion` records.
    - Production runtime only loads **published** versions.

---

### 6. Editing Lifecycle

#### 6.1 Drafting & Preview

Workflow:

1. **Create draft version**:
   - `POST /api/themes/:themeId/versions`
   - Starts from either:
     - A blank theme.
     - A copy/cloned from current published version.

2. **Edit via builder**:
   - Multiple sessions can update the same draft (depending on locking strategy).
   - Autosave or explicit save sends incremental updates to the backend.

3. **Preview draft**:
   - Frontend requests:
     - `GET /preview/:themeId/:pageSlug?version=draft`.
   - Backend uses the draft structures and assets to render pages only for authenticated preview sessions.

#### 6.2 Publishing

When the user publishes the theme:

1. Backend checks that:
   - Draft version passes validation (no missing assets, templates cover all configured routes).
2. Marks version as `published`:
   - Updates `ThemeVersion.status`.
   - Updates `Theme.currentVersionId` to point to this version.
3. Invalidates caches:
   - Purges CDN entries for outdated CSS/JS/HTML.
   - Clears any app‑level layout caches keyed by old version.

#### 6.3 Rollback

To rollback to a previous version:

1. Select a previous `ThemeVersion` where `status = published`.
2. Set it as the new `currentVersionId`.
3. Optionally:
   - Mark the recently published version as `archived`.
4. Clear caches again so the rollback takes effect globally.

---

### 7. Representation Strategies: HTML vs JSON Schema

#### 7.1 HTML‑First Storage

**Characteristics:**

- Templates are stored as HTML strings.
- Placeholders or directives embed dynamic parts (e.g. `{{title}}`, `{{content}}`).
- Visual builders operate by parsing and modifying HTML.

**Pros:**

- Simple to reason about.
- Easy export to any system that understands HTML.
- Good for purely content‑driven themes.

**Cons:**

- Harder to perform semantic operations like:
  - “Move hero section up”.
  - “Switch a grid from 3 to 4 columns” without brittle DOM manipulations.
- Complex to do type‑safe configuration (e.g. `product-grid` options).

#### 7.2 JSON / Component Schema Storage

**Characteristics:**

- Templates are stored as structured data representing a tree of components.
- Each node has:
  - `type` (component/block type).
  - `props` (configuration).
  - `children`.

**Pros:**

- Easy for visual editors to manipulate nodes (drag/drop, duplicate, move).
- Component implementations can be swapped without changing stored schema.
- Simplifies multi‑channel rendering (web, mobile, email) using same schema.

**Cons:**

- Requires a rendering engine to convert schema → HTML or UI components.
- Harder to edit “by hand” compared to direct HTML.

**Hybrid approach**:

- Store **canonical JSON schema**.
- Generate HTML (for previews and runtime) via a renderer.
- Optionally store rendered HTML snapshots for performance.

---

### 8. Theme Settings & Environment Configuration

#### 8.1 Theme Settings

Theme settings capture global configuration:

- **Colors**:
  - Primary/secondary colors, text/background, states (hover/active).
- **Typography**:
  - Font families, sizes, weights, headings vs body.
- **Layout**:
  - Container widths, gutters, breakpoints.
- **Brand elements**:
  - Logos, favicons, default social links.

Stored as one or more JSON documents per `ThemeVersion`, e.g.:

```json
{
  "colors": {
    "primary": "#5e72e4",
    "background": "#ffffff",
    "text": "#111827"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "baseFontSize": "16px"
  }
}
```

At render time, these values are:

- Exposed as CSS variables.
- Used by template logic or components to choose styles.

#### 8.2 Environment‑Specific Overrides

Different environments (dev, staging, production) may require:

- Different asset base URLs (CDN endpoints).
- Different analytics scripts or tags.
- Feature flags for theme components.

Approach:

- Store **environment configs** separately:
  - `theme_environment_configs` table keyed by `(themeVersionId, environment)`.
- Merge base theme settings with environment overrides at render time.

---

### 9. Performance & Scalability

To make theme rendering fast and scalable:

- **Static assets on CDN**:
  - Pre‑compile theme CSS/JS and upload once per version.
  - Use content‑hashing (e.g. `theme-1234-v6.ab12cd.css`) so CDN caches are long‑lived.

- **Template caching**:
  - Cache parsed template schema or HTML for each `(themeVersionId, templateId)` key.
  - Invalidate on publish or template updates.

- **HTML pre‑rendering (optional)**:
  - For high‑traffic routes:
    - Pre‑render full HTML for certain URLs and serve from cache until content changes.
    - Or pre‑render only shared fragments (header/footer).

- **Builder performance**:
  - Load only what’s necessary:
    - Active theme, active page template, required blocks.
  - Lazy‑load rarely used widgets or configuration panels.
  - Debounce autosaves and style updates.

---

### 10. Summary

- **Themes** are versioned, structured bundles of templates, styles, settings, and assets.
- **Storage**:
  - DB: metadata, versions, templates, block trees, settings.
  - Object storage: CSS/JS bundles, images, fonts, pre‑rendered HTML (optional).
  - Cache/CDN: hot assets and rendered layouts.
- **Access**:
  - Builders/editors fetch full theme structure for editing and push back updates as structured data (HTML or JSON) plus assets.
  - Runtime renderers resolve the active theme version for each request, fetch the relevant template and settings, combine with content, and output HTML referencing theme assets.
- **Lifecycle**:
  - Draft → preview → publish → (optional) rollback, all tracked via `ThemeVersion`.
- **Representation**:
  - Can be HTML‑first, schema‑first, or hybrid, depending on how much structure you want and how powerful the editor needs to be.

