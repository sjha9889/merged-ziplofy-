(function () {
  function initLocationSelector() {
    var lineEl = document.querySelector(".vs-location__line");
    var changeEl = document.querySelector(".vs-location__change");
    if (!lineEl || !changeEl) {
      return;
    }

    var STORAGE_KEY = "voltixLocation";

    function applySavedLocation() {
      try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          return;
        }
        var parsed = JSON.parse(saved);
        if (parsed && parsed.label) {
          lineEl.textContent = parsed.label;
        }
      } catch (err) {
        /* ignore localStorage parse errors */
      }
    }

    function saveLocation(label, pin) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            label: label,
            pin: pin
          })
        );
      } catch (err) {
        /* ignore storage write errors */
      }
    }

    async function lookupPincode(pin) {
      try {
        var response = await fetch("https://api.postalpincode.in/pincode/" + pin, {
          method: "GET"
        });
        if (!response.ok) {
          return "";
        }
        var data = await response.json();
        if (!Array.isArray(data) || !data[0] || !Array.isArray(data[0].PostOffice) || !data[0].PostOffice[0]) {
          return "";
        }
        var office = data[0].PostOffice[0];
        var district = office.District || office.Name || "";
        var state = office.State || "";
        var formatted = [district, state].filter(Boolean).join(", ");
        return formatted ? formatted + " " + pin : "";
      } catch (err) {
        return "";
      }
    }

    changeEl.addEventListener("click", async function (event) {
      event.preventDefault();
      var input = window.prompt("Enter 6-digit pincode");
      if (input === null) {
        return;
      }
      var pin = String(input).trim();
      if (!/^[0-9]{6}$/.test(pin)) {
        window.alert("Please enter a valid 6-digit pincode.");
        return;
      }

      var oldText = lineEl.textContent;
      lineEl.textContent = "Checking pincode...";
      var label = await lookupPincode(pin);
      if (!label) {
        label = "Location " + pin;
      }
      lineEl.textContent = label;
      saveLocation(label, pin);

      if (oldText === label) {
        return;
      }
    });

    applySavedLocation();
  }

  function initMobileNav() {
    var openBtn = document.getElementById("vsMenuOpen");
    var closeBtn = document.getElementById("vsMenuClose");
    var drawer = document.getElementById("vsNavDrawer");
    var backdrop = document.getElementById("vsDrawerBackdrop");
    if (!openBtn || !closeBtn || !drawer) {
      return;
    }

    function setOpen(open) {
      drawer.classList.toggle("is-open", open);
      document.body.classList.toggle("vs-nav-open", open);
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        closeBtn.focus();
      } else {
        openBtn.focus();
      }
    }

    openBtn.addEventListener("click", function () {
      setOpen(true);
    });

    closeBtn.addEventListener("click", function () {
      setOpen(false);
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }

    drawer.querySelectorAll(".vs-drawer__nav a, .vs-drawer__footer-link").forEach(function (el) {
      el.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  }

  function initHeroCarousel() {
    const hero = document.getElementById("heroSection");
    const bg = document.getElementById("heroBg");
    const prevBtn = document.getElementById("heroPrev");
    const nextBtn = document.getElementById("heroNext");
    if (!hero || !bg || !prevBtn || !nextBtn) {
      return;
    }

    const dots = Array.from(hero.querySelectorAll(".ac-dot"));
    if (!dots.length) {
      return;
    }

    const slides = [
      "assets/img/banner-1.png",
      "assets/img/banner-2.png",
      "assets/img/banner-3.png",
      "assets/img/banner-4.png",
      "assets/img/banner-5.png",
      "assets/img/banner-2.png",
      "assets/img/banner-3.png"
    ];
    let index = 0;

    function render() {
      bg.style.backgroundImage = `url('${slides[index]}')`;
      dots.forEach(function (dot, i) {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        if (active) {
          dot.setAttribute("aria-current", "true");
          dot.removeAttribute("tabindex");
        } else {
          dot.removeAttribute("aria-current");
          dot.setAttribute("tabindex", "-1");
        }
      });
    }

    prevBtn.addEventListener("click", function () {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });

    nextBtn.addEventListener("click", function () {
      index = (index + 1) % slides.length;
      render();
    });

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        const nextIndex = parseInt(dot.getAttribute("data-slide"), 10);
        if (!Number.isNaN(nextIndex)) {
          index = nextIndex;
          render();
        }
      });
    });

    render();
  }

  function initHorizontalSlider(config) {
    const track = document.getElementById(config.trackId);
    const viewport = document.getElementById(config.viewportId);
    const prevBtn = document.getElementById(config.prevId);
    const nextBtn = document.getElementById(config.nextId);

    if (!track || !viewport || !prevBtn || !nextBtn) {
      return;
    }

    const cards = Array.from(track.children);
    let currentX = 0;
    let wasFlexScroll = false;
    const flexScrollBelow =
      typeof config.flexScrollBelow === "number" ? config.flexScrollBelow : 0;
    const flexScrollClass = config.flexScrollClass || "hd-slider--scroll";

    function useFlexScroll() {
      return flexScrollBelow > 0 && window.innerWidth <= flexScrollBelow;
    }

    function getGap() {
      const trackStyle = window.getComputedStyle(track);
      return parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;
    }

    function getStep() {
      const firstCard = cards[0];
      if (!firstCard) {
        return 0;
      }
      const gap = getGap();
      const w = firstCard.getBoundingClientRect().width;
      if (useFlexScroll()) {
        return w * 2 + gap * 2;
      }
      return w + gap;
    }

    function getMaxX() {
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    }

    function updateButtons(maxX) {
      prevBtn.disabled = currentX <= 0;
      nextBtn.disabled = currentX >= maxX - 1;
    }

    function updateButtonsFromScroll() {
      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const sl = viewport.scrollLeft;
      prevBtn.disabled = sl <= 2;
      nextBtn.disabled = sl >= maxScroll - 2;
    }

    function render() {
      const flex = useFlexScroll();
      if (flex) {
        track.style.transform = "";
        viewport.classList.add(flexScrollClass);
        updateButtonsFromScroll();
        wasFlexScroll = true;
        return;
      }

      viewport.classList.remove(flexScrollClass);
      if (wasFlexScroll) {
        viewport.scrollLeft = 0;
        currentX = 0;
        wasFlexScroll = false;
      }
      const maxX = getMaxX();
      if (currentX > maxX) {
        currentX = maxX;
      }
      track.style.transform = `translateX(-${currentX}px)`;
      updateButtons(maxX);
    }

    prevBtn.addEventListener("click", function () {
      if (useFlexScroll()) {
        viewport.scrollBy({ left: -getStep(), behavior: "smooth" });
        return;
      }
      const step = getStep();
      currentX = Math.max(0, currentX - step);
      render();
    });

    nextBtn.addEventListener("click", function () {
      if (useFlexScroll()) {
        viewport.scrollBy({ left: getStep(), behavior: "smooth" });
        return;
      }
      const step = getStep();
      const maxX = getMaxX();
      currentX = Math.min(maxX, currentX + step);
      render();
    });

    viewport.addEventListener("scroll", function () {
      if (useFlexScroll()) {
        updateButtonsFromScroll();
      }
    });

    window.addEventListener("resize", render);
    render();
  }

  function initContactPanIndiaScrollTop() {
    var btn = document.getElementById("contactPanIndiaScrollTop");
    if (!btn) {
      return;
    }
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  initHeroCarousel();
  initLocationSelector();
  initMobileNav();
  initContactPanIndiaScrollTop();

  initHorizontalSlider({
    viewportId: "appleViewport",
    trackId: "appleTrack",
    prevId: "applePrev",
    nextId: "appleNext"
  });

  initHorizontalSlider({
    viewportId: "summerViewport",
    trackId: "summerTrack",
    prevId: "summerPrev",
    nextId: "summerNext",
    flexScrollBelow: 900,
    flexScrollClass: "summer-deals__viewport--scroll"
  });

  initHorizontalSlider({
    viewportId: "windowsViewport",
    trackId: "windowsTrack",
    prevId: "windowsPrev",
    nextId: "windowsNext"
  });

  initHorizontalSlider({
    viewportId: "trendingViewport",
    trackId: "trendingTrack",
    prevId: "trendingPrev",
    nextId: "trendingNext"
  });

  initHorizontalSlider({
    viewportId: "cromaViewport",
    trackId: "cromaTrack",
    prevId: "cromaPrev",
    nextId: "cromaNext"
  });
})();
