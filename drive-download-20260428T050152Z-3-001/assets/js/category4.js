// Mobile menu toggle
const hamburger = document.querySelector(".hamburger");
const drawer = document.querySelector(".mobile-drawer");
if (hamburger && drawer) {
  hamburger.addEventListener("click", () => {
    const open = drawer.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
  });
}

// Filter dropdowns
document.querySelectorAll(".filter .filter-btn").forEach((btn) => {
  const parent = btn.closest(".filter");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".filter.open").forEach((f) => {
      if (f !== parent) f.classList.remove("open");
    });
    parent.classList.toggle("open");
  });
});
document.addEventListener("click", () => {
  document
    .querySelectorAll(".filter.open")
    .forEach((f) => f.classList.remove("open"));
});

// Wishlist toggle animation
document.querySelectorAll(".card .wish").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    btn.classList.toggle("active");
    btn.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.2)" },
        { transform: "scale(1)" },
      ],
      { duration: 220, easing: "ease-out" }
    );
  });
});

// Hover image swap (desktop)
document.querySelectorAll(".card .image img").forEach((img) => {
  const hoverSrc = img.getAttribute("data-hover");
  if (!hoverSrc) return;
  img.addEventListener("mouseenter", () => {
    img.dataset.primary = img.src;
    img.src = hoverSrc;
  });
  img.addEventListener("mouseleave", () => {
    if (img.dataset.primary) img.src = img.dataset.primary;
  });
});

// Sticky header compact on scroll
const header = document.querySelector(".site-header");
let lastY = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (!header) return;
  header.style.boxShadow = y > 12 ? "0 6px 30px rgba(0,0,0,.35)" : "none";
  lastY = y;
});
