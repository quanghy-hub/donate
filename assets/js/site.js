(function () {
  const config = window.DONATE_CONFIG || {};
  const page = document.body.dataset.page || "home";
  const params = new URLSearchParams(window.location.search);
  const source = params.get("source") === "extension" ? "extension" : "";
  const products = Array.isArray(config.products) ? config.products.filter(Boolean) : [];
  const wallets = Array.isArray(config.wallets) ? config.wallets.filter(Boolean) : [];
  const selectedProduct = products.find((product) => product.id === params.get("product")) || products[0] || null;

  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  const show = (id, shouldShow) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.hidden = !shouldShow;
  };

  const createSiteUrl = (path, options) => {
    const url = new URL(path || "/", window.location.origin);
    if (source) {
      url.searchParams.set("source", source);
    }
    if (options && options.product) {
      url.searchParams.set("product", options.product);
    }
    if (options && options.hash) {
      url.hash = options.hash;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const formatSuggestedAmount = (product) => {
    if (!product || typeof product.suggestedAmountUsd !== "number") {
      return "Suggested: flexible";
    }
    return `Suggested: ~$${product.suggestedAmountUsd} USD`;
  };

  const copyText = async (value) => {
    if (!value) return false;
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const fallback = document.createElement("textarea");
    fallback.value = value;
    fallback.setAttribute("readonly", "readonly");
    fallback.style.position = "absolute";
    fallback.style.left = "-9999px";
    document.body.appendChild(fallback);
    fallback.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(fallback);
    return successful;
  };

  const renderQr = (mountNode, value) => {
    mountNode.textContent = "";
    if (!value) {
      mountNode.textContent = "QR unavailable";
      return;
    }

    if (typeof window.QRCode === "function") {
      new window.QRCode(mountNode, {
        text: value,
        width: 168,
        height: 168,
        colorDark: "#08111f",
        colorLight: "#f8f4ec",
        correctLevel: window.QRCode.CorrectLevel.M
      });
      return;
    }

    const fallback = document.createElement("p");
    fallback.textContent = "QR library not loaded";
    mountNode.appendChild(fallback);
  };

  const renderProducts = () => {
    const grid = document.getElementById("product-grid");
    const picker = document.getElementById("product-picker");
    const isEmpty = products.length === 0;
    show("products-empty", isEmpty);

    if (grid) {
      grid.textContent = "";
      if (isEmpty) return;

      const fragment = document.createDocumentFragment();
      products.forEach((product) => {
        const card = document.createElement("article");
        card.className = `product-card${selectedProduct && selectedProduct.id === product.id ? " is-selected" : ""}`;
        card.innerHTML = `
          <span class="product-meta">${product.kind || "product"}</span>
          <h3>${product.label || product.id}</h3>
          <p>${product.note || "One payment for a premium unlock flow."}</p>
          <div class="product-price">
            <strong>$${typeof product.suggestedAmountUsd === "number" ? product.suggestedAmountUsd : "--"}</strong>
            <span>${product.id}</span>
          </div>
          <ul>
            <li>Product slug: <code>${product.id}</code></li>
            <li>Extension deep-link ready</li>
            <li>No auto unlock yet</li>
          </ul>
        `;

        const action = document.createElement("a");
        action.className = `product-link${selectedProduct && selectedProduct.id === product.id ? " is-active" : ""}`;
        action.href = createSiteUrl(config.unlockUrlPath || "/unlock/", { product: product.id });
        action.textContent = "Open payment page";
        card.appendChild(action);
        fragment.appendChild(card);
      });
      grid.appendChild(fragment);
    }

    if (picker) {
      picker.textContent = "";
      if (isEmpty) return;

      const fragment = document.createDocumentFragment();
      products.forEach((product) => {
        const link = document.createElement("a");
        link.className = `product-chip${selectedProduct && selectedProduct.id === product.id ? " is-active" : ""}`;
        link.href = createSiteUrl(config.unlockUrlPath || "/unlock/", { product: product.id });
        link.textContent = `${product.label || product.id} · $${typeof product.suggestedAmountUsd === "number" ? product.suggestedAmountUsd : "--"}`;
        fragment.appendChild(link);
      });
      picker.appendChild(fragment);
    }
  };

  const renderWallets = () => {
    const walletGrid = document.getElementById("wallet-grid");
    const isEmpty = wallets.length === 0;
    show("wallets-empty", isEmpty);
    if (!walletGrid) return;

    walletGrid.textContent = "";
    if (isEmpty) return;

    const fragment = document.createDocumentFragment();
    wallets.forEach((wallet) => {
      if (!wallet || !wallet.address) {
        return;
      }

      const card = document.createElement("article");
      card.className = "wallet-card";
      card.innerHTML = `
        <div class="wallet-card-header">
          <div class="wallet-token">
            <h3>${wallet.token || "Crypto"}</h3>
            <span class="wallet-network">${wallet.network || "Network"}</span>
          </div>
          ${wallet.featured ? '<span class="wallet-featured">Recommended</span>' : ""}
        </div>
        <p class="wallet-meta">
          <span>Product: ${selectedProduct ? selectedProduct.label : "Support"}</span>
          <span>${formatSuggestedAmount(selectedProduct)}</span>
        </p>
        <div class="wallet-qr" aria-label="QR code"></div>
        <code class="wallet-address">${wallet.address}</code>
        <p class="wallet-warning">${wallet.warning || "Check the token and network before sending."}</p>
        <div class="wallet-card-footer">
          <div class="wallet-meta">
            <span>Wallet ID: ${wallet.id || "wallet"}</span>
            <span>${source ? "Source: extension" : "Source: direct"}</span>
          </div>
          <button class="wallet-copy" type="button">Copy address</button>
        </div>
      `;

      const qrMount = card.querySelector(".wallet-qr");
      renderQr(qrMount, wallet.qrValue || wallet.address);

      const copyButton = card.querySelector(".wallet-copy");
      copyButton.addEventListener("click", async () => {
        const originalText = copyButton.textContent;
        try {
          await copyText(wallet.address);
          copyButton.textContent = "Copied";
          copyButton.classList.add("is-copied");
        } catch (error) {
          console.error("Copy failed", error);
          copyButton.textContent = "Copy failed";
        } finally {
          window.setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.classList.remove("is-copied");
          }, 1400);
        }
      });

      fragment.appendChild(card);
    });

    walletGrid.appendChild(fragment);
  };

  const renderContracts = () => {
    const homeContract = createSiteUrl(config.supportUrlPath || "/", {});
    const unlockContract = createSiteUrl(config.unlockUrlPath || "/unlock/", {
      product: selectedProduct ? selectedProduct.id : (products[0] && products[0].id) || "premium-lifetime"
    });

    setText("extension-contract-home", homeContract);
    setText("extension-contract-unlock", unlockContract);
  };

  const renderHomeCopy = () => {
    if (source === "extension") {
      show("source-badge", true);
      setText("hero-title", "Opened from the extension.");
      setText("hero-text", "This page supports extension deep-links with source=extension and optional product selection.");
    }
  };

  const renderUnlockCopy = () => {
    if (source === "extension") {
      show("source-badge", true);
      setText("unlock-title", "Opened on the correct unlock page.");
      setText("unlock-intro", "This is a payment page only. Real unlock logic should stay on the backend.");
    }

    setText("selected-product-name", selectedProduct ? selectedProduct.label : "No product");
    setText("selected-product-note", selectedProduct ? (selectedProduct.note || "Current offer.") : "Product not found in config.");
    setText("selected-product-amount", formatSuggestedAmount(selectedProduct));
  };

  const wireDynamicLinks = () => {
    document.querySelectorAll("[data-link='support']").forEach((link) => {
      const hash = link.getAttribute("data-hash");
      link.setAttribute("href", createSiteUrl(config.supportUrlPath || "/", { hash }));
    });

    document.querySelectorAll("[data-link='unlock']").forEach((link) => {
      const productId = link.hasAttribute("data-product-link") ? (selectedProduct ? selectedProduct.id : (products[0] && products[0].id)) : undefined;
      link.setAttribute("href", createSiteUrl(config.unlockUrlPath || "/unlock/", { product: productId }));
    });
  };

  wireDynamicLinks();
  renderContracts();
  renderProducts();
  renderWallets();

  if (page === "home") {
    document.title = config.siteTitle || document.title;
    renderHomeCopy();
  }

  if (page === "unlock") {
    document.title = `${selectedProduct ? selectedProduct.label : "Unlock Premium"} · ${config.siteTitle || "Premium"}`;
    renderUnlockCopy();
  }
}());
