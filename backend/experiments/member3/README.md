# Member 3 integration notes

- Pandey's wholesale calculator and its boundary tests are preserved here as experiments.
- The production checkout continues to use the existing Product.wholesalePrice and Product.wholesaleQty fields and server-side price calculation in Member 1's order controller.
- Pandey's sample calculator uses a different quantity/discount table. Example: a ₹500 product at quantity 10 does not receive the 10% discount promised in the hackathon brief. It is therefore not wired into checkout until the team agrees one pricing policy.
- The original OpenSearch test scripts used `rejectUnauthorized: false` and synthetic IDs such as P101. Those scripts are not imported into production. The integrated service uses actual PostgreSQL product IDs and TLS certificate validation.