// ---------------------------
// script.js - Fully Fixed
// ---------------------------


console.log("script.js loaded.");

document.addEventListener("DOMContentLoaded", function () {
  // ---------- NAVBAR ----------
  const navbar = document.getElementById("main-nav");
  const navbarLinks = document.querySelectorAll("#main-nav .nav-link");

  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled");
        navbarLinks.forEach((link) => (link.style.color = "#333"));
      } else {
        navbar.classList.remove("navbar-scrolled");
        navbarLinks.forEach((link) => (link.style.color = "#fff"));
      }
    });

    // Smooth scroll
    navbarLinks.forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && href.startsWith("#") && document.querySelector(href)) {
          e.preventDefault();
          document.querySelector(href).scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Close navbar on mobile
    navbarLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const navbarCollapse = document.getElementById("navbarNav");
        if (
          typeof bootstrap !== "undefined" &&
          navbarCollapse instanceof Element
        ) {
          const bsCollapse =
            bootstrap.Collapse.getInstance(navbarCollapse) ||
            new bootstrap.Collapse(navbarCollapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }

  // ---------- PRICE RANGE ----------
  const priceRange = document.getElementById("priceRange");
  if (priceRange) {
    const priceDisplayMax = priceRange.previousElementSibling?.lastElementChild;
    priceRange.addEventListener("input", (e) => {
      if (priceDisplayMax) priceDisplayMax.textContent = `₹${e.target.value}`;
    });
  }

  // ---------- QUICK VIEW ----------
  document.querySelectorAll(".quick-view-btn").forEach((button) => {
    button.addEventListener("click", () => {
      alert("Quick View functionality coming soon!");
    });
  });

  // ---------- WISHLIST ----------
  document.querySelectorAll(".wishlist-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("bi-heart");
      e.currentTarget.classList.toggle("bi-heart-fill");
      e.currentTarget.style.color = e.currentTarget.classList.contains(
        "bi-heart-fill"
      )
        ? "var(--primary-color)"
        : "#ccc";
    });
  });

  // ---------- ADD TO CART ----------
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  });

  // ---------- PRODUCT PAGE: IMAGE GALLERY ----------
  const mainProductImage = document.querySelector(".large-product-image");
  const productThumbnails = document.querySelectorAll(".product-thumbnail");
  const fullImageModalSrc = document.getElementById("fullImageModalSrc");

  if (mainProductImage && productThumbnails.length > 0) {
    productThumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        productThumbnails.forEach((t) => t.classList.remove("active"));
        thumbnail.classList.add("active");
        mainProductImage.src = thumbnail.src;
        if (fullImageModalSrc) fullImageModalSrc.src = thumbnail.src;
      });
    });
  }

  // ---------- PRODUCT PAGE: COLOR OPTIONS ----------
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      colorOptions.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
    });
  });

  // ---------- PRODUCT PAGE: QUANTITY SELECTOR ----------
  const decreaseQuantityBtn = document.getElementById("decreaseQuantity");
  const increaseQuantityBtn = document.getElementById("increaseQuantity");
  const quantityInput = document.getElementById("quantityInput");

  if (decreaseQuantityBtn && increaseQuantityBtn && quantityInput) {
    decreaseQuantityBtn.addEventListener("click", () => {
      let val = parseInt(quantityInput.value || "1", 10);
      if (val > 1) quantityInput.value = val - 1;
    });
    increaseQuantityBtn.addEventListener("click", () => {
      let val = parseInt(quantityInput.value || "1", 10);
      quantityInput.value = val + 1;
    });
  }

  // ---------- PRODUCT PAGE: REVIEWS ----------
  const reviewStars = document.querySelectorAll(".star-rating-input i");
  let currentRating = 0;
  reviewStars.forEach((star, index) => {
    star.addEventListener("click", () => {
      currentRating = index + 1;
      reviewStars.forEach((s, i) => {
        if (i < currentRating) s.classList.replace("bi-star", "bi-star-fill");
        else s.classList.replace("bi-star-fill", "bi-star");
      });
    });
  });

  const reviewForm = document.getElementById("reviewForm");
  const customerReviewsDiv = document.getElementById("customerReviews");
  if (reviewForm && customerReviewsDiv) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const reviewerName = document.getElementById("reviewerName")?.value;
      const reviewComment = document.getElementById("reviewComment")?.value;
      const reviewDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (reviewerName && reviewComment && currentRating > 0) {
        const newReviewHtml = `
          <div class="review-item border-bottom pb-3 mb-3">
            <div class="d-flex justify-content-between">
              <h6 class="mb-0">${reviewerName}</h6>
              <div class="star-rating small">
                ${Array(currentRating)
                  .fill('<i class="bi bi-star-fill"></i>')
                  .join("")}
                ${Array(5 - currentRating)
                  .fill('<i class="bi bi-star"></i>')
                  .join("")}
              </div>
            </div>
            <p class="text-muted small">Reviewed on ${reviewDate}</p>
            <p>${reviewComment}</p>
          </div>`;
        customerReviewsDiv.insertAdjacentHTML("beforeend", newReviewHtml);
        reviewForm.reset();
        currentRating = 0;
        reviewStars.forEach((s) =>
          s.classList.replace("bi-star-fill", "bi-star")
        );
      } else {
        alert("Please fill in all review fields and provide a rating.");
      }
    });
  }

  // ---------- CART PAGE ----------
  const cartItemsList = document.getElementById("cartItemsList");
  const orderSummarySubtotal = document.getElementById("orderSummarySubtotal");
  const orderSummaryShipping = document.getElementById("orderSummaryShipping");
  const orderSummaryTaxes = document.getElementById("orderSummaryTaxes");
  const orderSummaryGrandTotal = document.getElementById(
    "orderSummaryGrandTotal"
  );

  function updateCartTotals() {
    let subtotal = 0;
    document.querySelectorAll(".cart-item").forEach((item) => {
      const quantityInput = item.querySelector(".cart-quantity-input");
      const price = parseFloat(quantityInput.dataset.price || 0);
      const quantity = parseInt(quantityInput.value, 10);
      const itemSubtotal = price * quantity;
      const subEl = item.querySelector(".product-subtotal");
      if (subEl) subEl.textContent = `₹${itemSubtotal.toFixed(2)}`;
      subtotal += itemSubtotal;
    });

    if (orderSummarySubtotal)
      orderSummarySubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    let shipping = subtotal > 1000 ? 0 : 50;
    if (orderSummaryShipping)
      orderSummaryShipping.textContent = `₹${shipping.toFixed(2)}`;
    const taxes = subtotal * 0.1;
    if (orderSummaryTaxes)
      orderSummaryTaxes.textContent = `₹${taxes.toFixed(2)}`;
    const grandTotal = subtotal + shipping + taxes;
    if (orderSummaryGrandTotal)
      orderSummaryGrandTotal.textContent = `₹${grandTotal.toFixed(2)}`;

    if (cartItemsList) {
      const emptyMsg = document.getElementById("emptyCartMessage");
      if (subtotal === 0) {
        cartItemsList.style.display = "none";
        if (emptyMsg) emptyMsg.style.display = "block";
      } else {
        cartItemsList.style.display = "block";
        if (emptyMsg) emptyMsg.style.display = "none";
      }
    }
  }

  // Cart buttons
  document.querySelectorAll(".cart-item").forEach((item) => {
    const decreaseBtn = item.querySelector(".decrease-quantity");
    const increaseBtn = item.querySelector(".increase-quantity");
    const quantityInput = item.querySelector(".cart-quantity-input");
    const removeBtn = item.querySelector(".remove-item");

    if (decreaseBtn && quantityInput) {
      decreaseBtn.addEventListener("click", () => {
        let val = parseInt(quantityInput.value, 10);
        if (val > 1) quantityInput.value = val - 1;
        updateCartTotals();
      });
    }
    if (increaseBtn && quantityInput) {
      increaseBtn.addEventListener("click", () => {
        quantityInput.value = parseInt(quantityInput.value, 10) + 1;
        updateCartTotals();
      });
    }
    if (quantityInput) {
      quantityInput.addEventListener("input", updateCartTotals);
    }
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        item.remove();
        updateCartTotals();
      });
    }
  });

  updateCartTotals();

  const proceedToCheckoutBtn = document.getElementById("proceedToCheckoutBtn");
  if (proceedToCheckoutBtn) {
    proceedToCheckoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
  const continueShoppingBtn = document.getElementById("continueShoppingBtn");
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      window.location.href = "shop.html";
    });
  }
});
