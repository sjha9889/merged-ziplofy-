(function () {
  var tabs = document.querySelectorAll(".acc-dash__nav-link[data-acc-tab]");
  var panels = document.querySelectorAll(".acc-dash__main [data-acc-panel]");
  if (!tabs.length || !panels.length) {
    return;
  }

  function show(tab) {
    panels.forEach(function (panel) {
      var match = panel.getAttribute("data-acc-panel") === tab;
      panel.classList.toggle("is-active", match);
      panel.setAttribute("aria-hidden", match ? "false" : "true");
    });
    tabs.forEach(function (btn) {
      var match = btn.getAttribute("data-acc-tab") === tab;
      btn.classList.toggle("is-active", match);
      btn.setAttribute("aria-selected", match ? "true" : "false");
    });
  }

  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      show(btn.getAttribute("data-acc-tab"));
    });
  });

  document.querySelectorAll(".acc-js-goto-orders").forEach(function (el) {
    el.addEventListener("click", function () {
      show("orders");
      var t = document.getElementById("acc-tab-orders");
      if (t) {
        t.focus();
      }
    });
  });
})();
