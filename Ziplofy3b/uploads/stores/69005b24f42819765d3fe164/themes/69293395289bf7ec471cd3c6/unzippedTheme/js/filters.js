document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('filtersOverlay');
  var openButtons = document.querySelectorAll('.filter-toggle-btn');
  var closeButtons = document.querySelectorAll('.filters-close');

  openButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.getAttribute('data-filters-target'));
      if (!target) return;
      target.classList.add('filters-open');
      if (overlay) overlay.classList.add('active');
      document.body.classList.add('filters-locked');
    });
  });

  function closeFilters() {
    var panels = document.querySelectorAll('.filters-panel');
    panels.forEach(function (panel) {
      panel.classList.remove('filters-open');
    });
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('filters-locked');
  }

  closeButtons.forEach(function (btn) {
    btn.addEventListener('click', closeFilters);
  });

  if (overlay) {
    overlay.addEventListener('click', closeFilters);
  }
});

