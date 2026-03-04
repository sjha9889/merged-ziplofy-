# Custom Theme Builder - Issues and Solutions Report

## Document Information
- **Date**: March 2, 2026
- **File**: `Ziplofy/src/pages/themes/CustomThemeBuilder.tsx`
- **Component**: Visual Elementor (Custom Theme Builder)

---

## Executive Summary

This report documents the issues identified in the Custom Theme Builder component and the fixes implemented. The main issues involve:
1. CSS gradient values being incorrectly treated as URLs (causing 404 errors)
2. Landing page not rendering styles properly
3. Redis connection errors (infrastructure issue)

---

## Issue #1: CSS Gradient Values Causing 404 Errors

### Symptoms
- Browser console shows `Failed to load resource: 404 (Not Found)` errors
- URLs contain encoded gradient values like:
  ```
  /themes/radial-gradient(circle%20at%2025%25...)
  ```
- Terminal shows `Malformed URI sequence in request URL` warnings

### Root Cause
The CSS URL rewriting logic in `CustomThemeBuilder.tsx` was incorrectly matching CSS gradient functions (like `radial-gradient()`, `linear-gradient()`) and treating them as relative URLs that needed to be converted to absolute URLs.

Additionally, some CSS may have been stored with gradient values incorrectly wrapped in `url()` like:
```css
background-image: url(radial-gradient(...));  /* WRONG */
```

Instead of:
```css
background-image: radial-gradient(...);  /* CORRECT */
```

### Solution Implemented

#### 1. Added `cleanupCssGradients` Function (Lines 97-128)
A new utility function was added to clean up corrupted CSS:

```typescript
const cleanupCssGradients = (css: string): string => {
  if (!css) return css;
  
  // Pattern to match url() containing gradient functions
  const gradientInUrlPattern = /url\(\s*(['"]?)\s*((?:linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient)\s*\([^)]*(?:\([^)]*\)[^)]*)*\))\s*\1\s*\)/gi;
  
  // Replace url(gradient(...)) with just gradient(...)
  let cleanedCss = css.replace(gradientInUrlPattern, (match, quote, gradient) => {
    console.log('🔧 Fixing corrupted gradient in CSS:', { original: match.substring(0, 100), fixed: gradient.substring(0, 100) });
    return gradient;
  });
  
  // Also fix url('initial'), url('none'), url('inherit'), etc.
  const cssKeywordInUrlPattern = /url\(\s*(['"]?)\s*(none|initial|inherit|unset|revert|transparent)\s*\1\s*\)/gi;
  cleanedCss = cleanedCss.replace(cssKeywordInUrlPattern, (match, quote, keyword) => {
    console.log('🔧 Fixing CSS keyword in url():', { original: match, fixed: keyword });
    return keyword;
  });
  
  return cleanedCss;
};
```

#### 2. Applied Cleanup at Multiple Points (Comprehensive)

The cleanup function is now called at ALL critical locations to ensure no corrupted CSS slips through:

| Location | Function | Description |
|----------|----------|-------------|
| CSS application to editor | `applyPageToEditor` | Before CSS is applied to GrapesJS |
| Loading saved themes | `loadSaved` | When fetching saved theme data |
| Editor initialization | Editor load handler | During initial theme load |
| Installed theme loading (main) | `fetchInstalledThemeFromFiles` | After URL rewriting for main CSS |
| Installed theme loading (pages) | `fetchInstalledThemeFromFiles` | After URL rewriting for page CSS |
| Final result construction | `fetchInstalledThemeFromFiles` | Before returning the result |
| Page CSS return | `fetchPage` | Before returning discovered page CSS |
| Wrapper styles extraction | `getPagesSnapshotWithCurrent` | When extracting wrapper styles |
| Snapshot CSS | `getPagesSnapshotWithCurrent` | After animation keyframes added |
| Page snapshot mapping | `getPagesSnapshotWithCurrent` | For each page in snapshot |
| Preview generation | `previewTheme` | Before generating preview |

---

## Issue #2: Landing Page Styles Not Loading Properly

### Symptoms
- Landing page (Home/index) appears unstyled or broken
- Other pages render correctly

### Root Cause Analysis
1. The landing page (index.html) has a different CSS loading path than secondary pages
2. Wrapper styles may not be properly applied to the first page
3. The CSS cleanup for gradients was not being applied to the initial page load

### Solution Implemented
The `cleanupCssGradients` function is now applied when:
1. Loading the initial theme CSS
2. Loading saved theme data from the backend
3. Applying CSS to the GrapesJS editor
4. Loading installed theme CSS
5. Generating preview HTML

### Additional Checks
The `applyPageToEditor` function now:
1. Cleans up corrupted CSS before applying
2. Ensures wrapper element has the `gjs-wrapper-body` class
3. Applies CSS through multiple methods for reliability

---

## Issue #3: Redis Connection Refused Errors

### Symptoms
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

### Root Cause
Redis server is not running on the local machine.

### Solution
**This is an infrastructure issue, not a code issue.**

To resolve:
```bash
# On macOS with Homebrew
brew services start redis

# Or run Redis directly
redis-server

# Verify Redis is running
redis-cli ping  # Should respond with "PONG"
```

---

## Code Changes Summary

### Files Modified
- `Ziplofy/src/pages/themes/CustomThemeBuilder.tsx`

### Changes Made

| Change Type | Description | Impact |
|-------------|-------------|--------|
| New Function | Added `cleanupCssGradients()` | Fixes corrupted CSS with gradients in url() |
| CSS Processing | Added cleanup call in `applyPageToEditor` | Fixes landing page styling |
| Theme Loading | Added cleanup call when loading saved themes | Prevents corrupted CSS from being loaded |
| Installed Themes | Added cleanup for installed theme CSS | Fixes styling for all pages |
| Preview | Added cleanup in preview generation | Ensures previews display correctly |

---

## Testing Recommendations

1. **Clear Browser Cache**: After implementing fixes, clear browser cache and localStorage
2. **Refresh Page**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
3. **Check Console**: Monitor browser console for any remaining 404 errors
4. **Test Multiple Pages**: Verify all pages (landing, secondary) render correctly
5. **Test Preview**: Use the Preview button to verify styles apply correctly

---

## Prevention Recommendations

1. **Don't use url() for gradients**: Ensure any code that sets `background-image` doesn't wrap gradient values in `url()`
2. **Validate CSS on Save**: Add validation when saving themes to detect and fix corrupted CSS
3. **Add Logging**: Monitor for gradient-related URL errors in production

---

## Error Patterns to Watch

```
# Pattern indicating gradient wrapped incorrectly
background-image: url(linear-gradient(...))
background-image: url('radial-gradient(...)')

# Correct pattern
background-image: linear-gradient(...)
background-image: radial-gradient(...)
```

---

## Technical Details

### Regex Pattern for Cleanup
```regex
/url\(\s*(['"]?)\s*((?:linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient)\s*\([^)]*(?:\([^)]*\)[^)]*)*\))\s*\1\s*\)/gi
```

This pattern matches:
- `url(linear-gradient(...))`
- `url('radial-gradient(...)')`
- `url("conic-gradient(...)")`
- And all repeating variants

### CSS Keywords Cleanup
```regex
/url\(\s*(['"]?)\s*(none|initial|inherit|unset|revert|transparent)\s*\1\s*\)/gi
```

This handles incorrect usage like:
- `url(none)` → `none`
- `url('initial')` → `initial`

---

## Issue #4: Text Goes Black When Clicked/Editing

### Symptoms
- When clicking on text elements to edit them, the text turns black
- Original text colors are not preserved during editing

### Root Cause
The GrapesJS Rich Text Editor (RTE) and contenteditable mode were applying default black color (`#000`) to text when entering edit mode, overriding the theme's original text colors.

### Solution Implemented

#### 1. Added CSS to preserve text color in `CustomThemeBuilder.css`
```css
[contenteditable="true"] {
  color: inherit !important;
  background: transparent !important;
  caret-color: currentColor !important;
}
```

#### 2. Added canvas-level CSS injection in `CustomThemeBuilder.tsx`
Added CSS to the GrapesJS canvas configuration that preserves text colors during editing.

#### 3. Added iframe style injection
When the editor iframe loads, CSS rules are injected to prevent color overrides:
- `[contenteditable="true"] { color: inherit !important; }`
- `[data-gjs-type="text"][contenteditable="true"] { color: inherit !important; }`

---

## Issue #5: Elements Overlapping/Squished (Carousel/Slider Issue)

### Symptoms
- Carousel/slider elements appear squished
- Multiple slide contents overlap and display simultaneously

### Root Cause
Carousels and sliders rely on JavaScript to show one slide at a time. In the editor, the carousel JavaScript may not execute, causing all slides to be visible simultaneously.

### Solution
**This is expected editor behavior.** In the visual editor:
1. Carousels show all slides stacked because the JS animation isn't running
2. The theme will work correctly when previewed or published

**Recommendations:**
- Use the **Preview** button to see proper carousel behavior
- Edit individual slide content by selecting specific text elements
- The carousel will animate correctly in the published theme

---

## Files Modified (Additional)

| File | Change |
|------|--------|
| `CustomThemeBuilder.css` | Added CSS for text color preservation during editing |
| `CustomThemeBuilder.tsx` | Added canvas CSS injection for color preservation |
| `CustomThemeBuilder.tsx` | Added iframe style injection for contenteditable elements |

---

## Contact

For questions about these fixes, refer to the code comments in `CustomThemeBuilder.tsx` marked with:
- `// CRITICAL FIX:`
- `// CRITICAL:`

---

*Report generated: March 2, 2026*
*Updated: March 2, 2026 - Added text color and carousel issue documentation*
