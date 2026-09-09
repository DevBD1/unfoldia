# Security

Unfoldia is a static educational prototype, not a validated engineering simulator. No credentials or learner data should be added to this repository.

For sensitive findings, use GitHub's private vulnerability reporting if the owner has enabled it, or an established private owner contact. Do not post secrets or exploit details in public issues. Private reporting has not been enabled by this code change.

Progress is untrusted localStorage data, not an identity or authorization boundary. Hostnames have separate storage. New content must not inject user-controlled HTML or executable formulas. External links and third-party assets require provenance review.

The build-output check is a narrow allowlist/local-path/private-key-marker check, not a comprehensive secret scanner. GitHub secret scanning and push protection should be reviewed by the owner. A previously exposed secret must be rotated even if its file is later ignored.

Review dependency alerts and `npm audit` regularly. Do not auto-apply breaking audit fixes. Security headers must be checked on the deployed preview, not inferred from a passing local build.
