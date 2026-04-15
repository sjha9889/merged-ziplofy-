const THEME_SCRIPT_IDS = [
  'theme-script-main',
  'theme-script-add-to-cart',
  'theme-script-products-carousel',
  'theme-script-cart',
  'theme-script-checkout',
  'theme-script-wishlist',
  'theme-script-account',
  'theme-script-blog',
  'theme-script-blog-detail',
  'theme-script-contact',
]

type ScriptSpec = { id: string; src: string }

const THEME_SCRIPTS: ScriptSpec[] = [
  { id: 'theme-script-main', src: '/assets/js/main.js' },
  { id: 'theme-script-add-to-cart', src: '/assets/js/add-to-cart.js' },
  { id: 'theme-script-products-carousel', src: '/assets/js/products-carousel.js' },
  { id: 'theme-script-cart', src: '/assets/js/cart.js' },
  { id: 'theme-script-checkout', src: '/assets/js/checkout.js' },
  { id: 'theme-script-wishlist', src: '/assets/js/wishlist.js' },
  { id: 'theme-script-account', src: '/assets/js/account.js' },
  { id: 'theme-script-blog', src: '/assets/js/blog.js' },
  { id: 'theme-script-blog-detail', src: '/assets/js/blog-detail.js' },
  { id: 'theme-script-contact', src: '/assets/js/contact.js' },
]

function removeExistingThemeScripts() {
  for (const id of THEME_SCRIPT_IDS) {
    const el = document.getElementById(id)
    el?.parentElement?.removeChild(el)
  }
}

function addThemeScripts() {
  const parent = document.body
  for (const { id, src } of THEME_SCRIPTS) {
    const s = document.createElement('script')
    s.id = id
    s.src = src
    // not module scripts; keep sync execution order
    s.async = false
    parent.appendChild(s)
  }
}

export function reinitThemeRuntime() {
  // Re-run AOS after navigation if it exists.
  const anyWindow = window as unknown as { AOS?: { init: () => void; refreshHard?: () => void } }
  try {
    anyWindow.AOS?.init?.()
    anyWindow.AOS?.refreshHard?.()
  } catch {
    // ignore
  }

  // Theme scripts bind via DOMContentLoaded / initial scan.
  // In an SPA, we re-inject them so they bind to the current DOM.
  removeExistingThemeScripts()
  addThemeScripts()
}

