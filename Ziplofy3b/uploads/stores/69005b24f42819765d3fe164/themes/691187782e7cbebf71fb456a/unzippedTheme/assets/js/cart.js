// Minimal cart rendering using localStorage key 'cartItems'
(function(){
  const KEY = 'cartItems';
  let items = [];
  let coupon = null;

  function load(){
    try{ items = JSON.parse(localStorage.getItem(KEY)||'[]') }catch{ items=[] }
    // Seed with a couple of products if empty (demo convenience)
    if((items?.length||0)===0 && window.products){
      const seedIds = ['apple-watch-series-9','sony-wh-1000xm4'];
      seedIds.forEach(id=>{
        const p = window.products[id];
        if(p){ items.push({ id, name:p.name, price:p.price, qty:1, image:p.images?.[0] }); }
      });
      save();
    }
    render();
  }

  function save(){ localStorage.setItem(KEY, JSON.stringify(items)) }

  function format(n){ return '₹'+(n||0).toLocaleString() }

  function render(){
    const list = document.getElementById('cartList');
    const empty = document.getElementById('cartEmpty');
    if(!list||!empty) return;
    // If there are no dynamic items but static fallback rows exist in markup,
    // keep them visible instead of replacing with the empty state.
    if(items.length===0){
      if(list.children && list.children.length>0){
        empty.style.display='none';
        return;
      }
      list.innerHTML='';
      empty.style.display='block';
      calc();
      return;
    }
    list.innerHTML='';
    empty.style.display='none';
    items.forEach((it,idx)=>{
      const row = document.createElement('div');
      row.className='cart-row';
      row.innerHTML = `
        <div class="col col-product">
          <div class="cart-product">
            <div class="cart-thumb"><img src="${it.image}" alt="${it.name}"></div>
            <div>
              <h3 class="cart-title">${it.name}</h3>
              <div class="cart-meta">${it.variant||''}</div>
            </div>
          </div>
        </div>
        <div class="col col-price"><div class="price">${format(it.price)}</div></div>
        <div class="col col-qty">
          <div class="qty">
            <button class="qty-btn" data-act="dec">-</button>
            <input class="qty-input" type="number" min="1" max="10" value="${it.qty||1}">
            <button class="qty-btn" data-act="inc">+</button>
          </div>
        </div>
        <div class="col col-total"><div class="line-total">${format((it.price||0)*(it.qty||1))}</div></div>
        <div class="col col-remove"><button class="btn-remove" data-act="rm">×</button></div>`;
      const qtyInput = row.querySelector('.qty-input');
      row.querySelectorAll('.qty-btn').forEach(b=>{
        b.onclick=()=>{ const act=b.getAttribute('data-act');
          let q = parseInt(qtyInput.value||'1',10);
          if(act==='dec'&&q>1) q--; if(act==='inc'&&q<10) q++;
          qtyInput.value=q; items[idx].qty=q; save(); calc(); };
      });
      row.querySelector('.btn-remove').onclick=()=>{ items.splice(idx,1); save(); render(); };
      qtyInput.onchange=()=>{ let q=parseInt(qtyInput.value||'1',10); q=Math.min(10,Math.max(1,q)); items[idx].qty=q; save(); calc(); };
      list.appendChild(row);
    });
    calc();
  }

  function calc(){
    const sub = items.reduce((s,it)=> s + (it.price||0)*(it.qty||1), 0);
    const disc = coupon==='SAVE10' ? Math.round(sub*0.10) : 0;
    const ship = sub>999 ? 0 : (items.length? 49:0);
    const total = sub - disc + ship;
    set('subTotal', format(sub));
    set('discount', '- '+format(disc));
    set('shipping', format(ship));
    set('grandTotal', format(total));
  }
  function set(id, val){ const el=document.getElementById(id); if(el) el.textContent=val }

  // Coupon
  document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('applyCoupon')?.addEventListener('click', ()=>{
      const code = (document.getElementById('couponInput')?.value||'').trim().toUpperCase();
      coupon = code; calc();
      alert(code==='SAVE10' ? 'Coupon applied!' : 'Coupon updated');
    });
  });

  // For demo: add item when navigated from product page via query ?add=id
  function maybeAddFromQuery(){
    const id = new URLSearchParams(location.search).get('add');
    if(!id || !window.products) return;
    const p = window.products[id]; if(!p) return;
    const existing = items.find(i=>i.id===id);
    if(existing) existing.qty = Math.min(10,(existing.qty||1)+1);
    else items.push({ id, name:p.name, price:p.price, qty:1, image:p.images?.[0] });
    save();
  }

  document.addEventListener('DOMContentLoaded', ()=>{ maybeAddFromQuery(); load(); });

  // Proceed to Checkout
  document.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('checkoutBtn');
    if(btn){
      btn.addEventListener('click', ()=>{
        if((items?.length||0)===0){
          alert('Your cart is empty. Add some items first.');
          return;
        }
        // Redirect flow: send user to login; login already redirects to account.
        window.location.href = 'login.html?redirect=checkout';
      });
    }
  });

  // Re-render when other pages update cart
  document.addEventListener('cart:updated', ()=>{ load(); });
  window.addEventListener('storage', (e)=>{ if(e.key===KEY) load(); });
})();


