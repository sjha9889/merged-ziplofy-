(function () {
  var STORAGE_KEY = "voltixAccountProfile";
  var form = document.getElementById("accPersonalForm");
  var nameEl = document.getElementById("acc-overview-name");
  var emailEl = document.getElementById("acc-overview-email");
  var mobileEl = document.getElementById("acc-overview-mobile");
  var feedbackEl = document.getElementById("acc-personal-feedback");

  if (!form || !nameEl || !emailEl) {
    return;
  }

  function readStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function writeStorage(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      /* ignore */
    }
  }

  function collectForm() {
    var genderChecked = form.querySelector('input[name="pd-gender"]:checked');
    return {
      gender: genderChecked ? genderChecked.value : "male",
      firstName: (document.getElementById("pd-first").value || "").trim(),
      lastName: (document.getElementById("pd-last").value || "").trim(),
      email: (document.getElementById("pd-email").value || "").trim(),
      mobile: (document.getElementById("pd-mobile").value || "").trim(),
      dob: (document.getElementById("pd-dob") && document.getElementById("pd-dob").value) || "",
      anniversary: (document.getElementById("pd-anniversary") && document.getElementById("pd-anniversary").value) || ""
    };
  }

  function applyToForm(data) {
    if (!data) {
      return;
    }
    form.querySelectorAll('input[name="pd-gender"]').forEach(function (r) {
      r.checked = r.value === data.gender;
    });
    document.getElementById("pd-first").value = data.firstName || "";
    document.getElementById("pd-last").value = data.lastName || "";
    document.getElementById("pd-email").value = data.email || "";
    document.getElementById("pd-mobile").value = data.mobile || "";
    var dob = document.getElementById("pd-dob");
    var ann = document.getElementById("pd-anniversary");
    if (dob) {
      dob.value = data.dob || "";
    }
    if (ann) {
      ann.value = data.anniversary || "";
    }
    syncDatePlaceholders();
  }

  function displayNameFrom(data) {
    var n = [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
    return n || "guest user";
  }

  function updateOverview(data) {
    nameEl.textContent = displayNameFrom(data);
    emailEl.textContent = data.email || "—";
    if (mobileEl) {
      if (data.mobile) {
        mobileEl.textContent = data.mobile;
        mobileEl.removeAttribute("hidden");
      } else {
        mobileEl.textContent = "";
        mobileEl.setAttribute("hidden", "hidden");
      }
    }
  }

  function syncDatePlaceholders() {
    ["pd-dob", "pd-anniversary"].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) {
        return;
      }
      var wrap = input.closest(".acc-personal-field--date");
      if (wrap) {
        wrap.classList.toggle("has-value", !!input.value);
      }
    });
  }

  function initDateFields() {
    ["pd-dob", "pd-anniversary"].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) {
        return;
      }
      input.addEventListener("change", syncDatePlaceholders);
      input.addEventListener("input", syncDatePlaceholders);
    });
    syncDatePlaceholders();
  }

  var saved = readStorage();
  if (saved) {
    applyToForm(saved);
    updateOverview(saved);
  }

  initDateFields();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = collectForm();
    writeStorage(data);
    updateOverview(data);
    if (feedbackEl) {
      feedbackEl.textContent = "Profile saved. Overview updated.";
      window.setTimeout(function () {
        if (feedbackEl) {
          feedbackEl.textContent = "";
        }
      }, 4000);
    }
  });

  document.querySelectorAll(".acc-js-goto-personal").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var btn = document.getElementById("acc-tab-personal");
      if (btn) {
        btn.click();
      }
    });
  });
})();
