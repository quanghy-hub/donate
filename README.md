# Donate / Premium Landing

Static crypto support and premium landing page in `D:\Portable\github\donate`.

## Current scope

- No backend
- No auth
- No auto entitlement
- The extension only opens this site
- Premium is modeled as a future one-time unlock

## Files

- `index.html`: home page
- `unlock/index.html`: payment page
- `assets/js/config.js`: public config
- `assets/js/site.js`: rendering, deep-links, QR, copy
- `assets/css/site.css`: styles

QR is rendered with `qrcodejs` from CDNJS at runtime. No build step is required.

## Update wallet data

Edit `assets/js/config.js`:

```js
window.DONATE_CONFIG = {
  siteTitle: "Extension Premium",
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
      address: "YOUR_REAL_ADDRESS",
      qrValue: "YOUR_REAL_ADDRESS",
      warning: "Send USDT on TRC20 only.",
      featured: true
    }
  ]
};
```

Fields to update:

- `supportUrlPath`: home path
- `unlockUrlPath`: unlock path
- `products[]`: premium plans
- `wallets[]`: payment wallets
- `qrValue`: falls back to `address` if missing

## Extension contract

Supported query params:

- `source=extension`
- `product=<slug>`

Recommended URLs:

```text
GET /?source=extension
GET /unlock/?source=extension&product=premium-lifetime
```

Example:

```js
chrome.tabs.create({
  url: "https://your-domain.example/unlock/?source=extension&product=premium-lifetime",
  active: true
});
```

`source=extension` only changes page copy and context.

## Deploy GitHub Pages

### Root site or custom domain

Keep:

- `supportUrlPath: "/"`
- `unlockUrlPath: "/unlock/"`

### Project site

If the URL is `https://<user>.github.io/donate/`, use:

```js
supportUrlPath: "/donate/",
unlockUrlPath: "/donate/unlock/"
```

Then:

1. Push the files in `donate`.
2. Enable GitHub Pages for the correct branch/folder.
3. Open:
   - `https://<user>.github.io/donate/`
   - `https://<user>.github.io/donate/unlock/`

## Validation

- Open the home page directly
- Open home with `?source=extension`
- Open `/unlock/?source=extension&product=premium-lifetime`
- Test copy address
- Test QR render
- Test empty states for missing `wallets` or `products`
- Test narrow viewports

## Current limits

- No on-chain verification
- No tx hash submission flow
- No manual review flow
- No license service
- Do not treat `chrome.storage.local` as real premium proof

## Next upgrades

### Manual unlock

Add:

- tx hash form
- email / Telegram / device code
- small backend for review state

### Auto unlock

Add:

- backend payment verification
- license / entitlement issuing
- endpoint for extension sync
- extension UI for trial / paid / expired / revoked
