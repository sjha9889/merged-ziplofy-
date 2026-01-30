document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'cosmic_store_cart';
  const engine = window.liquidjs
    ? new window.liquidjs.Liquid({
        root: ['templates/'],
        extname: '.liquid'
      })
    : null;

  const dom = {
    orderItems: document.getElementById('order-items'),
    summaryItems: document.getElementById('summary-items'),
    orderCountLabel: document.getElementById('order-count-label'),
    emptyState: document.getElementById('checkout-empty'),
    formTotals: {
      subtotal: document.getElementById('form-subtotal'),
      shipping: document.getElementById('form-shipping'),
      tax: document.getElementById('form-tax'),
      total: document.getElementById('form-total')
    },
    summaryTotals: {
      subtotal: document.getElementById('summary-subtotal'),
      shipping: document.getElementById('summary-shipping'),
      tax: document.getElementById('summary-tax'),
      total: document.getElementById('summary-total')
    },
    placeOrderBtn: document.getElementById('place-order-btn')
  };

  const catalog = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const productMap = new Map(catalog.map(product => [String(product.id), product]));
  let cartItems = resolveCartSource();
  let detailedItems = normalizeItems(cartItems, productMap);

  render();
  bindEvents();

  function bindEvents() {
    if (dom.placeOrderBtn) {
      dom.placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
  }

  function render() {
    const hasItems = detailedItems.length > 0;
    toggleElement(dom.orderItems, hasItems);
    toggleElement(dom.emptyState, !hasItems);

    if (!hasItems) {
      setTotals(0, 0, 0, 0);
      if (dom.orderItems) {
        dom.orderItems.innerHTML = '';
      }
      if (dom.summaryItems) {
        dom.summaryItems.innerHTML = '<p>No products selected.</p>';
      }
      if (dom.orderCountLabel) {
        dom.orderCountLabel.textContent = 'No items in your cart';
      }
      return;
    }

    if (dom.orderCountLabel) {
      dom.orderCountLabel.textContent = `${detailedItems.length} ${detailedItems.length === 1 ? 'item' : 'items'} in your order`;
    }

    renderOrderItems(detailedItems);
    renderSummaryItems(detailedItems);

    const subtotal = detailedItems.reduce((total, item) => total + item.lineTotal, 0);
    const shipping = subtotal >= 75000 || subtotal === 0 ? 0 : 499;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    setTotals(subtotal, shipping, tax, total);
  }

  function renderOrderItems(items) {
    if (!dom.orderItems) return;
    if (engine) {
      const tasks = items.map(item =>
        engine.renderFile('checkout-order-item', {
          item: {
            ...item,
            lineTotalFormatted: formatCurrency(item.lineTotal)
          }
        })
      );
      Promise.all(tasks)
        .then(html => {
          dom.orderItems.innerHTML = html.join('');
        })
        .catch(() => {
          dom.orderItems.innerHTML = buildFallbackOrder(items);
        });
    } else {
      dom.orderItems.innerHTML = buildFallbackOrder(items);
    }
  }

  function buildFallbackOrder(items) {
    return items
      .map(
        item => `
          <div class="order-item">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="item-details">
              <h4>${item.title}</h4>
              <p>${item.category || 'Electronics'} | Qty: ${item.quantity}</p>
              <span class="item-price">${formatCurrency(item.lineTotal)}</span>
            </div>
          </div>
        `
      )
      .join('');
  }

  function renderSummaryItems(items) {
    if (!dom.summaryItems) return;
    if (engine) {
      const tasks = items.map(item =>
        engine.renderFile('checkout-summary-item', {
          item: {
            ...item,
            lineTotalFormatted: formatCurrency(item.lineTotal)
          }
        })
      );
      Promise.all(tasks)
        .then(html => {
          dom.summaryItems.innerHTML = html.join('');
        })
        .catch(() => {
          dom.summaryItems.innerHTML = buildFallbackSummary(items);
        });
    } else {
      dom.summaryItems.innerHTML = buildFallbackSummary(items);
    }
  }

  function buildFallbackSummary(items) {
    return items
      .map(
        item => `
          <div class="summary-item">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="item-info">
              <h4>${item.title}</h4>
              <p>Qty: ${item.quantity}</p>
              <span>${formatCurrency(item.lineTotal)}</span>
            </div>
          </div>
        `
      )
      .join('');
  }

  function setTotals(subtotal, shipping, tax, total) {
    const totals = {
      subtotal,
      shipping,
      tax,
      total
    };

    Object.entries(totals).forEach(([key, value]) => {
      if (dom.formTotals[key]) {
        dom.formTotals[key].textContent = formatCurrency(value);
      }
      if (dom.summaryTotals[key]) {
        dom.summaryTotals[key].textContent = formatCurrency(value);
      }
    });
  }

  function handlePlaceOrder(event) {
    event.preventDefault();
    if (!detailedItems.length) {
      notify('Add products before placing an order.', 'error');
      return;
    }

    const requiredFields = document.querySelectorAll('.checkout-form input[required], .checkout-form select[required]');
    for (const field of requiredFields) {
      if (typeof field.reportValidity === 'function') {
        if (!field.reportValidity()) {
          field.focus();
          return;
        }
      } else if (!field.value.trim()) {
        field.focus();
        notify('Please fill all required fields.', 'error');
        return;
      }
    }

    clearCart();
    cartItems = [];
    detailedItems = [];
    render();
    notify('Order placed successfully! Thank you for shopping with us.', 'success');
  }

  function resolveCartSource() {
    const params = new URLSearchParams(window.location.search);
    const directId = params.get('id') || params.get('productId');
    const qty = Math.max(1, Number(params.get('qty') || params.get('quantity') || 1));
    if (directId && productMap.has(directId)) {
      return [
        {
          id: directId,
          quantity: qty
        }
      ];
    }
    return loadCart();
  }

  function loadCart() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  function clearCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = '0';
    }
  }

  function normalizeItems(items, map) {
    return items
      .map(entry => {
        const product = map.get(String(entry.id));
        if (!product) return null;
        const quantity = Math.max(1, Number(entry.quantity) || 1);
        return {
          id: product.id,
          title: product.title,
          category: product.category,
          image: product.image || 'https://via.placeholder.com/80x80?text=No+Image',
          price: product.price || 0,
          quantity,
          lineTotal: (product.price || 0) * quantity
        };
      })
      .filter(Boolean);
  }

  function toggleElement(element, show) {
    if (!element) return;
    element.style.display = show ? '' : 'none';
  }

  function formatCurrency(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  function notify(message, type) {
    if (typeof window.showNotification === 'function') {
      window.showNotification(message, type);
    } else {
      alert(message);
    }
  }
});

