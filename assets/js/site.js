(function () {
  "use strict";

  const config = window.DONATE_CONFIG || {};
  const params = new URLSearchParams(window.location.search);
  const source = params.get("source") === "extension" ? "extension" : "";
  const products = Array.isArray(config.products) ? config.products.filter(Boolean) : [];
  const wallets = Array.isArray(config.wallets) ? config.wallets.filter(Boolean) : [];
  const page = document.body.dataset.page || "home";

  let activePlanId =
    params.get("product") || (page === "unlock" && products[0] ? products[0].id : "support");
  let activeWalletIndex = 0;

  const getActiveProduct = () => {
    return products.find((p) => p.id === activePlanId) || null;
  };

  const getActiveWallet = () => {
    return wallets[activeWalletIndex] || wallets[0] || null;
  };

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const copyToClipboard = async (text) => {
    if (!text) return false;
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  };

  const renderQrCode = (mountNode, value) => {
    if (!mountNode) return;
    mountNode.textContent = "";

    if (!value) {
      mountNode.textContent = "QR unavailable";
      return;
    }

    if (typeof window.QRCode === "function") {
      new window.QRCode(mountNode, {
        text: value,
        width: 160,
        height: 160,
        colorDark: "#0b1329",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M
      });
    } else {
      const fallback = document.createElement("p");
      fallback.textContent = "QR library pending";
      mountNode.appendChild(fallback);
    }
  };

  const updateHeader = () => {
    if (config.siteTitle) {
      setText("site-title", config.siteTitle);
    }
    const badge = document.getElementById("extension-badge");
    if (badge && source === "extension") {
      badge.hidden = false;
    }
  };

  const updatePlanUI = () => {
    const tabSupport = document.getElementById("tab-support");
    const tabUnlock = document.getElementById("tab-unlock");
    const planDesc = document.getElementById("plan-desc");
    const suggestedPill = document.getElementById("suggested-pill");

    const product = getActiveProduct();

    if (activePlanId === "support" || !product) {
      if (tabSupport) {
        tabSupport.classList.add("is-active");
        tabSupport.setAttribute("aria-selected", "true");
      }
      if (tabUnlock) {
        tabUnlock.classList.remove("is-active");
        tabUnlock.setAttribute("aria-selected", "false");
      }
      if (planDesc) {
        planDesc.textContent = "Send optional crypto support to fuel ongoing development.";
      }
      if (suggestedPill) {
        suggestedPill.textContent = "Suggested: Flexible";
      }
    } else {
      if (tabSupport) {
        tabSupport.classList.remove("is-active");
        tabSupport.setAttribute("aria-selected", "false");
      }
      if (tabUnlock) {
        tabUnlock.classList.add("is-active");
        tabUnlock.setAttribute("aria-selected", "true");
      }
      if (planDesc) {
        planDesc.textContent = product.note || "One-time payment for a future premium unlock flow.";
      }
      if (suggestedPill) {
        suggestedPill.textContent =
          typeof product.suggestedAmountUsd === "number"
            ? `Suggested: ~$${product.suggestedAmountUsd} USD`
            : "Suggested: ~$9 USD";
      }
    }
  };

  const renderNetworkSelector = () => {
    const container = document.getElementById("network-selector");
    if (!container) return;

    container.textContent = "";
    wallets.forEach((wallet, index) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `network-chip${index === activeWalletIndex ? " is-active" : ""}`;
      chip.innerHTML = `
        <span class="network-chip-symbol">${wallet.token || "CRYPTO"}</span>
        <span class="network-chip-name">${wallet.network || "Network"}</span>
      `;
      chip.addEventListener("click", () => {
        activeWalletIndex = index;
        renderNetworkSelector();
        updateWalletDisplay();
      });
      container.appendChild(chip);
    });
  };

  const updateWalletDisplay = () => {
    const wallet = getActiveWallet();
    if (!wallet) return;

    setText("active-token", wallet.token || "CRYPTO");
    setText("active-network", wallet.network || "Network");
    setText("active-address", wallet.address || "No address configured");
    setText("active-warning", wallet.warning || "Send exact token on matching network only.");

    const qrMount = document.getElementById("qr-frame");
    renderQrCode(qrMount, wallet.qrValue || wallet.address);
  };

  const initCopyButton = () => {
    const btn = document.getElementById("copy-btn");
    const btnText = document.getElementById("copy-btn-text");
    if (!btn || !btnText) return;

    btn.addEventListener("click", async () => {
      const wallet = getActiveWallet();
      if (!wallet || !wallet.address) return;

      const originalText = btnText.textContent;
      try {
        await copyToClipboard(wallet.address);
        btnText.textContent = "Copied to Clipboard!";
        btn.classList.add("is-copied");
      } catch {
        btnText.textContent = "Copy Failed";
      } finally {
        setTimeout(() => {
          btnText.textContent = originalText;
          btn.classList.remove("is-copied");
        }, 1600);
      }
    });
  };

  const initPlanTabs = () => {
    const tabSupport = document.getElementById("tab-support");
    const tabUnlock = document.getElementById("tab-unlock");

    if (tabSupport) {
      tabSupport.addEventListener("click", () => {
        activePlanId = "support";
        updatePlanUI();
      });
    }

    if (tabUnlock) {
      tabUnlock.addEventListener("click", () => {
        activePlanId = products[0] ? products[0].id : "premium-lifetime";
        updatePlanUI();
      });
    }
  };

  const initContractDrawer = () => {
    const homePath = `/?source=${source || "extension"}`;
    const unlockPath = `/unlock/?source=${source || "extension"}&product=${products[0] ? products[0].id : "premium-lifetime"}`;
    setText("contract-home", homePath);
    setText("contract-unlock", unlockPath);
  };

  // Initialize page
  updateHeader();
  initPlanTabs();
  renderNetworkSelector();
  updatePlanUI();
  updateWalletDisplay();
  initCopyButton();
  initContractDrawer();
})();
