(function () {
  window.DONATE_CONFIG = {
    siteTitle: "Extension Premium",
    siteBasePath: "/donate",
    supportUrlPath: "/",
    unlockUrlPath: "/unlock/",
    products: [
      {
        id: "premium-lifetime",
        label: "Premium Lifetime",
        kind: "one_time_unlock",
        suggestedAmountUsd: 9,
        note: "One payment for a future lifetime unlock flow."
      }
    ],
    wallets: [
      {
        id: "usdt-trc20",
        token: "USDT",
        network: "TRC20",
        address: "PLACEHOLDER_TRC20_ADDRESS",
        qrValue: "PLACEHOLDER_TRC20_ADDRESS",
        warning: "Send USDT on TRON only. Wrong network is not refundable.",
        featured: true
      },
      {
        id: "usdt-bep20",
        token: "USDT",
        network: "BEP20",
        address: "PLACEHOLDER_BEP20_ADDRESS",
        qrValue: "PLACEHOLDER_BEP20_ADDRESS",
        warning: "Send USDT on BNB Smart Chain only. Do not use ERC20.",
        featured: false
      }
    ]
  };
}());
