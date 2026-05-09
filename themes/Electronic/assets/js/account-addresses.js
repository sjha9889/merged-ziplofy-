(function () {
  var STORAGE_KEY = "voltixAccountAddresses";
  var browseEl = document.getElementById("acc-addr-browse");
  var formViewEl = document.getElementById("acc-addr-form-view");
  var emptyEl = document.getElementById("acc-addr-empty");
  var listSectionEl = document.getElementById("acc-addr-list-section");
  var cardsEl = document.getElementById("acc-addr-cards");
  var formEl = document.getElementById("accAddressForm");
  var formHeadingEl = document.getElementById("acc-addr-form-heading");
  var feedbackEl = document.getElementById("acc-addr-form-feedback");
  var idInput = document.getElementById("adr-id");

  if (!browseEl || !formViewEl || !formEl || !cardsEl) {
    return;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readList() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function writeList(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      /* ignore */
    }
  }

  function saveAsLabel(v) {
    if (v === "office") {
      return { text: "Office", icon: "fa-briefcase" };
    }
    if (v === "other") {
      return { text: "Others", icon: "fa-location-dot" };
    }
    return { text: "Home", icon: "fa-house" };
  }

  function formatAddress(a) {
    return [a.house, a.area, a.landmark, a.city, a.state, a.pincode].filter(Boolean).join(", ");
  }

  function renderCards(list) {
    cardsEl.innerHTML = list
      .map(function (a) {
        var sa = saveAsLabel(a.saveAs);
        var name = esc([a.firstName, a.lastName].filter(Boolean).join(" ").trim() || "—");
        var addr = esc(formatAddress(a));
        return (
          '<article class="acc-addr-card" data-addr-id="' +
          esc(a.id) +
          '">' +
          '<div class="acc-addr-card__top">' +
          '<div class="acc-addr-card__type"><i class="fa-solid ' +
          sa.icon +
          '" aria-hidden="true"></i> ' +
          esc(sa.text) +
          "</div>" +
          '<div class="acc-addr-card__actions">' +
          '<button type="button" class="acc-addr-card__action" data-acc-addr-edit="' +
          esc(a.id) +
          '"><i class="fa-solid fa-pencil" aria-hidden="true"></i> Edit</button>' +
          '<span class="acc-addr-card__sep" aria-hidden="true"></span>' +
          '<button type="button" class="acc-addr-card__action" data-acc-addr-remove="' +
          esc(a.id) +
          '"><i class="fa-solid fa-trash" aria-hidden="true"></i> Remove</button>' +
          "</div></div>" +
          '<p class="acc-addr-card__name">' +
          name +
          "</p>" +
          '<p class="acc-addr-card__addr">' +
          addr +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function render() {
    var list = readList();
    if (!list.length) {
      emptyEl.hidden = false;
      listSectionEl.hidden = true;
    } else {
      emptyEl.hidden = true;
      listSectionEl.hidden = false;
      renderCards(list);
    }
  }

  function showBrowse() {
    browseEl.removeAttribute("hidden");
    formViewEl.setAttribute("hidden", "hidden");
    if (feedbackEl) {
      feedbackEl.textContent = "";
    }
    render();
  }

  function showForm(editId) {
    formEl.reset();
    if (idInput) {
      idInput.value = editId || "";
    }
    if (feedbackEl) {
      feedbackEl.textContent = "";
    }

    if (editId) {
      var list = readList();
      var a = list.find(function (x) {
        return x.id === editId;
      });
      if (a) {
        if (formHeadingEl) {
          formHeadingEl.textContent = "Edit Address";
        }
        document.getElementById("adr-first").value = a.firstName || "";
        document.getElementById("adr-last").value = a.lastName || "";
        document.getElementById("adr-email").value = a.email || "";
        document.getElementById("adr-mobile").value = a.mobile || "";
        document.getElementById("adr-house").value = a.house || "";
        document.getElementById("adr-area").value = a.area || "";
        document.getElementById("adr-landmark").value = a.landmark || "";
        document.getElementById("adr-pincode").value = a.pincode || "";
        document.getElementById("adr-city").value = a.city || "";
        document.getElementById("adr-state").value = a.state || "";
        document.getElementById("adr-default").checked = !!a.isDefault;
        var saveAs = a.saveAs || "home";
        formEl.querySelectorAll('input[name="adrSaveAs"]').forEach(function (r) {
          r.checked = r.value === saveAs;
        });
      }
    } else {
      if (formHeadingEl) {
        formHeadingEl.textContent = "Add new Address";
      }
    }

    browseEl.setAttribute("hidden", "hidden");
    formViewEl.removeAttribute("hidden");
  }

  function collectForm() {
    var saveAsEl = formEl.querySelector('input[name="adrSaveAs"]:checked');
    return {
      id: (idInput && idInput.value) || String(Date.now()) + "-" + Math.floor(Math.random() * 10000),
      firstName: (document.getElementById("adr-first").value || "").trim(),
      lastName: (document.getElementById("adr-last").value || "").trim(),
      email: (document.getElementById("adr-email").value || "").trim(),
      mobile: (document.getElementById("adr-mobile").value || "").trim(),
      house: (document.getElementById("adr-house").value || "").trim(),
      area: (document.getElementById("adr-area").value || "").trim(),
      landmark: (document.getElementById("adr-landmark").value || "").trim(),
      pincode: (document.getElementById("adr-pincode").value || "").trim(),
      city: (document.getElementById("adr-city").value || "").trim(),
      state: (document.getElementById("adr-state").value || "").trim(),
      isDefault: document.getElementById("adr-default").checked,
      saveAs: saveAsEl ? saveAsEl.value : "home"
    };
  }

  document.querySelectorAll(".acc-js-addr-open-form").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showForm(null);
    });
  });

  document.querySelectorAll(".acc-js-addr-close-form").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showBrowse();
    });
  });

  cardsEl.addEventListener("click", function (e) {
    var editBtn = e.target.closest("[data-acc-addr-edit]");
    var remBtn = e.target.closest("[data-acc-addr-remove]");
    if (editBtn) {
      showForm(editBtn.getAttribute("data-acc-addr-edit"));
      return;
    }
    if (remBtn) {
      var rid = remBtn.getAttribute("data-acc-addr-remove");
      var list = readList().filter(function (x) {
        return x.id !== rid;
      });
      writeList(list);
      render();
    }
  });

  formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }
    var data = collectForm();
    var list = readList();
    var editingId = idInput && idInput.value;

    if (editingId) {
      var idx = list.findIndex(function (x) {
        return x.id === editingId;
      });
      if (idx >= 0) {
        data.id = editingId;
        list[idx] = data;
      } else {
        list.push(data);
      }
    } else {
      list.push(data);
    }

    if (data.isDefault) {
      list.forEach(function (x) {
        if (x.id !== data.id) {
          x.isDefault = false;
        }
      });
    }

    writeList(list);
    showBrowse();
  });

  var addrTabBtn = document.getElementById("acc-tab-addresses");
  if (addrTabBtn) {
    addrTabBtn.addEventListener("click", function () {
      window.requestAnimationFrame(render);
    });
  }

  render();
})();
