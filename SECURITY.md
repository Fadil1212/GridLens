# Security

Never commit EIA keys, GitHub tokens, `.env`, `.dev.vars`, service access tokens or local Worker state. The app uses a hosted server secret and does not transmit that key to the browser.

The existing Sites demo uses owner-only access; Vercel deployment access must be configured separately. Public publication permits anyone to trigger bounded API work and therefore needs traffic monitoring and rate-limit review. Production rate limiting is not implemented in this repository.

If you find a vulnerability, use GitHub's private vulnerability reporting feature if the repository owner has enabled it. Do not publish secrets or exploit details in a public issue. The owner should configure a private reporting contact before enabling external use.
