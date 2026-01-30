(function(){
  document.addEventListener('click', function(e){
    var link = e.target.closest('.dash-sidebar .nav-link');
    if(!link) return;
    e.preventDefault();

    // set active link
    document.querySelectorAll('.dash-sidebar .nav-link').forEach(function(a){ a.classList.remove('active'); });
    link.classList.add('active');

    // show target panel
    var target = link.getAttribute('data-target');
    if(!target) return;
    document.querySelectorAll('.dash-panel').forEach(function(p){ p.classList.add('d-none'); });
    var panel = document.querySelector(target);
    if(panel){ panel.classList.remove('d-none'); }
  });

  // Inline edit for addresses
  document.addEventListener('click', function(e){
    var btn = e.target.closest('.btn-edit-address');
    if(!btn) return;
    e.preventDefault();
    var card = btn.closest('.address-card');
    if(!card) return;
    var line = card.querySelector('.addr-line');
    var current = line ? line.textContent.trim() : '';

    // If already editing, save
    var existing = card.querySelector('input.addr-input');
    if(existing){
      line.textContent = existing.value.trim() || current;
      existing.remove();
      btn.textContent = 'Edit';
      return;
    }

    // Switch to edit
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control addr-input mt-2';
    input.value = current;
    card.appendChild(input);
    btn.textContent = 'Save';
  });

  // Settings: Reset Password button -> navigate to reset page
  document.addEventListener('click', function(e){
    var resetBtn = e.target.closest('#btnResetPassword');
    if(!resetBtn) return;
    e.preventDefault();
    window.location.href = '../reset-password.html';
  });
})();
