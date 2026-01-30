// Shop page dynamic rendering with filters, sorting, and pagination
(function(){
  const PAGE_SIZE = 9;
  let allProducts = [];
  let filtered = [];
  let currentPage = 1;

  function qs(sel){ return document.querySelector(sel) }
  function qsa(sel){ return Array.from(document.querySelectorAll(sel)) }

  function loadData(){
    if(!window.products){ console.warn('products not loaded'); return; }
    allProducts = Object.values(window.products);
    filtered = [...allProducts];
    render();
    bindUI();
  }

  function bindUI(){
    // Filters - sync between main sidebar and mobile drawer
    qsa('.filter-checkbox').forEach(cb=>{
      cb.addEventListener('change', ()=>{
        // Sync with mobile drawer if exists
        const mobileCb = document.querySelector(`#filterDrawerContent .filter-checkbox[value="${cb.value}"]`);
        if(mobileCb) mobileCb.checked = cb.checked;
        applyFilters();
      });
    });
    const range = qs('#priceRange');
    if(range){ 
      range.addEventListener('input', (e)=>{
        const mobileRange = qs('#priceRangeMobile');
        if(mobileRange) mobileRange.value = e.target.value;
        applyFilters();
      }); 
    }
    const sort = qs('#sortSelect');
    if(sort){ sort.addEventListener('change', ()=>{ sortProducts(); renderProducts(); }); }
    const clear = qs('.clear-filters-btn');
    if(clear){ clear.addEventListener('click', ()=>{ resetFilters(); }); }
  }

  function applyFilters(){
    const checked = qsa('.filter-checkbox:checked');
    const cats = checked.filter(el=>['electronics','fashion','home'].includes(el.value)).map(el=>el.value);
    const brands = checked.filter(el=>['sony','apple','nike','samsung'].includes(el.value)).map(el=>el.value);
    const ratings = checked.filter(el=>['4','5'].includes(el.value)).map(el=>parseInt(el.value,10));
    const priceRange = qs('#priceRange') || qs('#priceRangeMobile');
    const maxPrice = parseInt(priceRange?.value || '200000',10);

    filtered = allProducts.filter(p=>{
      const byCat = cats.length ? cats.includes(p.category.toLowerCase().split(' ')[0]) : true;
      const byBrand = brands.length ? brands.some(b => p.name.toLowerCase().includes(b)) : true;
      const byRating = ratings.length ? ratings.some(r => p.rating >= r) : true;
      const byPrice = p.price <= maxPrice;
      return byCat && byBrand && byRating && byPrice;
    });
    currentPage = 1;
    sortProducts();
    render();
  }

  function resetFilters(){
    qsa('.filter-checkbox').forEach(cb=>{ cb.checked=false });
    const mainRange = qs('#priceRange');
    const mobileRange = qs('#priceRangeMobile');
    if(mainRange) mainRange.value = 200000;
    if(mobileRange) mobileRange.value = 200000;
    filtered = [...allProducts];
    currentPage = 1;
    sortProducts();
    render();
  }

  function sortProducts(){
    const sort = qs('#sortSelect')?.value || 'featured';
    const arr = filtered;
    if(sort==='price-low') arr.sort((a,b)=>a.price-b.price);
    else if(sort==='price-high') arr.sort((a,b)=>b.price-a.price);
    else if(sort==='rating') arr.sort((a,b)=>b.rating-a.rating);
    else if(sort==='newest') arr.sort((a,b)=> (b.reviewCount||0)-(a.reviewCount||0));
  }

  function render(){
    renderProducts();
    renderPagination();
    renderResultsCount();
  }

  function renderResultsCount(){
    const el = qs('#resultsCount');
    if(!el) return;
    const start = (currentPage-1)*PAGE_SIZE + 1;
    const end = Math.min(currentPage*PAGE_SIZE, filtered.length);
    el.textContent = `Showing ${filtered.length? start:0}-${end} of ${filtered.length} products`;
  }

  function renderProducts(){
    const grid = qs('#productsGrid'); if(!grid) return;
    grid.innerHTML = '';
    const start = (currentPage-1)*PAGE_SIZE;
    const items = filtered.slice(start, start+PAGE_SIZE);
    items.forEach(p=> grid.appendChild(createCard(p)) );
    bindCardActions();
  }

  function createCard(p){
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-card-img">
        <img src="${p.images?.[0]}" alt="${p.name}">
        <span class="shop-card-badge">${p.discount}% OFF</span>
      </div>
      <div class="shop-card-body">
        <h3 class="shop-card-name">${p.name}</h3>
        <div class="shop-card-rating">${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)} <span style="color:#9aa4b2">(${(p.reviewCount||0).toLocaleString()})</span></div>
        <p class="shop-card-desc">${p.shortDescription || p.description || ''}</p>
        <div class="shop-card-price"><span class="now">₹${p.price.toLocaleString()}</span><span class="was">₹${p.originalPrice.toLocaleString()}</span></div>
        <div class="shop-card-actions">
          <button class="btn-outline" data-id="${p.id}">Add to Cart</button>
          <button class="btn-solid" data-id="${p.id}">Buy Now</button>
        </div>
      </div>`;
    // name click -> product detail
    card.querySelector('.shop-card-name').onclick = ()=>{ window.location.href = `product-detail.html?id=${p.id}` };
    // image click -> product detail
    card.querySelector('img').onclick = ()=>{ window.location.href = `product-detail.html?id=${p.id}` };
    return card;
  }

  function addToCartById(productId, qty=1){
    if(!window.products) return;
    const p = window.products[productId]; if(!p) return;
    let items=[]; try{ items = JSON.parse(localStorage.getItem('cartItems')||'[]') }catch{}
    const found = items.find(i=>i.id===productId);
    if(found){ found.qty = Math.min(10,(found.qty||found.quantity||1)+qty); }
    else { items.push({ id:productId, name:p.name, price:p.price, qty:qty, image:p.images?.[0] }); }
    localStorage.setItem('cartItems', JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  }

  function bindCardActions(){
    qsa('.shop-card .btn-outline').forEach(btn=>{
      btn.onclick = ()=> addToCartById(btn.getAttribute('data-id'));
    });
    qsa('.shop-card .btn-solid').forEach(btn=>{
      btn.onclick = ()=> { addToCartById(btn.getAttribute('data-id')); window.location.href='cart.html'; };
    });
  }

  function renderPagination(){
    const pag = qs('#pagination'); if(!pag) return;
    pag.innerHTML = '';
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    function addBtn(label, page, active=false, disabled=false){
      const b = document.createElement('button');
      b.className = 'page-btn' + (active? ' active':'');
      b.textContent = label;
      b.disabled = disabled;
      if(!disabled){ b.onclick = ()=>{ currentPage = page; render(); window.scrollTo({top:0,behavior:'smooth'}); } }
      pag.appendChild(b);
    }
    addBtn('«', Math.max(1, currentPage-1), false, currentPage===1);
    for(let i=1;i<=totalPages;i++) addBtn(String(i), i, i===currentPage);
    addBtn('»', Math.min(totalPages, currentPage+1), false, currentPage===totalPages);
  }

  // Mobile filter drawer functionality
  function initMobileFilterDrawer() {
    const filterBtn = document.getElementById('mobileFilterBtn');
    const drawerOverlay = document.getElementById('filterDrawerOverlay');
    const drawerClose = document.getElementById('filterDrawerClose');
    const drawerContent = document.getElementById('filterDrawerContent');
    const shopSidebar = document.getElementById('shopSidebar');
    
    if (!filterBtn || !drawerOverlay || !drawerClose || !drawerContent || !shopSidebar) {
      console.warn('Filter drawer elements not found');
      return;
    }
    
    // Function to clone and setup drawer content
    function cloneSidebarToDrawer() {
      // Clear existing content
      drawerContent.innerHTML = '';
      
      // Clone the entire sidebar
      const sidebarClone = shopSidebar.cloneNode(true);
      sidebarClone.removeAttribute('id');
      sidebarClone.classList.add('mobile-sidebar-clone');
      drawerContent.appendChild(sidebarClone);
      
      // Re-bind filter events for cloned elements
      setTimeout(() => {
        // Fix duplicate IDs
        const clonedRange = drawerContent.querySelector('#priceRange');
        if (clonedRange) {
          clonedRange.id = 'priceRangeMobile';
        }
        
        const clonedMinPrice = drawerContent.querySelector('#minPrice');
        const clonedMaxPrice = drawerContent.querySelector('#maxPrice');
        if (clonedMinPrice) clonedMinPrice.id = 'minPriceMobile';
        if (clonedMaxPrice) clonedMaxPrice.id = 'maxPriceMobile';
        
        // Bind price range slider
        if (clonedRange) {
          clonedRange.addEventListener('input', (e) => {
            const mainRange = qs('#priceRange');
            if (mainRange) mainRange.value = e.target.value;
            
            // Update price displays
            const maxPrice = qs('#maxPrice');
            const maxPriceMobile = qs('#maxPriceMobile');
            const value = parseInt(e.target.value);
            const priceText = `₹${value.toLocaleString('en-IN')}`;
            
            if (maxPrice) maxPrice.textContent = priceText;
            if (maxPriceMobile) maxPriceMobile.textContent = priceText;
            
            applyFilters();
          });
        }
        
        // Bind checkboxes
        Array.from(drawerContent.querySelectorAll('.filter-checkbox')).forEach(cb => {
          // Remove any existing listeners
          const newCb = cb.cloneNode(true);
          cb.parentNode.replaceChild(newCb, cb);
          
          newCb.addEventListener('change', () => {
            const mainCheckbox = qs(`#shopSidebar .filter-checkbox[value="${newCb.value}"]`);
            if (mainCheckbox) mainCheckbox.checked = newCb.checked;
            applyFilters();
          });
        });
        
        // Bind clear button
        const clear = drawerContent.querySelector('.clear-filters-btn');
        if (clear) {
          clear.addEventListener('click', () => {
            resetFilters();
            closeDrawer();
          });
        }
      }, 100);
    }
    
    function openDrawer() {
      if (window.innerWidth <= 768) {
        cloneSidebarToDrawer();
      }
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeDrawer() {
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    filterBtn.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) closeDrawer();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawerOverlay.classList.contains('active')) {
        closeDrawer();
      }
    });
    
    // No need to setup on load - will clone when drawer opens
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initMobileFilterDrawer();
  });
})();


