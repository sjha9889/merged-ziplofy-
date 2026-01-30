/* ========================================
   ORNATIVA JEWELRY WEBSITE - COMPLETE JAVASCRIPT
   ======================================== */

// ========================================
// UTILITY FUNCTIONS
// ========================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${
      type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8"
    };
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ========================================
// NAVBAR MODULE
// ========================================
const Navbar = {
  init() {
    this.initScrollEffects();
    this.initMobileMenu();
  },

  initScrollEffects() {
    const header = document.querySelector(".header");
    if (!header) return;

    const debouncedScroll = debounce(() => {
      if (window.scrollY > 100) {
        header.style.background = "rgba(254, 252, 248, 0.98)";
        header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
      } else {
        header.style.background = "rgba(254, 252, 248, 0.95)";
        header.style.boxShadow = "none";
      }
    }, 10);

    window.addEventListener("scroll", debouncedScroll);
  },

  initMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", function () {
        navMenu.classList.toggle("active");
        this.classList.toggle("active");

        // Prevent body scroll when menu is open
        if (navMenu.classList.contains("active")) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      });

      // Close menu when clicking on a link
      const navLinks = document.querySelectorAll(".nav-menu a");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("active");
          hamburger.classList.remove("active");
          document.body.style.overflow = "";
        });
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove("active");
          hamburger.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    }
  },
};

// ========================================
// SMOOTH SCROLLING MODULE
// ========================================
const SmoothScroll = {
  init() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", this.handleClick.bind(this));
    });
  },

  handleClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerHeight = document.querySelector(".header")?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  },
};

// ========================================
// COLLECTION CARDS MODULE
// ========================================
const CollectionCards = {
  init() {
    const collectionCards = document.querySelectorAll(".collection-card");
    collectionCards.forEach((card) => {
      this.initCard(card);
    });
  },

  initCard(card) {
    // Card click to category page
    card.addEventListener("click", function () {
      const category = this.dataset.category;
      if (category) {
        window.location.href = `category.html?category=${category}`;
      }
    });

    // Hover effects
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  },
};

// ========================================
// PRODUCT CARDS MODULE
// ========================================
const ProductCards = {
  init() {
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      this.initCard(card);
    });
  },

  initCard(card) {
    // Card click to product page
    card.addEventListener("click", function (e) {
      // Don't trigger if clicking buttons
      if (e.target.classList.contains("btn") || e.target.closest(".btn")) {
        return;
      }

      const productId = this.dataset.product;
      const productName = this.querySelector(".product-name")?.textContent;

      if (productId) {
        window.location.href = `product.html?id=${productId}`;
      } else if (productName) {
        window.location.href = `product.html?name=${encodeURIComponent(
          productName
        )}`;
      }
    });

    // Add to cart button
    const addToCartBtn = card.querySelector(".btn-primary, .quick-add");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.addToCart(card);
      });
    }

    // Wishlist button
    const wishlistBtn = card.querySelector(".quick-wishlist");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleWishlist(card, wishlistBtn);
      });
    }

    // Hover effects
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.15)";
      this.style.borderColor = "#D4AF37";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.08)";
      this.style.borderColor = "transparent";
    });
  },

  addToCart(productCard) {
    const productName = productCard.querySelector(".product-name")?.textContent;
    const productPrice =
      productCard.querySelector(".product-price")?.textContent;

    if (productName) {
      showNotification(`${productName} added to cart!`, "success");
    }

    // Add to cart animation
    const button = productCard.querySelector(".btn-primary, .quick-add");
    if (button) {
      const originalText = button.textContent;
      button.textContent = "Added!";
      button.style.background = "#28a745";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "";
      }, 2000);
    }

    console.log("Added to cart:", { productName, productPrice });
  },

  toggleWishlist(productCard, button) {
    const icon = button.querySelector("i");
    if (!icon) return;

    const isWishlisted = icon.classList.contains("fas");

    if (isWishlisted) {
      icon.classList.remove("fas");
      icon.classList.add("far");
      showNotification("Removed from wishlist", "info");
    } else {
      icon.classList.remove("far");
      icon.classList.add("fas");
      showNotification("Added to wishlist", "success");
    }
  },
};

// ========================================
// GALLERY MODULE
// ========================================
const Gallery = {
  init() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item) => {
      this.initItem(item);
    });
  },

  initItem(item) {
    item.addEventListener("click", function () {
      const productId = this.dataset.product;
      if (productId) {
        window.location.href = `product.html?id=${productId}`;
      }
    });

    // Hover effects
    item.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  },
};

// ========================================
// FILTER & SORT MODULE
// ========================================
const FilterSort = {
  init() {
    this.initFilters();
    this.initSorting();
    this.initPriceSlider();
    this.initStickyFilter();
    this.initURLParams();
  },

  initFilters() {
    const filterToggle = document.getElementById("filterToggle");
    const filterDropdown = document.getElementById("filterDropdown");
    const applyFilters = document.getElementById("applyFilters");
    const clearFilters = document.getElementById("clearFilters");

    if (!filterToggle || !filterDropdown) return;

    // Toggle filter dropdown
    filterToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      filterDropdown.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !filterDropdown.contains(e.target) &&
        !filterToggle.contains(e.target)
      ) {
        filterDropdown.classList.remove("active");
      }
    });

    // Apply filters
    if (applyFilters) {
      applyFilters.addEventListener("click", () => {
        this.applyProductFilters();
        filterDropdown.classList.remove("active");
      });
    }

    // Clear filters
    if (clearFilters) {
      clearFilters.addEventListener("click", () => {
        this.clearAllFilters();
        this.applyProductFilters();
      });
    }
  },

  initPriceSlider() {
    const priceSlider = document.getElementById("priceSlider");
    const currentPrice = document.getElementById("currentPrice");

    if (priceSlider && currentPrice) {
      priceSlider.addEventListener("input", function () {
        const value = this.value;
        currentPrice.textContent = `$${parseInt(value).toLocaleString()}`;
      });
    }
  },

  applyProductFilters() {
    const priceRange = parseInt(
      document.getElementById("priceSlider")?.value || 5000
    );
    const typeFilters = Array.from(
      document.querySelectorAll(
        'input[type="checkbox"][value="gold"], input[type="checkbox"][value="silver"], input[type="checkbox"][value="diamond"], input[type="checkbox"][value="pearl"]'
      )
    )
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    const occasionFilters = Array.from(
      document.querySelectorAll(
        'input[type="checkbox"][value="everyday"], input[type="checkbox"][value="formal"], input[type="checkbox"][value="casual"], input[type="checkbox"][value="special"]'
      )
    )
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    const productCards = document.querySelectorAll(".product-card");
    let visibleCount = 0;

    productCards.forEach((card) => {
      const price = parseInt(card.dataset.price || 0);
      const type = card.dataset.type;
      const occasion = card.dataset.occasion;

      let showCard = true;

      // Price filter
      if (price > priceRange) {
        showCard = false;
      }

      // Type filter
      if (typeFilters.length > 0 && !typeFilters.includes(type)) {
        showCard = false;
      }

      // Occasion filter
      if (occasionFilters.length > 0 && !occasionFilters.includes(occasion)) {
        showCard = false;
      }

      if (showCard) {
        card.style.display = "block";
        card.classList.add("fade-in");
        visibleCount++;
      } else {
        card.style.display = "none";
        card.classList.remove("fade-in");
      }
    });

    this.updateResultsCount(visibleCount);
  },

  clearAllFilters() {
    // Reset price slider
    const priceSlider = document.getElementById("priceSlider");
    const currentPrice = document.getElementById("currentPrice");

    if (priceSlider) {
      priceSlider.value = 5000;
    }
    if (currentPrice) {
      currentPrice.textContent = "$5,000+";
    }

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
  },

  updateResultsCount(count) {
    let resultsCount = document.querySelector(".results-count");
    if (!resultsCount) {
      resultsCount = document.createElement("div");
      resultsCount.className = "results-count";
      const container = document.querySelector(
        ".product-grid-section .container"
      );
      const productsGrid = document.querySelector(".products-grid");

      if (container && productsGrid) {
        container.insertBefore(resultsCount, productsGrid);
      }
    }

    resultsCount.innerHTML = `<strong>${count}</strong> products found`;
  },

  initSorting() {
    const sortSelect = document.getElementById("sortSelect");
    if (!sortSelect) return;

    sortSelect.addEventListener("change", () => {
      this.sortProducts(sortSelect.value);
    });
  },

  sortProducts(sortBy) {
    const productsGrid = document.getElementById("productsGrid");
    if (!productsGrid) return;

    const productCards = Array.from(
      productsGrid.querySelectorAll(".product-card")
    );

    productCards.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            parseInt(a.dataset.price || 0) - parseInt(b.dataset.price || 0)
          );
        case "price-high":
          return (
            parseInt(b.dataset.price || 0) - parseInt(a.dataset.price || 0)
          );
        case "newest":
          return (
            parseInt(b.dataset.price || 0) - parseInt(a.dataset.price || 0)
          );
        case "name":
          const nameA = a.querySelector(".product-name")?.textContent || "";
          const nameB = b.querySelector(".product-name")?.textContent || "";
          return nameA.localeCompare(nameB);
        case "popularity":
        default:
          return 0;
      }
    });

    // Re-append sorted products
    productCards.forEach((card) => {
      productsGrid.appendChild(card);
    });
  },

  initStickyFilter() {
    const filterBar = document.querySelector(".filter-sort-bar");
    const header = document.querySelector(".header");

    if (filterBar && header) {
      const headerHeight = header.offsetHeight;
      const filterBarTop = filterBar.offsetTop;

      const debouncedScroll = debounce(() => {
        if (window.scrollY > filterBarTop - headerHeight) {
          filterBar.style.position = "fixed";
          filterBar.style.top = headerHeight + "px";
          filterBar.style.left = "0";
          filterBar.style.right = "0";
          filterBar.style.zIndex = "100";
        } else {
          filterBar.style.position = "sticky";
          filterBar.style.top = "80px";
        }
      }, 10);

      window.addEventListener("scroll", debouncedScroll);
    }
  },

  initURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");

    if (type) {
      const typeCheckbox = document.querySelector(`input[value="${type}"]`);
      if (typeCheckbox) {
        typeCheckbox.checked = true;
        this.applyProductFilters();
      }
    }
  },
};

// ========================================
// HIGHLIGHT CARDS MODULE
// ========================================
const HighlightCards = {
  init() {
    const highlightCards = document.querySelectorAll(".highlight-card");
    highlightCards.forEach((card) => {
      card.addEventListener("click", function () {
        const category = this.dataset.category;
        if (category) {
          window.location.href = `category.html?type=${category}`;
        }
      });
    });
  },
};

// ========================================
// NEWSLETTER MODULE
// ========================================
const Newsletter = {
  init() {
    const newsletterForms = document.querySelectorAll(".newsletter-form");
    newsletterForms.forEach((form) => {
      this.initForm(form);
    });
  },

  initForm(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = form.querySelector('input[type="email"]')?.value;
      if (!email) return;

      if (validateEmail(email)) {
        showNotification(
          "Successfully subscribed to our newsletter!",
          "success"
        );
        form.reset();
        console.log("Newsletter subscription:", email);
      } else {
        showNotification("Please enter a valid email address.", "error");
      }
    });
  },
};

// ========================================
// ANIMATIONS MODULE
// ========================================
const Animations = {
  init() {
    this.initScrollAnimations();
    this.initLazyLoading();
  },

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      ".collection-card, .product-card, .testimonial-card, .badge-item, .gallery-item"
    );
    animatedElements.forEach((el) => {
      observer.observe(el);
    });
  },

  initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  },
};

// ========================================
// SEARCH MODULE
// ========================================
const Search = {
  init() {
    const searchIcon = document.querySelector('.nav-icons a[href="#search"]');
    if (searchIcon) {
      searchIcon.addEventListener("click", (e) => {
        e.preventDefault();
        const searchTerm = prompt("Enter search term:");
        if (searchTerm) {
          window.location.href = `shop.html?search=${encodeURIComponent(
            searchTerm
          )}`;
        }
      });
    }
  },
};

// ========================================
// CART MODULE
// ========================================
const Cart = {
  init() {
    const cartIcon = document.querySelector('.nav-icons a[href="#cart"]');
    if (cartIcon) {
      cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "cart.html";
      });
    }
  },
};

// ========================================
// PRODUCT DETAIL MODULE
// ========================================
const ProductDetail = {
  init() {
    this.initImageGallery();
    this.initTabs();
    this.initQuantitySelector();
    this.initZoomModal();
    this.initProductActions();
  },

  initImageGallery() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    const mainImage = document.getElementById("mainImage");

    if (!thumbnails.length || !mainImage) return;

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
        // Remove active class from all thumbnails
        thumbnails.forEach((thumb) => thumb.classList.remove("active"));

        // Add active class to clicked thumbnail
        this.classList.add("active");

        // Update main image
        const newSrc = this.dataset.main;
        if (newSrc) {
          mainImage.src = newSrc;
        }
      });
    });
  },

  initTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    if (!tabBtns.length || !tabPanels.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const targetTab = this.dataset.tab;

        // Remove active class from all buttons and panels
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabPanels.forEach((p) => p.classList.remove("active"));

        // Add active class to clicked button and corresponding panel
        this.classList.add("active");
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
          targetPanel.classList.add("active");
        }
      });
    });
  },

  initQuantitySelector() {
    const qtyMinus = document.getElementById("qtyMinus");
    const qtyPlus = document.getElementById("qtyPlus");
    const qtyInput = document.getElementById("quantity");

    if (!qtyMinus || !qtyPlus || !qtyInput) return;

    qtyMinus.addEventListener("click", () => {
      const currentValue = parseInt(qtyInput.value);
      if (currentValue > 1) {
        qtyInput.value = currentValue - 1;
      }
    });

    qtyPlus.addEventListener("click", () => {
      const currentValue = parseInt(qtyInput.value);
      const maxValue = parseInt(qtyInput.getAttribute("max")) || 10;
      if (currentValue < maxValue) {
        qtyInput.value = currentValue + 1;
      }
    });

    qtyInput.addEventListener("change", function () {
      const value = parseInt(this.value);
      const min = parseInt(this.getAttribute("min")) || 1;
      const max = parseInt(this.getAttribute("max")) || 10;

      if (value < min) {
        this.value = min;
      } else if (value > max) {
        this.value = max;
      }
    });
  },

  initZoomModal() {
    const zoomBtn = document.getElementById("zoomBtn");
    const zoomModal = document.getElementById("zoomModal");
    const zoomImage = document.getElementById("zoomImage");
    const zoomClose = document.querySelector(".zoom-close");
    const mainImage = document.getElementById("mainImage");

    if (!zoomBtn || !zoomModal || !zoomImage || !zoomClose || !mainImage)
      return;

    // Open zoom modal
    zoomBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      zoomImage.src = mainImage.src;
      zoomModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });

    // Close zoom modal
    zoomClose.addEventListener("click", () => {
      zoomModal.style.display = "none";
      document.body.style.overflow = "auto";
    });

    // Close modal when clicking outside
    zoomModal.addEventListener("click", (e) => {
      if (e.target === zoomModal) {
        zoomModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && zoomModal.style.display === "block") {
        zoomModal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  },

  initProductActions() {
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    const buyNowBtn = document.querySelector(".buy-now-btn");
    const wishlistBtn = document.querySelector(".wishlist-btn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        this.addToCart();
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        this.buyNow();
      });
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => {
        this.toggleWishlist(wishlistBtn);
      });
    }

    // Initialize review form
    this.initReviewForm();
  },

  initReviewForm() {
    const writeReviewBtn = document.getElementById("writeReviewBtn");
    const reviewFormModal = document.getElementById("reviewFormModal");
    const closeReviewForm = document.getElementById("closeReviewForm");
    const cancelReview = document.getElementById("cancelReview");
    const reviewForm = document.getElementById("reviewForm");

    if (
      !writeReviewBtn ||
      !reviewFormModal ||
      !closeReviewForm ||
      !cancelReview ||
      !reviewForm
    )
      return;

    // Open review form modal
    writeReviewBtn.addEventListener("click", () => {
      reviewFormModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });

    // Close review form modal
    const closeModal = () => {
      reviewFormModal.style.display = "none";
      document.body.style.overflow = "auto";
      reviewForm.reset();
    };

    closeReviewForm.addEventListener("click", closeModal);
    cancelReview.addEventListener("click", closeModal);

    // Close modal when clicking outside
    reviewFormModal.addEventListener("click", (e) => {
      if (e.target === reviewFormModal) {
        closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && reviewFormModal.style.display === "block") {
        closeModal();
      }
    });

    // Handle form submission
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitReview(reviewForm);
    });
  },

  submitReview(form) {
    const formData = new FormData(form);
    const reviewData = {
      name: formData.get("reviewerName"),
      email: formData.get("reviewerEmail"),
      rating: formData.get("rating"),
      title: formData.get("reviewTitle"),
      text: formData.get("reviewText"),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // Validate required fields
    if (
      !reviewData.name ||
      !reviewData.email ||
      !reviewData.rating ||
      !reviewData.text
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    // Validate email
    if (!validateEmail(reviewData.email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    // Add the review to the page
    this.addReviewToPage(reviewData);

    // Close the modal
    const reviewFormModal = document.getElementById("reviewFormModal");
    reviewFormModal.style.display = "none";
    document.body.style.overflow = "auto";

    // Reset form
    form.reset();

    // Show success message
    showNotification("Thank you for your review!", "success");
  },

  addReviewToPage(reviewData) {
    const reviewsGrid = document.querySelector(".reviews-grid");
    if (!reviewsGrid) return;

    // Create new review card
    const reviewCard = document.createElement("div");
    reviewCard.className = "review-card new-review-card";

    // Generate stars HTML
    const starsHTML = this.generateStarsHTML(parseInt(reviewData.rating));

    reviewCard.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <h4>${reviewData.name}</h4>
          <div class="review-stars">
            ${starsHTML}
          </div>
        </div>
        <span class="review-date">${reviewData.date}</span>
      </div>
      ${
        reviewData.title
          ? `<div class="review-title">${reviewData.title}</div>`
          : ""
      }
      <p class="review-text">"${reviewData.text}"</p>
    `;

    // Insert at the beginning of reviews grid
    reviewsGrid.insertBefore(reviewCard, reviewsGrid.firstChild);

    // Update overall rating (simplified - in real app would recalculate)
    this.updateOverallRating();
  },

  generateStarsHTML(rating) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHTML += '<i class="fas fa-star"></i>';
      } else {
        starsHTML += '<i class="far fa-star"></i>';
      }
    }
    return starsHTML;
  },

  updateOverallRating() {
    // In a real application, this would recalculate the overall rating
    // For demo purposes, we'll just show a subtle update
    const overallRating = document.querySelector(".overall-rating");
    if (overallRating) {
      // Add a subtle animation to show the rating was updated
      overallRating.style.transform = "scale(1.1)";
      setTimeout(() => {
        overallRating.style.transform = "scale(1)";
      }, 200);
    }
  },

  addToCart() {
    const productName = document.querySelector(".product-title")?.textContent;
    const quantity = document.getElementById("quantity")?.value || 1;
    const metalType = document.getElementById("metalType")?.value;
    const chainLength = document.getElementById("chainLength")?.value;

    showNotification(`${productName} added to cart!`, "success");

    // Add to cart animation
    const button = document.querySelector(".add-to-cart-btn");
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Added!';
      button.style.background = "#28a745";

      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = "";
      }, 2000);
    }

    console.log("Added to cart:", {
      productName,
      quantity,
      metalType,
      chainLength,
    });
  },

  buyNow() {
    const productName = document.querySelector(".product-title")?.textContent;
    showNotification("Redirecting to checkout...", "info");

    // In a real application, this would redirect to checkout
    setTimeout(() => {
      window.location.href = "checkout.html";
    }, 1000);
  },

  toggleWishlist(button) {
    const icon = button.querySelector("i");
    if (!icon) return;

    const isWishlisted = icon.classList.contains("fas");

    if (isWishlisted) {
      icon.classList.remove("fas");
      icon.classList.add("far");
      showNotification("Removed from wishlist", "info");
    } else {
      icon.classList.remove("far");
      icon.classList.add("fas");
      showNotification("Added to wishlist", "success");
    }
  },
};

// ========================================
// CART PAGE MODULE
// ========================================
const CartPage = {
  init() {
    this.initQuantitySelectors();
    this.initRemoveButtons();
    this.initPromoCode();
    this.initCheckout();
    this.initQuickAdd();
    this.updateCartTotals();
  },

  initQuantitySelectors() {
    const quantitySelectors = document.querySelectorAll(".quantity-selector");

    quantitySelectors.forEach((selector) => {
      const minusBtn = selector.querySelector(".minus");
      const plusBtn = selector.querySelector(".plus");
      const input = selector.querySelector(".quantity-input");
      const cartItem = selector.closest(".cart-item");

      if (minusBtn && plusBtn && input && cartItem) {
        minusBtn.addEventListener("click", () => {
          this.updateQuantity(input, -1, cartItem);
        });

        plusBtn.addEventListener("click", () => {
          this.updateQuantity(input, 1, cartItem);
        });

        input.addEventListener("change", () => {
          this.validateQuantity(input, cartItem);
        });
      }
    });
  },

  updateQuantity(input, change, cartItem) {
    const currentValue = parseInt(input.value) || 1;
    const newValue = Math.max(1, Math.min(10, currentValue + change));

    input.value = newValue;
    this.updateItemTotal(cartItem);
    this.updateCartTotals();
  },

  validateQuantity(input, cartItem) {
    const value = parseInt(input.value) || 1;
    const validValue = Math.max(1, Math.min(10, value));

    input.value = validValue;
    this.updateItemTotal(cartItem);
    this.updateCartTotals();
  },

  updateItemTotal(cartItem) {
    const priceElement = cartItem.querySelector(".item-price");
    const quantityInput = cartItem.querySelector(".quantity-input");
    const totalElement = cartItem.querySelector(".total-price");

    if (priceElement && quantityInput && totalElement) {
      const price = parseFloat(
        priceElement.textContent.replace("$", "").replace(",", "")
      );
      const quantity = parseInt(quantityInput.value) || 1;
      const total = price * quantity;

      totalElement.textContent = `$${total.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`;
    }
  },

  updateCartTotals() {
    const cartItems = document.querySelectorAll(".cart-item");
    let subtotal = 0;

    cartItems.forEach((item) => {
      const totalElement = item.querySelector(".total-price");
      if (totalElement) {
        const itemTotal = parseFloat(
          totalElement.textContent.replace("$", "").replace(",", "")
        );
        subtotal += itemTotal;
      }
    });

    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    // Update summary
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");

    if (subtotalElement) {
      subtotalElement.textContent = `$${subtotal.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`;
    }
    if (taxElement) {
      taxElement.textContent = `$${tax.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`;
    }
    if (totalElement) {
      totalElement.textContent = `$${total.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`;
    }

    // Update item count
    const itemCount = cartItems.length;
    const itemCountElement = document.querySelector(".item-count");
    if (itemCountElement) {
      itemCountElement.textContent = `${itemCount} item${
        itemCount !== 1 ? "s" : ""
      }`;
    }

    // Show/hide empty cart
    this.toggleEmptyCart(itemCount === 0);
  },

  toggleEmptyCart(isEmpty) {
    const cartContent = document.getElementById("cartContent");
    const emptyCart = document.getElementById("emptyCart");

    if (cartContent && emptyCart) {
      if (isEmpty) {
        cartContent.style.display = "none";
        emptyCart.style.display = "block";
      } else {
        cartContent.style.display = "block";
        emptyCart.style.display = "none";
      }
    }
  },

  initRemoveButtons() {
    const removeButtons = document.querySelectorAll(".remove-btn");

    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const cartItem = button.closest(".cart-item");
        if (cartItem) {
          this.removeItem(cartItem);
        }
      });
    });
  },

  removeItem(cartItem) {
    // Add removal animation
    cartItem.style.transform = "translateX(-100%)";
    cartItem.style.opacity = "0";
    cartItem.style.transition = "all 0.3s ease";

    setTimeout(() => {
      cartItem.remove();
      this.updateCartTotals();
      showNotification("Item removed from cart", "info");
    }, 300);
  },

  initPromoCode() {
    const promoBtn = document.getElementById("applyPromo");
    const promoInput = document.getElementById("promoCode");

    if (promoBtn && promoInput) {
      promoBtn.addEventListener("click", () => {
        this.applyPromoCode(promoInput.value);
      });

      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.applyPromoCode(promoInput.value);
        }
      });
    }
  },

  applyPromoCode(code) {
    const validCodes = {
      WELCOME10: 0.1,
      SAVE20: 0.2,
      LUXURY15: 0.15,
    };

    if (validCodes[code]) {
      const discount = validCodes[code];
      showNotification(
        `Promo code applied! ${Math.round(discount * 100)}% off`,
        "success"
      );

      // In a real application, you would apply the discount to the total
      // For demo purposes, we'll just show a success message
    } else {
      showNotification("Invalid promo code", "error");
    }
  },

  initCheckout() {
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        this.proceedToCheckout();
      });
    }
  },

  proceedToCheckout() {
    showNotification("Redirecting to checkout...", "info");

    // In a real application, this would redirect to checkout
    setTimeout(() => {
      showNotification("Checkout page would open here", "info");
    }, 1000);
  },

  initQuickAdd() {
    const quickAddButtons = document.querySelectorAll(".quick-add-btn");

    quickAddButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = button.dataset.product;
        this.addToCartQuick(productId);
      });
    });
  },

  addToCartQuick(productId) {
    // In a real application, this would add the product to cart
    showNotification("Item added to cart!", "success");

    // Update cart count
    const cartCount = document.querySelector(".nav-icons .fa-shopping-bag");
    if (cartCount) {
      // Add a subtle animation to the cart icon
      cartCount.style.transform = "scale(1.2)";
      setTimeout(() => {
        cartCount.style.transform = "scale(1)";
      }, 200);
    }
  },
};

// ========================================
// CHECKOUT PAGE MODULE
// ========================================
const CheckoutPage = {
  init() {
    this.initPaymentMethods();
    this.initPromoCode();
    this.initOrderSummary();
    this.initFormValidation();
    this.initPlaceOrder();
  },

  initPaymentMethods() {
    const paymentMethods = document.querySelectorAll(
      'input[name="paymentMethod"]'
    );
    const cardDetails = document.getElementById("cardDetails");

    paymentMethods.forEach((method) => {
      method.addEventListener("change", () => {
        this.toggleCardDetails(method.value);
      });
    });

    // Initialize with credit card selected
    this.toggleCardDetails("creditCard");
  },

  toggleCardDetails(paymentMethod) {
    const cardDetails = document.getElementById("cardDetails");

    if (paymentMethod === "creditCard") {
      cardDetails.style.display = "block";
      // Add required attributes to card fields
      const cardFields = cardDetails.querySelectorAll("input");
      cardFields.forEach((field) => {
        field.required = true;
      });
    } else {
      cardDetails.style.display = "none";
      // Remove required attributes from card fields
      const cardFields = cardDetails.querySelectorAll("input");
      cardFields.forEach((field) => {
        field.required = false;
      });
    }
  },

  initPromoCode() {
    const promoBtn = document.getElementById("applyPromo");
    const promoInput = document.getElementById("promoCode");
    const promoMessage = document.getElementById("promoMessage");

    if (promoBtn && promoInput && promoMessage) {
      promoBtn.addEventListener("click", () => {
        this.applyPromoCode(promoInput.value, promoMessage);
      });

      promoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.applyPromoCode(promoInput.value, promoMessage);
        }
      });
    }
  },

  applyPromoCode(code, messageElement) {
    const validCodes = {
      WELCOME10: 0.1,
      SAVE20: 0.2,
      LUXURY15: 0.15,
    };

    if (validCodes[code]) {
      const discount = validCodes[code];
      messageElement.textContent = `Promo code applied! ${Math.round(
        discount * 100
      )}% off`;
      messageElement.className = "promo-message success";

      // In a real application, you would apply the discount to the total
      this.highlightTotal();
    } else if (code.trim() === "") {
      messageElement.textContent = "";
      messageElement.className = "promo-message";
    } else {
      messageElement.textContent = "Invalid promo code";
      messageElement.className = "promo-message error";
    }
  },

  highlightTotal() {
    const totalElement = document.getElementById("total");
    if (totalElement) {
      totalElement.style.transform = "scale(1.1)";
      totalElement.style.color = "#b8860b";
      setTimeout(() => {
        totalElement.style.transform = "scale(1)";
        totalElement.style.color = "var(--gold)";
      }, 500);
    }
  },

  initOrderSummary() {
    const summaryToggle = document.getElementById("summaryToggle");
    const summaryContent = document.getElementById("summaryContent");

    if (summaryToggle && summaryContent) {
      summaryToggle.addEventListener("click", () => {
        this.toggleOrderSummary(summaryContent, summaryToggle);
      });
    }
  },

  toggleOrderSummary(content, toggle) {
    const isActive = content.classList.contains("active");

    if (isActive) {
      content.classList.remove("active");
      toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
      content.classList.add("active");
      toggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
    }
  },

  initFormValidation() {
    const form = document.getElementById("checkoutForm");
    const inputs = form.querySelectorAll("input[required], select[required]");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input);
      });

      input.addEventListener("input", () => {
        this.clearFieldError(input);
      });
    });
  },

  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = "";

    if (!value) {
      isValid = false;
      errorMessage = "This field is required";
    } else if (fieldType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address";
      }
    } else if (fieldType === "tel") {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ""))) {
        isValid = false;
        errorMessage = "Please enter a valid phone number";
      }
    }

    this.showFieldError(field, isValid, errorMessage);
    return isValid;
  },

  showFieldError(field, isValid, message) {
    const formGroup = field.closest(".form-group");
    let errorElement = formGroup.querySelector(".field-error");

    if (!isValid) {
      if (!errorElement) {
        errorElement = document.createElement("div");
        errorElement.className = "field-error";
        formGroup.appendChild(errorElement);
      }
      errorElement.textContent = message;
      field.style.borderBottomColor = "#dc3545";
    } else {
      if (errorElement) {
        errorElement.remove();
      }
      field.style.borderBottomColor = "#ccc";
    }
  },

  clearFieldError(field) {
    const formGroup = field.closest(".form-group");
    const errorElement = formGroup.querySelector(".field-error");

    if (errorElement) {
      errorElement.remove();
    }
    field.style.borderBottomColor = "#ccc";
  },

  initPlaceOrder() {
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const form = document.getElementById("checkoutForm");

    if (placeOrderBtn && form) {
      placeOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handlePlaceOrder(form);
      });
    }
  },

  handlePlaceOrder(form) {
    const requiredFields = form.querySelectorAll(
      "input[required], select[required]"
    );
    let isFormValid = true;

    // Validate all required fields
    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    // Validate card fields if credit card is selected
    const selectedPayment = form.querySelector(
      'input[name="paymentMethod"]:checked'
    );
    if (selectedPayment && selectedPayment.value === "creditCard") {
      const cardFields = document.querySelectorAll(
        "#cardDetails input[required]"
      );
      cardFields.forEach((field) => {
        if (!this.validateField(field)) {
          isFormValid = false;
        }
      });
    }

    if (isFormValid) {
      this.processOrder(form);
    } else {
      showNotification("Please fill in all required fields correctly", "error");
    }
  },

  processOrder(form) {
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    const originalText = placeOrderBtn.innerHTML;

    // Show loading state
    placeOrderBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing...';
    placeOrderBtn.disabled = true;

    // Simulate order processing
    setTimeout(() => {
      showNotification(
        "Order placed successfully! You will receive a confirmation email shortly.",
        "success"
      );

      // Reset button
      placeOrderBtn.innerHTML = originalText;
      placeOrderBtn.disabled = false;

      // In a real application, you would:
      // 1. Send data to server
      // 2. Process payment
      // 3. Send confirmation email
      // 4. Redirect to success page

      console.log("Order data:", new FormData(form));
    }, 2000);
  },
};

// ========================================
// ABOUT PAGE MODULE (Fixed Carousels)
// ========================================
const AboutPage = {
  init() {
    this.initScrollIndicator();
    this.initTeamCarousel();
    this.initTestimonialsCarousel();
    this.initPlayButton();
    this.initScrollAnimations();
  },

  initScrollIndicator() {
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
      scrollIndicator.addEventListener("click", () => {
        const brandStory = document.querySelector(".brand-story");
        if (brandStory) {
          brandStory.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  },

  // 🔹 TEAM CAROUSEL
  // 🔹 TEAM CAROUSEL FIXED FOR MOBILE
  initTeamCarousel() {
    const track = document.getElementById("teamTrack");
    const prevBtn = document.getElementById("teamPrev");
    const nextBtn = document.getElementById("teamNext");

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll(".team-card");

    const getCardWidth = () => cards[0].offsetWidth + 20; // dynamic card width

    const updateCarousel = () => {
      const cardWidth = getCardWidth();
      const visibleCards = Math.floor(
        track.parentElement.offsetWidth / cardWidth
      );
      const maxIndex = Math.max(0, cards.length - visibleCards);

      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const translateX = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;

      // buttons disable/enable
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    };

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", () => {
      const cardWidth = getCardWidth();
      const visibleCards = Math.floor(
        track.parentElement.offsetWidth / cardWidth
      );
      const maxIndex = Math.max(0, cards.length - visibleCards);

      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
  },
  // 🔹 TESTIMONIALS CAROUSEL
  initTestimonialsCarousel() {
    const track = document.getElementById("testimonialsTrack");
    const prevBtn = document.getElementById("testimonialsPrev");
    const nextBtn = document.getElementById("testimonialsNext");

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll(".testimonial-card");

    const getCardWidth = () => cards[0].offsetWidth + 20;

    const updateCarousel = () => {
      const cardWidth = getCardWidth();
      const visibleCards = Math.floor(
        track.parentElement.offsetWidth / cardWidth
      );
      const maxIndex = Math.max(0, cards.length - visibleCards);

      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const translateX = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateX}px)`;

      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    };

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", () => {
      const cardWidth = getCardWidth();
      const visibleCards = Math.floor(
        track.parentElement.offsetWidth / cardWidth
      );
      const maxIndex = Math.max(0, cards.length - visibleCards);

      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
  },

  initPlayButton() {
    const playButton = document.querySelector(".play-button");
    if (playButton) {
      playButton.addEventListener("click", () => {
        showNotification("Video would play here", "info");
      });
    }
  },

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      ".craft-card, .team-card, .value-item, .testimonial-card"
    );

    animatedElements.forEach((el) => {
      observer.observe(el);
    });
  },
};

// ✅ Ensure init runs
document.addEventListener("DOMContentLoaded", () => {
  AboutPage.init();
});

// ========================================
// MAIN INITIALIZATION
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all modules
  Navbar.init();
  SmoothScroll.init();
  CollectionCards.init();
  ProductCards.init();
  Gallery.init();
  FilterSort.init();
  HighlightCards.init();
  Newsletter.init();
  Animations.init();
  Search.init();
  Cart.init();
  ProductDetail.init();
  CartPage.init();
  CheckoutPage.init();
  AboutPage.init();

  // Performance optimization
  const debouncedScroll = debounce(() => {
    // Handle scroll events
  }, 10);

  window.addEventListener("scroll", debouncedScroll);

  // Initialize contact page functionality
  ContactPage.init();

  // Initialize authentication functionality
  Authentication.init();

  // Simple test for login page
  console.log("Testing login page elements...");
  const testTabBtns = document.querySelectorAll(".tab-btn");
  const testForms = document.querySelectorAll(".auth-form");
  console.log("Found tab buttons:", testTabBtns.length);
  console.log("Found forms:", testForms.length);

  // Add simple click handler for testing
  testTabBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      console.log("Simple click handler triggered for button", index);
      const tab = btn.dataset.tab;
      console.log("Tab data:", tab);

      // Simple toggle logic
      const forms = document.querySelectorAll(".auth-form");
      const buttons = document.querySelectorAll(".tab-btn");

      forms.forEach((form) => form.classList.remove("active"));
      buttons.forEach((button) => button.classList.remove("active"));

      const targetForm = document.querySelector(
        `.auth-form[data-tab="${tab}"]`
      );
      if (targetForm) {
        targetForm.classList.add("active");
        btn.classList.add("active");
        console.log("Switched to tab:", tab);
      }
    });
  });
});

// ========================================
// CONTACT PAGE FUNCTIONALITY
// ========================================
const ContactPage = {
  init() {
    this.initFAQ();
    this.initContactForm();
    this.initNewsletterForm();
    this.initSmoothScrolling();
  },

  // FAQ Accordion functionality
  initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");

      question.addEventListener("click", () => {
        // Close other open items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
          }
        });

        // Toggle current item
        item.classList.toggle("active");
      });
    });
  },

  // Contact form functionality
  initContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleContactFormSubmit(contactForm);
      });

      // Add real-time validation
      const inputs = contactForm.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        input.addEventListener("blur", () => {
          this.validateField(input);
        });

        input.addEventListener("input", () => {
          this.clearFieldError(input);
        });
      });
    }
  },

  // Handle contact form submission
  handleContactFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate all fields
    const isValid = this.validateForm(form);

    if (isValid) {
      // Show loading state
      const submitBtn = form.querySelector(".btn-contact-submit");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        this.showNotification(
          "Message sent successfully! We'll get back to you soon.",
          "success"
        );
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }
  },

  // Validate individual field
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = "";

    // Remove existing error
    this.clearFieldError(field);

    // Validation rules
    switch (fieldName) {
      case "fullName":
        if (!value) {
          errorMessage = "Full name is required";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Name must be at least 2 characters";
          isValid = false;
        }
        break;

      case "email":
        if (!value) {
          errorMessage = "Email is required";
          isValid = false;
        } else if (!this.isValidEmail(value)) {
          errorMessage = "Please enter a valid email address";
          isValid = false;
        }
        break;

      case "subject":
        if (!value) {
          errorMessage = "Subject is required";
          isValid = false;
        } else if (value.length < 5) {
          errorMessage = "Subject must be at least 5 characters";
          isValid = false;
        }
        break;

      case "message":
        if (!value) {
          errorMessage = "Message is required";
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = "Message must be at least 10 characters";
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  },

  // Validate entire form
  validateForm(form) {
    const fields = form.querySelectorAll("input[required], textarea[required]");
    let isFormValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  },

  // Show field error
  showFieldError(field, message) {
    field.style.borderBottomColor = "#e74c3c";

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.style.color = "#e74c3c";
    errorDiv.style.fontSize = "0.875rem";
    errorDiv.style.marginTop = "0.25rem";
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
  },

  // Clear field error
  clearFieldError(field) {
    field.style.borderBottomColor = "#ccc";
    const errorDiv = field.parentNode.querySelector(".field-error");
    if (errorDiv) {
      errorDiv.remove();
    }
  },

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Newsletter form functionality
  initNewsletterForm() {
    const newsletterForm = document.querySelector(".newsletter-form");

    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleNewsletterSubmit(newsletterForm);
      });
    }
  },

  // Handle newsletter submission
  handleNewsletterSubmit(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email) {
      this.showNotification("Please enter your email address", "error");
      return;
    }

    if (!this.isValidEmail(email)) {
      this.showNotification("Please enter a valid email address", "error");
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector(".btn-newsletter");
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    // Simulate newsletter subscription (replace with actual API call)
    setTimeout(() => {
      this.showNotification(
        "Successfully subscribed to our newsletter!",
        "success"
      );
      emailInput.value = "";
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  },

  // Show notification
  showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${
        type === "success"
          ? "#27ae60"
          : type === "error"
          ? "#e74c3c"
          : "#3498db"
      };
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      font-family: var(--font-sans);
      font-weight: 500;
      max-width: 400px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "exclamation-circle"
            : "info-circle"
        }"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  },

  // Smooth scrolling for anchor links
  initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  },
};

// ========================================
// AUTHENTICATION MODULE
// ========================================
const Authentication = {
  currentTab: "login",

  init() {
    console.log("Authentication.init() called");
    this.initTabSwitching();
    this.initFormValidation();
    this.initFormSubmission();
    this.initSocialLogin();
    this.initPasswordToggle();
    this.initAnimations();
  },

  // Tab Switching Functionality
  initTabSwitching() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const switchTabs = document.querySelectorAll(".switch-tab");
    const forms = document.querySelectorAll(".auth-form");

    console.log("Authentication initTabSwitching - Found elements:", {
      tabBtns: tabBtns.length,
      switchTabs: switchTabs.length,
      forms: forms.length,
    });

    // Tab button clicks
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        console.log("Tab button clicked:", tab);
        this.switchTab(tab);
      });
    });

    // Switch tab links
    switchTabs.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        console.log("Switch tab clicked:", tab);
        this.switchTab(tab);
      });
    });
  },

  switchTab(tab) {
    console.log("switchTab called with:", tab, "currentTab:", this.currentTab);

    if (this.currentTab === tab) return;

    const currentWrapper = document.querySelector(".auth-form.active");
    const newWrapper = document.querySelector(`.auth-form[data-tab="${tab}"]`);
    const currentTabBtn = document.querySelector(
      `[data-tab="${this.currentTab}"]`
    );
    const newTabBtn = document.querySelector(`[data-tab="${tab}"]`);

    console.log("switchTab elements found:", {
      currentWrapper: !!currentWrapper,
      newWrapper: !!newWrapper,
      currentTabBtn: !!currentTabBtn,
      newTabBtn: !!newTabBtn,
    });

    // Add exit animation to current form
    if (currentWrapper) {
      currentWrapper.style.animation = "fadeOut 0.3s ease-in-out forwards";
    }

    setTimeout(() => {
      // Hide current form and show new form
      if (currentWrapper) currentWrapper.classList.remove("active");
      if (newWrapper) newWrapper.classList.add("active");

      // Update tab buttons
      if (currentTabBtn) currentTabBtn.classList.remove("active");
      if (newTabBtn) newTabBtn.classList.add("active");

      // Add entrance animation to new form
      if (newWrapper) {
        newWrapper.style.animation = "fadeIn 0.5s ease-in-out forwards";
      }

      this.currentTab = tab;
      this.clearFormErrors();
      console.log("Tab switched to:", tab);
    }, 300);
  },

  // Form Validation
  initFormValidation() {
    const forms = document.querySelectorAll(".auth-form-content");

    forms.forEach((form) => {
      const inputs = form.querySelectorAll("input");

      inputs.forEach((input) => {
        // Real-time validation
        input.addEventListener("blur", () => {
          this.validateField(input);
        });

        input.addEventListener("input", () => {
          this.clearFieldError(input);
        });
      });
    });
  },

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = "";

    // Clear existing error
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "This field is required";
    }

    // Specific field validations
    if (value && isValid) {
      switch (fieldName) {
        case "email":
          if (!this.isValidEmail(value)) {
            isValid = false;
            errorMessage = "Please enter a valid email address";
          }
          break;

        case "password":
          if (value.length < 8) {
            isValid = false;
            errorMessage = "Password must be at least 8 characters";
          } else if (!this.isStrongPassword(value)) {
            isValid = false;
            errorMessage =
              "Password must contain uppercase, lowercase, and number";
          }
          break;

        case "confirmPassword":
          const passwordField = document.getElementById("signupPassword");
          if (passwordField && value !== passwordField.value) {
            isValid = false;
            errorMessage = "Passwords do not match";
          }
          break;

        case "phone":
          if (value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = "Please enter a valid phone number";
          }
          break;

        case "fullName":
          if (value.length < 2) {
            isValid = false;
            errorMessage = "Full name must be at least 2 characters";
          }
          break;
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.showFieldSuccess(field);
    }

    return isValid;
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isStrongPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers;
  },

  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  showFieldError(field, message) {
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    formGroup.classList.add("error");
    formGroup.classList.remove("success");

    // Remove existing error message
    const existingError = formGroup.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
  },

  showFieldSuccess(field) {
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    formGroup.classList.add("success");
    formGroup.classList.remove("error");

    // Remove error message
    const existingError = formGroup.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  },

  clearFieldError(field) {
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    formGroup.classList.remove("error", "success");
    const existingError = formGroup.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  },

  clearFormErrors() {
    const errorFields = document.querySelectorAll(".form-group.error");
    errorFields.forEach((field) => {
      field.classList.remove("error");
      const errorMsg = field.querySelector(".field-error");
      if (errorMsg) errorMsg.remove();
    });
  },

  // Form Submission
  initFormSubmission() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin(loginForm);
      });
    }

    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSignup(signupForm);
      });
    }
  },

  handleLogin(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate all fields
    const isValid = this.validateForm(form);
    if (!isValid) {
      this.showNotification("Please fix the errors and try again", "error");
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector(".auth-btn");
    this.setLoadingState(submitBtn, true);

    // Simulate API call
    setTimeout(() => {
      this.setLoadingState(submitBtn, false);

      // Simulate successful login
      this.showNotification("Login successful! Redirecting...", "success");

      // In a real application, you would:
      // 1. Send data to server
      // 2. Handle authentication response
      // 3. Store auth token
      // 4. Redirect to dashboard or home page

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    }, 2000);
  },

  handleSignup(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate all fields
    const isValid = this.validateForm(form);
    if (!isValid) {
      this.showNotification("Please fix the errors and try again", "error");
      return;
    }

    // Check terms agreement
    const agreeTerms = form.querySelector('input[name="agreeTerms"]');
    if (!agreeTerms.checked) {
      this.showNotification(
        "Please agree to the Terms of Service and Privacy Policy",
        "error"
      );
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector(".auth-btn");
    this.setLoadingState(submitBtn, true);

    // Simulate API call
    setTimeout(() => {
      this.setLoadingState(submitBtn, false);

      // Simulate successful signup
      this.showNotification(
        "Account created successfully! Please check your email to verify your account.",
        "success"
      );

      // In a real application, you would:
      // 1. Send data to server
      // 2. Handle registration response
      // 3. Send verification email
      // 4. Redirect to verification page or login

      setTimeout(() => {
        this.switchTab("login");
        form.reset();
      }, 2000);
    }, 2000);
  },

  validateForm(form) {
    const requiredFields = form.querySelectorAll("input[required]");
    let isFormValid = true;

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  },

  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.classList.add("loading");
      button.disabled = true;
      const originalText = button.innerHTML;
      button.dataset.originalText = originalText;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
      button.classList.remove("loading");
      button.disabled = false;
      const originalText = button.dataset.originalText;
      if (originalText) {
        button.innerHTML = originalText;
      }
    }
  },

  // Social Login
  initSocialLogin() {
    const socialBtns = document.querySelectorAll(".social-btn");

    socialBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const provider = btn.classList.contains("google-btn")
          ? "Google"
          : "Facebook";
        this.handleSocialLogin(provider);
      });
    });
  },

  handleSocialLogin(provider) {
    this.showNotification(`Redirecting to ${provider}...`, "info");

    // In a real application, you would:
    // 1. Initialize OAuth flow
    // 2. Redirect to provider's auth page
    // 3. Handle callback and exchange tokens
    // 4. Create or login user account

    setTimeout(() => {
      this.showNotification(
        `${provider} login would be implemented here`,
        "info"
      );
    }, 1000);
  },

  // Password Toggle
  initPasswordToggle() {
    const passwordToggles = document.querySelectorAll(".password-toggle");

    passwordToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const input = toggle.previousElementSibling;
        const icon = toggle.querySelector("i");

        if (input.type === "password") {
          input.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          input.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      });
    });
  },

  // Animations
  initAnimations() {
    // Add entrance animation to the auth card
    const authCard = document.querySelector(".auth-card");
    if (authCard) {
      authCard.style.opacity = "0";
      authCard.style.transform = "translateY(30px)";

      setTimeout(() => {
        authCard.style.transition = "all 0.6s ease-out";
        authCard.style.opacity = "1";
        authCard.style.transform = "translateY(0)";
      }, 100);
    }

    // Add entrance animation to the banner
    const banner = document.querySelector(".auth-banner");
    if (banner) {
      banner.style.opacity = "0";
      banner.style.transform = "translateX(-30px)";

      setTimeout(() => {
        banner.style.transition = "all 0.6s ease-out";
        banner.style.opacity = "1";
        banner.style.transform = "translateX(0)";
      }, 200);
    }
  },

  // Notification System
  showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications =
      document.querySelectorAll(".auth-notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `auth-notification auth-notification-${type}`;
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${
              type === "success"
                ? "#28a745"
                : type === "error"
                ? "#dc3545"
                : "#17a2b8"
            };
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            font-family: var(--font-sans);
            font-weight: 500;
        `;

    notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-circle"
                    : "info-circle"
                }"></i>
                <span>${message}</span>
            </div>
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  },
};

// Password toggle function (called from HTML)
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggle = input.nextElementSibling;
  const icon = toggle.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}
