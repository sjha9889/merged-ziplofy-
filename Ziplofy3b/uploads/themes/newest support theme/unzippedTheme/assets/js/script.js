// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    // Adjust scroll threshold as needed
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Dummy product data (for filtering and quick view)
const products = [
  {
    id: 1,
    name: "Diamond Solitaire Ring",
    price: 45000,
    material: "Diamond",
    occasion: "Wedding",
    image: "assets/images/product1.jpg",
    description:
      "A stunning diamond solitaire ring, exquisitely crafted in 18K white gold. Perfect for engagements or a timeless gift.",
  },
  {
    id: 2,
    name: "Gold Pendant Necklace",
    price: 28000,
    material: "Gold",
    occasion: "Daily",
    image: "assets/images/product2.jpg",
    description: "Classic 24K gold band, a symbol of everlasting elegance.",
  },
  {
    id: 3,
    name: "Emerald Stud Earrings",
    price: 12000,
    material: "Silver",
    occasion: "Party",
    image: "assets/images/product3.jpg",
    description: "Elegant sterling silver ring with a modern design.",
  },
  {
    id: 4,
    name: "Silver Charm Bracelet",
    price: 60000,
    material: "Platinum",
    occasion: "Wedding",
    image: "assets/images/product4.jpg",
    description:
      "A luxurious platinum wedding ring, designed for ultimate comfort and style.",
  },
  {
    id: 5,
    name: "Pearl Drop Earrings",
    price: 35000,
    material: "Gold",
    occasion: "Festive",
    image: "assets/images/product5.jpg",
    description: "Beautiful rose gold eternity band with delicate detailing.",
  },
  {
    id: 6,
    name: "Platinum Wedding Band",
    price: 52000,
    material: "Diamond",
    occasion: "Party",
    image: "assets/images/product6.jpg",
    description:
      "A captivating ring featuring a luminous pearl and sparkling diamonds.",
  },
  {
    id: 7,
    name: "Rose Gold Bangle",
    price: 75000,
    material: "Gold",
    occasion: "Festive",
    image: "assets/images/product7.jpg",
    description:
      "Exquisite vintage ring adorned with a stunning emerald gemstone.",
  },
  {
    id: 8,
    name: "Sapphire Pendant",
    price: 22000,
    material: "Gold",
    occasion: "Daily",
    image: "assets/images/product8.jpg",
    description:
      "A versatile set of stackable gold rings, perfect for everyday wear.",
  },
];

function renderProducts(filteredProducts) {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

  productGrid.innerHTML = "";
  filteredProducts.forEach((product) => {
    const productCard = `
              <div class="col-lg-3 col-md-6 col-sm-12">
                  <div class="card product-card">
                      <img src="${product.image}" class="card-img-top" alt="${
      product.name
    }">
                      <div class="card-body text-center">
                          <h5 class="card-title">${product.name}</h5>
                          <p class="card-text">₹${product.price.toLocaleString()}</p>
                          <div class="product-overlay">
                              <button class="btn btn-add-to-bag" data-product-id="${
                                product.id
                              }">View Details</button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
    productGrid.innerHTML += productCard;
  });
  attachProductCardListeners();
}

function applyFiltersAndSort() {
  let filtered = [...products];

  // Filter by Price Range
  const priceFilters = Array.from(
    document.querySelectorAll('input[id^="price"]:checked')
  ).map((el) => el.id);
  if (priceFilters.length > 0) {
    filtered = filtered.filter((product) => {
      if (priceFilters.includes("price1") && product.price < 10000) return true;
      if (
        priceFilters.includes("price2") &&
        product.price >= 10000 &&
        product.price <= 25000
      )
        return true;
      if (
        priceFilters.includes("price3") &&
        product.price > 25000 &&
        product.price <= 50000
      )
        return true;
      if (priceFilters.includes("price4") && product.price > 50000) return true;
      return false;
    });
  }

  // Filter by Material
  const materialFilters = Array.from(
    document.querySelectorAll('input[id^="material"]:checked')
  ).map((el) => el.labels[0].innerText);
  if (materialFilters.length > 0) {
    filtered = filtered.filter((product) =>
      materialFilters.includes(product.material)
    );
  }

  // Filter by Occasion
  const occasionFilters = Array.from(
    document.querySelectorAll('input[id^="occasion"]:checked')
  ).map((el) => el.labels[0].innerText);
  if (occasionFilters.length > 0) {
    filtered = filtered.filter((product) =>
      occasionFilters.includes(product.occasion)
    );
  }

  // Sort By
  const sortBy = document.querySelector('input[name="sortBy"]:checked')?.id;
  if (sortBy === "sort1") {
    // Price (low-high)
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "sort2") {
    // Popularity (dummy for now)
    // Implement actual popularity sorting if data available
  } else if (sortBy === "sort3") {
    // Newest (dummy for now)
    // Implement actual newest sorting if data available
  }

  renderProducts(filtered);
}

function attachProductCardListeners() {
  // Quick View button functionality
  document.querySelectorAll(".btn-quick-view").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.productId);
      const product = products.find((p) => p.id === productId);
      if (product) {
        document.getElementById("modalProductImage").src = product.image;
        document.getElementById("modalProductTitle").innerText = product.name;
        document.getElementById(
          "modalProductPrice"
        ).innerText = `₹${product.price.toLocaleString()}`;
        document.getElementById("modalProductDescription").innerText =
          product.description;
      }
    });
  });

  // Add to Bag button functionality (shop page)
  document
    .querySelectorAll(".product-card .btn-add-to-bag")
    .forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.dataset.productId;
        // alert(`Product ${productId} added to bag!`); // Placeholder for cart page redirect
        window.location.href = "product.html";
      });
    });
}

// Event listeners for filters and sort
document.querySelectorAll(".filters-card input").forEach((input) => {
  input.addEventListener("change", applyFiltersAndSort);
});
document
  .querySelector(".filters-card .btn-outline-gold")
  ?.addEventListener("click", applyFiltersAndSort);

// Initial render of products on shop.html load
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("productGrid")) {
    renderProducts(products);
  }
});

// Newsletter form submission
document
  .querySelector(".newsletter-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent actual form submission
    alert("Thank you for subscribing to our newsletter!");
    this.reset(); // Clear the form
  });

// Product page specific JavaScript
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".product-showcase")) {
    const mainProductImage = document.querySelector(".main-product-image");
    const thumbnailImages = document.querySelectorAll(".thumbnail-images img");
    const decrementQtyBtn = document.getElementById("decrementQty");
    const incrementQtyBtn = document.getElementById("incrementQty");
    const productQuantityInput = document.getElementById("productQuantity");
    const addToBagButton = document.querySelector(".product-actions .btn-gold");
    const reviewItems = document.querySelectorAll(".review-item p");

    // Thumbnail image swapping
    thumbnailImages.forEach((thumb) => {
      thumb.addEventListener("click", function () {
        thumbnailImages.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
        mainProductImage.src = this.src.replace("-thumb", "-main"); // Assuming naming convention
      });
    });

    // Quantity selector
    if (decrementQtyBtn && incrementQtyBtn && productQuantityInput) {
      decrementQtyBtn.addEventListener("click", function () {
        let currentQty = parseInt(productQuantityInput.value);
        if (currentQty > 1) {
          productQuantityInput.value = currentQty - 1;
        }
      });

      incrementQtyBtn.addEventListener("click", function () {
        let currentQty = parseInt(productQuantityInput.value);
        productQuantityInput.value = currentQty + 1;
      });
    }

    // Add to Bag functionality (product page)
    if (addToBagButton) {
      addToBagButton.addEventListener("click", function () {
        // alert("Item added to bag!"); // Placeholder for cart page redirect
        window.location.href = "cart.html";
      });
    }

    // Reviews expand/collapse on mobile (if applicable)
    reviewItems.forEach((p) => {
      if (p.scrollHeight > p.clientHeight) {
        // If content overflows
        const readMoreBtn = document.createElement("button");
        readMoreBtn.classList.add("read-more-btn");
        readMoreBtn.innerText = "Read More";
        p.parentNode.appendChild(readMoreBtn);

        readMoreBtn.addEventListener("click", function () {
          p.parentNode.classList.toggle("expanded");
          if (p.parentNode.classList.contains("expanded")) {
            readMoreBtn.innerText = "Read Less";
          } else {
            readMoreBtn.innerText = "Read More";
          }
        });
      }
    });
  }
});

// Checkout page specific JavaScript (if on checkout.html)
if (window.location.pathname.includes("checkout.html")) {
  // Shipping details toggle
  const differentShippingCheckbox =
    document.getElementById("differentShipping");
  const shippingDetails = document.getElementById("shippingDetails");

  if (differentShippingCheckbox && shippingDetails) {
    differentShippingCheckbox.addEventListener("change", function () {
      if (this.checked) {
        shippingDetails.style.display = "block";
        // Make shipping form fields required
        const shippingInputs = shippingDetails.querySelectorAll(
          "input, select, textarea"
        );
        shippingInputs.forEach((input) => {
          input.required = true;
        });
      } else {
        shippingDetails.style.display = "none";
        // Remove required from shipping form fields
        const shippingInputs = shippingDetails.querySelectorAll(
          "input, select, textarea"
        );
        shippingInputs.forEach((input) => {
          input.required = false;
          input.value = ""; // Clear values when hidden
        });
      }
    });
  }

  // Payment method selection
  const paymentMethods = document.querySelectorAll(
    'input[name="paymentMethod"]'
  );
  const cardDetails = document.getElementById("cardDetails");

  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      if (this.value === "card") {
        cardDetails.style.display = "block";
        // Make card fields required
        const cardInputs = cardDetails.querySelectorAll("input");
        cardInputs.forEach((input) => {
          input.required = true;
        });
      } else {
        cardDetails.style.display = "none";
        // Remove required from card fields
        const cardInputs = cardDetails.querySelectorAll("input");
        cardInputs.forEach((input) => {
          input.required = false;
          input.value = ""; // Clear values when hidden
        });
      }
    });
  });

  // Discount code application
  const applyDiscountBtn = document.getElementById("applyDiscount");
  const discountCodeInput = document.getElementById("discountCode");
  const discountRow = document.getElementById("discountRow");
  const discountAmount = document.getElementById("discountAmount");
  const totalAmount = document.getElementById("totalAmount");

  if (applyDiscountBtn && discountCodeInput) {
    applyDiscountBtn.addEventListener("click", function () {
      const code = discountCodeInput.value.trim().toUpperCase();

      // Simulate discount codes
      const validCodes = {
        LUXE10: { discount: 10, type: "percentage" },
        WELCOME20: { discount: 20, type: "percentage" },
        SAVE500: { discount: 500, type: "fixed" },
      };

      if (validCodes[code]) {
        const discount = validCodes[code];
        let discountValue = 0;

        if (discount.type === "percentage") {
          discountValue = Math.round(79570 * (discount.discount / 100));
        } else {
          discountValue = discount.discount;
        }

        // Show discount row
        discountRow.style.display = "flex";
        discountAmount.textContent = `-₹${discountValue.toLocaleString()}`;

        // Update total
        const newTotal = 79570 - discountValue;
        totalAmount.textContent = `₹${newTotal.toLocaleString()}`;

        // Visual feedback
        applyDiscountBtn.textContent = "Applied!";
        applyDiscountBtn.classList.remove("btn-outline-gold");
        applyDiscountBtn.classList.add("btn-success");
        discountCodeInput.disabled = true;

        // Show success message
        showNotification("Discount applied successfully!", "success");
      } else {
        showNotification("Invalid discount code. Please try again.", "error");
      }
    });
  }

  // Form validation and submission
  const billingForm = document.getElementById("billingForm");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Validate billing form
      if (!billingForm.checkValidity()) {
        billingForm.reportValidity();
        return;
      }

      // Check if shipping form is required and validate
      if (differentShippingCheckbox && differentShippingCheckbox.checked) {
        const shippingForm = document.getElementById("shippingForm");
        if (!shippingForm.checkValidity()) {
          shippingForm.reportValidity();
          return;
        }
      }

      // Validate payment method
      const selectedPayment = document.querySelector(
        'input[name="paymentMethod"]:checked'
      );
      if (!selectedPayment) {
        showNotification("Please select a payment method.", "error");
        return;
      }

      // Validate card details if card payment is selected
      if (selectedPayment.value === "card") {
        const cardNumber = document.getElementById("cardNumber").value;
        const expiryDate = document.getElementById("expiryDate").value;
        const cvv = document.getElementById("cvv").value;

        if (!cardNumber || !expiryDate || !cvv) {
          showNotification("Please fill in all card details.", "error");
          return;
        }

        // Basic card validation
        if (cardNumber.replace(/\s/g, "").length !== 16) {
          showNotification(
            "Please enter a valid 16-digit card number.",
            "error"
          );
          return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
          showNotification(
            "Please enter expiry date in MM/YY format.",
            "error"
          );
          return;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
          showNotification("Please enter a valid CVV.", "error");
          return;
        }
      }

      // Simulate order processing
      placeOrderBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
      placeOrderBtn.disabled = true;

      setTimeout(() => {
        showNotification(
          "Order placed successfully! You will receive a confirmation email shortly.",
          "success"
        );

        // In a real application, redirect to order confirmation page
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }, 3000);
    });
  }

  // Card number formatting
  const cardNumberInput = document.getElementById("cardNumber");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function () {
      let value = this.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
      let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
      this.value = formattedValue;
    });
  }

  // Expiry date formatting
  const expiryDateInput = document.getElementById("expiryDate");
  if (expiryDateInput) {
    expiryDateInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      this.value = value;
    });
  }

  // CVV formatting (numbers only)
  const cvvInput = document.getElementById("cvv");
  if (cvvInput) {
    cvvInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }

  // Newsletter subscription
  const newsletterCheckbox = document.getElementById("newsletterSubscribe");
  if (newsletterCheckbox) {
    newsletterCheckbox.addEventListener("change", function () {
      if (this.checked) {
        showNotification(
          "Thank you for subscribing to our newsletter!",
          "success"
        );
      }
    });
  }
}

// Global cart data and functions (available on all pages)
let cartItems = [
  {
    id: 1,
    name: "Diamond Solitaire Ring",
    price: 45000,
    quantity: 1,
    image: "assets/images/cart-1.jpg",
    specs: "Size: 7 | Gold",
  },
  {
    id: 2,
    name: "Pearl Drop Earrings",
    price: 28000,
    quantity: 1,
    image: "assets/images/cart-2.jpg",
    specs: "Gold",
  },
  {
    id: 3,
    name: "Gold Chain Bracelet",
    price: 35000,
    quantity: 2,
    image: "assets/images/cart-3.jpg",
    specs: "Size: 6.5 | 18K Gold",
  },
];

let appliedCoupon = null;

// Update quantity function (global)
window.updateQuantity = function (itemId, change, newValue = null) {
  console.log("updateQuantity called:", itemId, change, newValue); // Debug log
  const item = cartItems.find((item) => item.id === itemId);
  if (!item) {
    console.log("Item not found:", itemId);
    return;
  }

  if (newValue !== null) {
    item.quantity = Math.max(1, parseInt(newValue));
  } else {
    item.quantity = Math.max(1, item.quantity + change);
  }

  console.log("Updated item:", item); // Debug log
  updateCartDisplay();
  updateOrderSummary();
  showNotification(`Quantity updated for ${item.name}`, "success");
};

// Remove item function (global)
window.removeItem = function (itemId) {
  console.log("removeItem called:", itemId); // Debug log
  const item = cartItems.find((item) => item.id === itemId);
  if (!item) {
    console.log("Item not found for removal:", itemId);
    return;
  }

  if (
    confirm(`Are you sure you want to remove "${item.name}" from your cart?`)
  ) {
    // Find the item index before removal
    const itemIndex = cartItems.findIndex((item) => item.id === itemId);
    console.log("Removing item at index:", itemIndex); // Debug log

    // Remove from cart data
    cartItems = cartItems.filter((item) => item.id !== itemId);

    // Remove from DOM - find the row/item by looking for the specific item
    const tableRows = document.querySelectorAll("#cartTableBody tr");
    const mobileItems = document.querySelectorAll(".cart-mobile-item");

    // Remove the corresponding table row (by index)
    if (tableRows[itemIndex]) {
      tableRows[itemIndex].remove();
      console.log("Removed table row at index:", itemIndex); // Debug log
    }

    // Remove the corresponding mobile item (by index)
    if (mobileItems[itemIndex]) {
      mobileItems[itemIndex].remove();
      console.log("Removed mobile item at index:", itemIndex); // Debug log
    }

    updateOrderSummary();
    showNotification(`${item.name} removed from cart`, "success");
  }
};

// Update cart display (for static HTML)
function updateCartDisplay() {
  // Update desktop table view
  const tableRows = document.querySelectorAll("#cartTableBody tr");
  tableRows.forEach((row, index) => {
    const item = cartItems[index];
    if (item) {
      // Update quantity input
      const quantityInput = row.querySelector(".quantity-input");
      if (quantityInput) {
        quantityInput.value = item.quantity;
      }

      // Update subtotal
      const subtotalElement = row.querySelector(".cart-item-subtotal");
      if (subtotalElement) {
        const subtotal = item.price * item.quantity;
        subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
      }
    }
  });

  // Update mobile card view
  const mobileItems = document.querySelectorAll(".cart-mobile-item");
  mobileItems.forEach((mobileItem, index) => {
    const item = cartItems[index];
    if (item) {
      // Update quantity input
      const quantityInput = mobileItem.querySelector(".quantity-input");
      if (quantityInput) {
        quantityInput.value = item.quantity;
      }

      // Update subtotal
      const subtotalElement = mobileItem.querySelector(".cart-item-subtotal");
      if (subtotalElement) {
        const subtotal = item.price * item.quantity;
        subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
      }
    }
  });
}

// Update order summary function (global)
function updateOrderSummary() {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 5000 ? 0 : 500; // Free shipping above ₹5000
  const tax = Math.round(subtotal * 0.09); // 9% tax
  let discount = 0;

  // Apply coupon discount if any
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = Math.round(subtotal * (appliedCoupon.discount / 100));
    } else {
      discount = appliedCoupon.discount;
    }
  }

  const total = subtotal + shipping + tax - discount;

  // Update UI elements
  const cartSubtotal = document.getElementById("cartSubtotal");
  const shippingCost = document.getElementById("shippingCost");
  const taxAmount = document.getElementById("taxAmount");
  const couponRow = document.getElementById("couponRow");
  const couponDiscount = document.getElementById("couponDiscount");
  const cartTotal = document.getElementById("cartTotal");

  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
  if (shippingCost) {
    shippingCost.textContent =
      shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`;
    shippingCost.className = shipping === 0 ? "text-success" : "";
  }
  if (taxAmount) taxAmount.textContent = `₹${tax.toLocaleString()}`;
  if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString()}`;

  // Show/hide coupon discount
  if (appliedCoupon) {
    couponRow.style.display = "flex";
    couponDiscount.textContent = `-₹${discount.toLocaleString()}`;
  } else {
    couponRow.style.display = "none";
  }
}

// Cart page specific JavaScript (if on cart.html)
if (window.location.pathname.includes("cart.html")) {
  // Coupon code application
  const applyCouponBtn = document.getElementById("applyCoupon");
  const couponCodeInput = document.getElementById("couponCode");

  if (applyCouponBtn && couponCodeInput) {
    applyCouponBtn.addEventListener("click", function () {
      const code = couponCodeInput.value.trim().toUpperCase();

      // Simulate coupon codes
      const validCoupons = {
        WELCOME10: { discount: 10, type: "percentage" },
        SAVE500: { discount: 500, type: "fixed" },
        LUXURY20: { discount: 20, type: "percentage" },
      };

      if (validCoupons[code]) {
        appliedCoupon = validCoupons[code];
        updateOrderSummary();

        // Visual feedback
        applyCouponBtn.textContent = "Applied!";
        applyCouponBtn.classList.remove("btn-outline-gold");
        applyCouponBtn.classList.add("btn-success");
        couponCodeInput.disabled = true;

        showNotification("Coupon applied successfully!", "success");
      } else {
        showNotification("Invalid coupon code. Please try again.", "error");
      }
    });
  }

  // Proceed to checkout
  const proceedToCheckoutBtn = document.getElementById("proceedToCheckout");
  if (proceedToCheckoutBtn) {
    proceedToCheckoutBtn.addEventListener("click", function () {
      console.log("Proceed to checkout clicked"); // Debug log
      console.log("Cart items:", cartItems); // Debug log

      if (cartItems.length === 0) {
        showNotification(
          "Your cart is empty. Add some items to proceed.",
          "error"
        );
        return;
      }

      // In a real application, you would save cart data and redirect
      window.location.href = "checkout.html";
    });
  }

  // Initialize cart on page load
  document.addEventListener("DOMContentLoaded", function () {
    updateOrderSummary();
  });
}

// About page specific JavaScript (if on about.html)
if (window.location.pathname.includes("about.html")) {
  // Smooth scroll animation for elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Initialize animations on page load
  document.addEventListener("DOMContentLoaded", function () {
    // Animate brand story section
    const brandStoryImage = document.querySelector(".brand-story-image");
    const brandStoryContent = document.querySelector(".brand-story-content");

    if (brandStoryImage) {
      brandStoryImage.style.opacity = "0";
      brandStoryImage.style.transform = "translateX(-50px)";
      brandStoryImage.style.transition =
        "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s";
      observer.observe(brandStoryImage);
    }

    if (brandStoryContent) {
      brandStoryContent.style.opacity = "0";
      brandStoryContent.style.transform = "translateX(50px)";
      brandStoryContent.style.transition =
        "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s";
      observer.observe(brandStoryContent);
    }

    // Animate mission cards
    const missionCards = document.querySelectorAll(".mission-card");
    missionCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = `opacity 0.6s ease ${
        index * 0.2
      }s, transform 0.6s ease ${index * 0.2}s`;
      observer.observe(card);
    });

    // Animate team members
    const teamMembers = document.querySelectorAll(".team-member-card");
    teamMembers.forEach((member, index) => {
      member.style.opacity = "0";
      member.style.transform = "translateY(30px)";
      member.style.transition = `opacity 0.6s ease ${
        index * 0.15
      }s, transform 0.6s ease ${index * 0.15}s`;
      observer.observe(member);
    });

    // Animate CTA section
    const ctaSection = document.querySelector(".about-cta-section");
    if (ctaSection) {
      ctaSection.style.opacity = "0";
      ctaSection.style.transform = "translateY(30px)";
      ctaSection.style.transition =
        "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s";
      observer.observe(ctaSection);
    }

    // Counter animation for stats
    const statNumbers = document.querySelectorAll(".stat-number");
    const animateCounters = () => {
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ""));
        const suffix = stat.textContent.replace(/[\d]/g, "");
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent = Math.floor(current) + suffix;
        }, 30);
      });
    };

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector(".brand-story-stats");
    if (statsSection) {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounters();
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      statsObserver.observe(statsSection);
    }
  });

  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector(".about-hero-section");
    if (heroSection) {
      heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });
}

// Contact page specific JavaScript (if on contact.html)
if (window.location.pathname.includes("contact.html")) {
  // Contact form validation and submission
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form elements
      const nameInput = document.getElementById("contactName");
      const emailInput = document.getElementById("contactEmail");
      const phoneInput = document.getElementById("contactPhone");
      const subjectSelect = document.getElementById("contactSubject");
      const messageTextarea = document.getElementById("contactMessage");
      const newsletterCheckbox = document.getElementById("contactNewsletter");

      // Reset previous validation states
      [nameInput, emailInput, messageTextarea].forEach((input) => {
        input.classList.remove("is-invalid", "is-valid");
      });

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.classList.add("is-invalid");
        isValid = false;
      } else {
        nameInput.classList.add("is-valid");
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        emailInput.classList.add("is-invalid");
        isValid = false;
      } else {
        emailInput.classList.add("is-valid");
      }

      // Validate message
      if (!messageTextarea.value.trim()) {
        messageTextarea.classList.add("is-invalid");
        isValid = false;
      } else {
        messageTextarea.classList.add("is-valid");
      }

      if (isValid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          // Reset button
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;

          // Show success message
          showNotification(
            "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
            "success"
          );

          // Reset form
          contactForm.reset();
          [nameInput, emailInput, messageTextarea].forEach((input) => {
            input.classList.remove("is-invalid", "is-valid");
          });

          // Handle newsletter subscription
          if (newsletterCheckbox.checked) {
            showNotification(
              "You've been subscribed to our newsletter!",
              "success"
            );
          }
        }, 2000);
      } else {
        showNotification(
          "Please fill in all required fields correctly.",
          "error"
        );
      }
    });
  }

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const emailInput = document.getElementById("newsletterEmail");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      // Simulate newsletter subscription
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin me-2"></i>Subscribing...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        showNotification(
          "Thank you for subscribing! You'll receive our exclusive offers and updates.",
          "success"
        );
        newsletterForm.reset();
      }, 1500);
    });
  }

  // Smooth scroll animation for elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe contact info cards
  document.addEventListener("DOMContentLoaded", function () {
    const contactCards = document.querySelectorAll(".contact-info-card");
    contactCards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = `opacity 0.6s ease ${
        index * 0.2
      }s, transform 0.6s ease ${index * 0.2}s`;
      observer.observe(card);
    });

    // Observe contact form
    const contactFormCard = document.querySelector(".contact-form-card");
    if (contactFormCard) {
      contactFormCard.style.opacity = "0";
      contactFormCard.style.transform = "translateY(30px)";
      contactFormCard.style.transition =
        "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s";
      observer.observe(contactFormCard);
    }

    // Observe map section
    const mapSection = document.querySelector(".map-section");
    if (mapSection) {
      mapSection.style.opacity = "0";
      mapSection.style.transform = "translateY(30px)";
      mapSection.style.transition =
        "opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s";
      observer.observe(mapSection);
    }

    // Observe newsletter section
    const newsletterSection = document.querySelector(".newsletter-section");
    if (newsletterSection) {
      newsletterSection.style.opacity = "0";
      newsletterSection.style.transform = "translateY(30px)";
      newsletterSection.style.transition =
        "opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s";
      observer.observe(newsletterSection);
    }
  });
}

// Notification function
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification alert alert-${
    type === "error" ? "danger" : type
  } alert-dismissible fade show`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    min-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;

  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}
