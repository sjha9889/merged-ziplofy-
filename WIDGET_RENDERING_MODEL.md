## Widget Rendering Model (Elementor Builder)

### 1. What a "Widget" Is in This System

In the visual Elementor‑style builder (`CustomThemeBuilder.tsx`), a **widget** is represented as a **GrapesJS BlockManager block**:

- Each widget is defined once in code as a block with:
  - A unique **block ID** (e.g. `section`, `navbar`, `hero-section`, `product-card`).
  - A **label** shown in the left widgets panel.
  - A **category** (Layout, Basic, Forms, Content, etc.).
  - An HTML **content snippet** decorated with `data-gjs-*` attributes.
- At edit time, users see widgets as tiles/buttons in the **blocks panel** and can:
  - **Click** to insert them into the page.
  - Or **drag‑and‑drop** onto the canvas.

Widgets are not React components directly; they are **HTML + metadata** that GrapesJS converts into its internal component tree.

---

### 2. Where Widgets Live: GrapesJS BlockManager

When the builder initializes GrapesJS, it configures the BlockManager like this:

- In the GrapesJS init config (inside `CustomThemeBuilder.tsx`):
  - `blockManager: {`
    - `appendTo: '#blocks-panel',`
    - `appendOnClick: true`
  - `}`

This means:

- The list of widgets (blocks) is rendered into the DOM element with id `blocks-panel` (the **left sidebar**).
- Clicking a widget tile **immediately appends** the widget’s `content` into the canvas (no drag required), thanks to `appendOnClick: true`.

After the editor instance is ready, the code grabs the BlockManager:

- `const bm = editor.BlockManager;`

and uses it to **register all custom widgets**.

---

### 3. Defining Widgets (Blocks) in Code

The main registration logic is in `CustomThemeBuilder.tsx`:

- After verifying `bm` exists (`editor.BlockManager`) and logging block count:
  - The code calls `bm.add('id', { label, category, content })` for each widget.

#### 3.1 Layout Widgets

Examples:

- **Section**:
  - `bm.add('section', {`
    - `label: 'Section',`
    - `category: 'Layout',`
    - `content: '<section ... data-gjs-droppable="*" data-gjs-selectable="true"> ... </section>'`
  - `});`
  - A full‑width section with padding, background, and a droppable inner container.
- **Columns (2, 3, 4)**:
  - Use CSS grid with `data-gjs-droppable="*"` on child cells so you can drop other widgets inside.
- **Row / Divider / Spacer / Navbar**:
  - Provide common layout patterns, again decorated with `data-gjs-*` attributes.

All layout widgets are designed so:

- The outer wrapper is **selectable & droppable**.
- Inner containers are droppable, so users can add nested content.

#### 3.2 Text Widgets

Examples:

- `heading-1`, `heading-2`, `heading-3`, `heading-4`, `paragraph`, `text-block`, `quote`, `list`, etc.
- They use:
  - `data-gjs-type="text"` and `data-gjs-editable="true"` so:
    - GrapesJS knows these are text components.
    - The user can double‑click and edit the text directly.
  - `data-gjs-selectable="true"` so clicking selects the entire text component for styling.

#### 3.3 Button & Link Widgets

- `button`, `button-outline`, `button-text`, `link`, `page-link`, `link-block`:
  - Styled `<button>` or `<a>` elements with:
    - `data-gjs-type="text"` and `data-gjs-editable="true"` for inline text editing.
    - `data-gjs-selectable="true"` so they become selectable components.
  - Later, the `component:selected` handler adds **navigation traits** (URL, target, etc.) to these components.

#### 3.4 Media & Form Widgets

- `image`, `image-gallery`, `video`, `google-maps`:
  - `<img>`, `<video>`, `<iframe>` elements with droppable/interactive wrappers.
  - Marked so they can be resized (via `resizable` flags) and styled.
- `form`, `form-simple`, `input-text`, `input-email`, `textarea-field`, etc.:
  - Structured HTML forms with inputs and labels.
  - Inputs are wrapped in containers that are selectable/droppable so layout can be adjusted.

#### 3.5 Composite / Section Widgets

- `hero-section`, `feature-section`, `team-section`, `faq-section`, `stats-section`, `cta-section`, etc.:
  - Larger **pre‑designed sections** composed of multiple headings, texts, buttons, images, etc.
  - Intended as “starter” blocks you can customize rather than building everything from primitives.

---

### 4. How Widgets Are Rendered in the UI (Editor Side)

#### 4.1 Blocks Panel (Widget List)

- When GrapesJS is initialized:
  - It uses the list of blocks registered via `BlockManager.add`.
  - It renders each block as a tile/card in `#blocks-panel`:
    - Shows the **label**.
    - Groups by **category** (e.g. Layout, Basic, Forms, Content).
- You can:
  - **Click** a block → GrapesJS inserts the block’s `content` into the canvas (because `appendOnClick: true`).
  - Or **drag** a block onto the canvas iframe.

#### 4.2 Canvas & Component Tree

When a widget is inserted (click or drag‑drop):

1. **GrapesJS parses `content`**:
   - The `content` HTML is parsed into one or more **component models** under the page `wrapper`.
   - Each DOM element becomes a component with:
     - `tagName`, attributes (including all `data-gjs-*` flags).
     - Children (`components()` collection).
2. **Your selectability configuration runs**:
   - Either for the whole canvas (`runExpandAndConfigureSelectability`) or for just the new component subtree (`runExpandAndConfigureSelectabilityForComponent`).
   - This ensures:
     - `selectable: true`, `hoverable: true`, `stylable: true`, `draggable: true`.
     - `droppable: '*'` for containers.
     - `editable: true` for text‑like elements.
3. **Canvas iframe renders** the widget:
   - The iframe shows the resulting HTML (styled using theme CSS).
   - GrapesJS overlays selection frames, highlight outlines, resize handles.

---

### 5. Drag‑and‑Drop Behavior for Widgets

Widgets leverage the same drag‑and‑drop system that other blocks use, plus custom safeguards:

- When you drag a widget block:
  - The code listens to `block:drag:start` and `block:drag:stop`.
  - It tracks the **cursor element** inside the iframe with a `dragover` listener.
  - It snapshots the **pre‑drop HTML** and component count so it can detect if GrapesJS erroneously replaces the whole theme with only the dropped block.

**On drop:**

- If GrapesJS replaced too much:
  - The code restores the previous HTML and uses helpers like `getDropTarget` and `appendBlockToTarget` to manually insert the widget into the right place.
- If GrapesJS misses the drop:
  - It manually calls `appendBlockToTarget(editor, blockToAdd, dropTarget)` to ensure the widget appears.
- After inserting:
  - It selects the new component and opens the **style panel** so the user can customize it.

This makes widget drops robust even with complex theme HTML.

---

### 6. Widget Lifecycle in the Builder

1. **Definition**: Widgets are declared in code via `BlockManager.add` with `label`, `category`, and `content` HTML.
2. **Display**: GrapesJS renders them as tiles in the `#blocks-panel` sidebar.
3. **Insertion**:
   - Click/drag inserts the widget content into the canvas.
   - GrapesJS parses content → creates component models.
4. **Configuration**:
   - Your selectability/interaction logic sets properties (`selectable`, `droppable`, `editable`, `resizable`).
   - `component:add` and `component:selected` handlers add extra behavior (traits for links/buttons, style panel syncing, etc.).
5. **Editing**:
   - Users can drag widgets around, nest them, edit text, update styles, configure props (like URLs).
6. **Saving**:
   - The final page HTML (including all widget markup) is serialized (via `editor.getHtml()` + `editor.getCss()`).
   - On backend save, widgets are no longer “blocks”, they are just part of the theme’s HTML/CSS.

---

### 7. Widgets at Runtime (Outside the Builder)

At runtime (for live visitors):

- There is no GrapesJS or BlockManager:
  - The page is served as **plain HTML** that was composed when you assembled widgets in the builder.
  - Widgets are just sections, divs, headings, buttons, etc. in the output HTML, styled by the theme’s CSS.
- Any widget‑specific JS (e.g. sliders, carousels) is provided by the theme’s JS bundles and executed normally in the browser.

In other words:

- **In the builder**: widgets are interactive blocks powered by GrapesJS and your custom logic.
- **In production**: they are standard markup and styles, indistinguishable from hand‑written HTML, which makes the final site fast and framework‑agnostic.

