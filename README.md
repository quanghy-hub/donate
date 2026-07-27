# Donate / Premium Landing (Ko-fi Single-Screen UI)

Static crypto support and premium landing page with Ko-fi 1-screen UI and Vibe Coding automated workflow tooling.

## Features

- **Ko-fi Style 1-Screen UI**: Centered modern card layout with preset plan tabs, crypto network selector, live QR code, 1-click address copy, and extension deep-link contract info.
- **Vibe Coding Automated Tooling**: Prettier formatting, ESLint v9 linting, Stylelint CSS checking, Makefile commands, and Husky pre-commit hooks.
- **Crypto Support**: Direct peer-to-peer wallet support for TRX (TRON), BNB (BSC), SOL (Solana), and AVAX (Avalanche).

## Vibe Coding Commands

```bash
make install     # Install npm dependencies & setup Git pre-commit hooks
make check       # Run full Linter + Formatter checks
make fix         # Auto-fix linting & formatting issues
make dev         # Launch local dev server at http://localhost:8080
make tunnel      # Create instant public HTTPS URL via Cloudflare Tunnel
make deploy-cf   # Deploy directly to Cloudflare Pages via Wrangler
```

## Cloudflare Setup & Deployment

### Option 1: Temporary Cloudflare Tunnel (For Instant Testing)

Publicly expose your local development server with a temporary HTTPS Cloudflare URL:

```bash
make tunnel
```

### Option 2: Cloudflare Pages Auto-Deploy (Recommended)

1. Push your repository to GitHub (`main` branch).
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Pages**.
3. Select **Connect to Git** and pick repository `quanghy-hub/donate`.
4. Configure Build settings:
   - **Framework preset**: `None`
   - **Build command**: `make check` (or leave blank)
   - **Build output directory**: `.`
5. Click **Save and Deploy**. Cloudflare will automatically build and deploy every `git push`.

### Option 3: Cloudflare Pages CLI Deploy

```bash
make deploy-cf
```

## Extension Contract

Supported query parameters:

- `source=extension`
- `product=<slug>`

Recommended URLs:

```text
GET /?source=extension
GET /unlock/?source=extension&product=premium-lifetime
```
