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
        id: "trx-tron",
        token: "TRX",
        network: "TRON",
        address: "TSt83Ji1AgdhWTAPy2aK619t64BW6bDF7B",
        qrValue: "TSt83Ji1AgdhWTAPy2aK619t64BW6bDF7B",
        warning: "Send TRX on TRON only. Wrong network or token is not refundable.",
        featured: true
      },
      {
        id: "bnb-bsc",
        token: "BNB",
        network: "BNB Smart Chain",
        address: "0x73DbCD8B08E1d018CaF65baaec9264f75A573c3a",
        qrValue: "0x73DbCD8B08E1d018CaF65baaec9264f75A573c3a",
        warning: "Send BNB on BNB Smart Chain only. Do not use Ethereum or other EVM networks.",
        featured: false
      },
      {
        id: "sol-solana",
        token: "SOL",
        network: "Solana",
        address: "4xfoXNnLigaDXtxpiyXKm9AuERU1NhtSKSC7dKehabtp",
        qrValue: "4xfoXNnLigaDXtxpiyXKm9AuERU1NhtSKSC7dKehabtp",
        warning: "Send SOL on Solana only. SPL assets on the wrong network are not recoverable.",
        featured: false
      },
      {
        id: "avax-avalanche",
        token: "AVAX",
        network: "Avalanche C-Chain",
        address: "0x73DbCD8B08E1d018CaF65baaec9264f75A573c3a",
        qrValue: "0x73DbCD8B08E1d018CaF65baaec9264f75A573c3a",
        warning: "Send AVAX on Avalanche C-Chain only. Do not use BNB Smart Chain or Ethereum.",
        featured: false
      }
    ]
  };
}());
