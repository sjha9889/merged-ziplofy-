(function () {
  function initAccordions() {
    var items = document.querySelectorAll(".pdp-accordion");
    items.forEach(function (item) {
      var btn = item.querySelector(".pdp-accordion__head");
      if (!btn) {
        return;
      }
      btn.addEventListener("click", function () {
        var open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function initOptionSelectors() {
    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".pdp-option-list button");
      if (!btn) {
        return;
      }

      var list = btn.closest(".pdp-option-list");
      if (!list) {
        return;
      }

      list.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("is-active");
      });
      btn.classList.add("is-active");
    });
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseAmount(priceText) {
    var n = Number(String(priceText || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function formatInr(amount) {
    return (
      "₹" +
      Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  function inferProfile(product) {
    var title = product.title || "";
    var t = normalize(title);
    var isApple = t.indexOf("apple") !== -1 || t.indexOf("iphone") !== -1 || t.indexOf("ipad") !== -1;
    var isSamsung = t.indexOf("samsung") !== -1 || t.indexOf("galaxy") !== -1;
    var isLaptop = t.indexOf("laptop") !== -1 || t.indexOf("macbook") !== -1 || t.indexOf("book") !== -1;
    var isTv = t.indexOf("tv") !== -1 || t.indexOf("bravia") !== -1 || t.indexOf("qled") !== -1 || t.indexOf("led") !== -1;

    var brand = "Voltix";
    if (isApple) {
      brand = "Apple";
    } else if (isSamsung) {
      brand = "Samsung";
    } else if (t.indexOf("vivo") !== -1) {
      brand = "Vivo";
    } else if (t.indexOf("oneplus") !== -1) {
      brand = "OnePlus";
    } else if (t.indexOf("redmi") !== -1 || t.indexOf("xiaomi") !== -1 || t.indexOf("mi ") !== -1) {
      brand = "Xiaomi";
    } else if (t.indexOf("google") !== -1 || t.indexOf("pixel") !== -1) {
      brand = "Google";
    } else if (t.indexOf("hp ") !== -1) {
      brand = "HP";
    } else if (t.indexOf("dell") !== -1) {
      brand = "Dell";
    } else if (t.indexOf("lenovo") !== -1) {
      brand = "Lenovo";
    }

    var category = isLaptop ? "Laptops" : isTv ? "Televisions" : "Mobile Phones";
    var family = isLaptop ? "Computers & Tablets" : isTv ? "TV & Entertainment" : "Phones & Wearables";
    var modelNumber = "VTX-" + Math.floor(100000 + Math.random() * 899999);

    var defaultColors = isApple
      ? ["Silver", "Cosmic Orange", "Deep Blue"]
      : isSamsung
        ? ["Black", "White", "Blue"]
        : ["Black", "Blue", "Grey"];
    var storages = isLaptop ? ["256GB", "512GB", "1TB"] : isTv ? ["43 Inch", "55 Inch", "65 Inch"] : ["128GB", "256GB", "512GB"];
    var rams = isLaptop ? ["8GB", "16GB"] : isTv ? ["3GB", "4GB"] : ["8GB", "12GB"];
    var breadcrumbLeaf =
      isApple && !isLaptop && !isTv ? "iPhones" : isSamsung && !isLaptop && !isTv ? "Galaxy" : brand;

    var keyFeatures = isLaptop
      ? [
          "Display: 15.6 inches, Full HD anti-glare panel",
          "Processor: High-performance multi-core architecture",
          "Memory: 8GB/16GB RAM with fast multitasking",
          "Storage: NVMe SSD for quicker boot and app load",
          "Battery: Long backup with intelligent power mode",
          "Connectivity: Wi-Fi, Bluetooth, USB, HDMI"
        ]
      : isTv
        ? [
            "Display: 4K Ultra HD panel with vivid color output",
            "Refresh Rate: Smooth playback for daily entertainment",
            "Audio: Clear stereo output with enhanced dialog mode",
            "Smart TV: Built-in apps and voice assistant support",
            "Connectivity: HDMI, USB, Wi-Fi and Bluetooth",
            "Design: Slim bezel profile for immersive viewing"
          ]
        : [
            "Display: AMOLED panel with smooth refresh rate",
            "Processor: Latest generation performance chipset",
            "Memory: Optimized RAM for multitasking and gaming",
            "Camera: High-resolution multi-camera setup",
            "Battery: Fast charging with all-day performance",
            "Security: Advanced biometric unlock support"
          ];

    var overviewTitle1 = isLaptop ? "Reliable Performance For Everyday Work" : isTv ? "Immersive Big-Screen Entertainment" : "Premium Smartphone Experience";
    var overviewPara1 = isLaptop
      ? "Built for productivity, this laptop handles daily office tasks, browsing, streaming, and online meetings with stable performance. The efficient design ensures responsive operation across work and entertainment."
      : isTv
        ? "This smart TV delivers rich color, clear contrast, and sharp visuals for movies, sports, and OTT content. The display quality and optimized panel tuning provide a premium home-viewing experience."
        : "This smartphone is designed to deliver smooth scrolling, vivid visuals, and responsive touch performance for daily use. Optimized hardware and software integration ensure consistent speed and stability.";

    var overviewTitle2 = isLaptop ? "Fast Multitasking And Storage" : isTv ? "Smart Features And Easy Connectivity" : "Strong Camera And Battery Output";
    var overviewPara2 = isLaptop
      ? "With fast storage and capable memory, the system supports multitasking across multiple apps with ease. From document editing to media consumption, performance remains efficient and dependable."
      : isTv
        ? "Smart interface, quick app launch, and multiple connectivity ports make this TV practical for modern setups. You can switch between console, set-top box, and streaming apps without hassle."
        : "Advanced camera processing captures detailed shots in different lighting conditions, while battery optimization keeps the phone active for long sessions. Fast charging support helps reduce downtime.";

    return {
      family: family,
      category: category,
      brand: brand,
      breadcrumbLeaf: breadcrumbLeaf,
      rams: rams,
      modelSeries: title.split("(")[0].trim().slice(0, 30),
      modelNumber: modelNumber,
      colors: defaultColors,
      storages: storages,
      keyFeatures: keyFeatures,
      overviewTitle1: overviewTitle1,
      overviewPara1: overviewPara1,
      overviewTitle2: overviewTitle2,
      overviewPara2: overviewPara2
    };
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el && value !== undefined && value !== null) {
      el.textContent = value;
    }
  }

  function setImg(selector, src, alt) {
    var el = document.querySelector(selector);
    if (el) {
      el.setAttribute("src", src);
      el.setAttribute("alt", alt);
    }
  }

  var params = new URLSearchParams(window.location.search);
  var payload = {};
  try {
    payload = JSON.parse(sessionStorage.getItem("voltixSelectedProduct") || "{}");
  } catch (err) {
    payload = {};
  }

  var product = {
    title: payload.title || params.get("title") || "",
    price: payload.price || params.get("price") || "",
    img: payload.img || params.get("img") || "",
    mrp: payload.mrp || params.get("mrp") || "",
    offer: payload.offer || params.get("offer") || "",
    rating: payload.rating || ""
  };

  if (product.title && product.price && product.img) {
    var amount = parseAmount(product.price);
    var emi = amount ? formatInr(amount / 21.25).replace(".00", "") + "/mo*" : "";
    var profile = inferProfile(product);
    var mrpAmount = parseAmount(product.mrp);
    var offText = product.offer || (mrpAmount > amount && amount > 0 ? Math.round(((mrpAmount - amount) / mrpAmount) * 100) + "% off" : "");

    document.title = product.title + " | Voltix";
    setText(".pdp-title-row h1", product.title);
    setText(".pdp-price", formatInr(amount || parseAmount(product.price)));
    setText(".pdp-emi", emi || "₹7,056/mo*");
    setText(".pdp-combo-item p", product.title);
    setText(".pdp-combo-item strong", formatInr(amount || parseAmount(product.price)));
    setText(".pdp-sticky-product p", product.title);
    setText(".pdp-sticky-product strong", formatInr(amount || parseAmount(product.price)));

    var breadcrumbLinks = document.querySelectorAll(".pdp-breadcrumb a");
    if (breadcrumbLinks[0]) {
      breadcrumbLinks[0].textContent = profile.family;
    }
    if (breadcrumbLinks[1]) {
      breadcrumbLinks[1].textContent = profile.category;
    }
    if (breadcrumbLinks[2]) {
      breadcrumbLinks[2].textContent = profile.breadcrumbLeaf || profile.brand;
    }

    var optionLists = document.querySelectorAll(".pdp-option-group .pdp-option-list");
    var colorButtons = optionLists[0];
    if (colorButtons) {
      colorButtons.innerHTML = profile.colors
        .map(function (c, i) {
          return '<button type="button"' + (i === 1 ? ' class="is-active"' : "") + ">" + c + "</button>";
        })
        .join("");
    }
    var ramButtons = optionLists[1];
    if (ramButtons && profile.rams) {
      ramButtons.innerHTML = profile.rams
        .map(function (r, i) {
          return '<button type="button"' + (i === 0 ? ' class="is-active"' : "") + ">" + r + "</button>";
        })
        .join("");
    }
    var storageButtons = optionLists[2];
    if (storageButtons) {
      storageButtons.innerHTML = profile.storages
        .map(function (s, i) {
          return '<button type="button"' + (i === 1 ? ' class="is-active"' : "") + ">" + s + "</button>";
        })
        .join("");
    }

    var keyFeaturesList = document.querySelector(".pdp-features-list");
    if (keyFeaturesList) {
      keyFeaturesList.innerHTML = profile.keyFeatures
        .map(function (f) {
          var idx = f.indexOf(":");
          if (idx !== -1) {
            return (
              "<li><strong>" +
              f.slice(0, idx + 1) +
              "</strong> " +
              f.slice(idx + 1).trim() +
              "</li>"
            );
          }
          return "<li>" + f + "</li>";
        })
        .join("");
    }

    var overviewH4 = document.querySelectorAll(".pdp-overview h4");
    var overviewP = document.querySelectorAll(".pdp-overview p");
    if (overviewH4[0]) {
      overviewH4[0].textContent = profile.overviewTitle1;
    }
    if (overviewP[0]) {
      overviewP[0].textContent = profile.overviewPara1;
    }
    if (overviewH4[1]) {
      overviewH4[1].textContent = profile.overviewTitle2;
    }
    if (overviewP[1]) {
      overviewP[1].textContent = profile.overviewPara2;
    }

    var specRows = document.querySelectorAll(".pdp-spec-block .pdp-spec-row strong");
    if (specRows[0]) {
      specRows[0].textContent = profile.category === "Mobile Phones" ? "Android Smartphone" : profile.category;
    }
    if (specRows[1]) {
      specRows[1].textContent = profile.category === "Mobile Phones" ? "Touch" : "Standard";
    }
    if (specRows[2]) {
      specRows[2].textContent = profile.brand;
    }
    if (specRows[3]) {
      specRows[3].textContent = profile.modelSeries;
    }
    if (specRows[4]) {
      specRows[4].textContent = profile.modelNumber;
    }

    var mrpValueEl = document.querySelector(".pdp-mrp-value");
    var saveLineEl = document.querySelector(".pdp-save-line");
    if (mrpValueEl && product.mrp && mrpAmount > 0) {
      mrpValueEl.textContent = formatInr(mrpAmount);
    }
    if (saveLineEl && mrpAmount > amount && amount > 0) {
      var saveAmt = mrpAmount - amount;
      var pct = ((saveAmt / mrpAmount) * 100).toFixed(2);
      saveLineEl.textContent =
        "(Save " + formatInr(saveAmt).replace(".00", "") + ", " + pct + "% off)";
    }

    setText(".pdp-review-box h4", "Review " + profile.modelSeries);
    setText(".pdp-review-box p", "Share your experience for " + profile.brand + " " + profile.category.toLowerCase());

    setImg(".pdp-main-image img", product.img, product.title);
    setImg(".pdp-thumb.is-active img", product.img, product.title + " thumbnail");
    setImg(".pdp-thumb:last-of-type img", product.img, product.title + " thumbnail");
    setImg(".pdp-combo-item img", product.img, product.title);
    setImg(".pdp-sticky-product img", product.img, product.title);
  }

  initAccordions();
  initOptionSelectors();
})();
