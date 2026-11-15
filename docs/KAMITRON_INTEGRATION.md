# Kamitron inside Ogun Forge

Ogun Forge remains the main application, design system, navigation shell, course, XP store and manufacturing workspace. Kamitron's default-branch content was migrated from commit `20d75d055f5f124e33f445ae877daca0d8dde626`.

## Content and route map

| Source | Integrated destination |
| --- | --- |
| Kamitron landing page | `/kamitron` |
| Five living technology departments | `/kamitron#labs` |
| Spectrum Forge | `/kamitron` |
| Inner Kingdom and four characters | `/kamitron#series` |
| Conscious AI & Security / Hidden Builders tracks | `/kamitron#academy` |
| Historical engineering archive | `/kamitron#builders` |
| Hive waitlist | `/kamitron#join` |
| 35 specimens, seven labs, rank ladder, membership plans | `/vault` |
| Public studio preview and local GLB test tool | `/vault#owner` |
| AI consulting, training, automation, immersive development | `/services` |
| Vision, values, journey, skills | `/about` |
| Community features, events, benefits | `/community` |
| Contact channels, service-prefilled inquiry form | `/contact` |

Legacy `.html` URLs for the five secondary pages redirect to their extensionless routes while preserving query strings and anchors. Existing Ogun Forge URLs and persisted progress remain intact. New specimens and pages are included in global search. Saved specimens share the Forge's saved-project list. Academy rank reflects existing Forge XP; planned submission rewards do not award XP from browsing.

## Content maintenance

The five `src/content/kamitron/*.html` files are **reviewed static content**, rendered within the React shell with delegated SPA links and forms. Original global styles, scripts, event attributes and decorative elements were removed. Styling lives in the scoped `src/styles/kamitron.css`; do not inject user-generated HTML here. Update these files directly when changing copy.

All specimen metadata is in `src/content/kamitron/labs.json`. The five procedural 3D archetypes are preserved in `src/components/kamitron/specimenModels.js`, now using the existing installed Three.js rather than CDN scripts. The viewer handles cleanup, device fallback, reduced motion, model loading and local-only self-contained GLB previews. Add exported `.glb` files to `public/models/`, then map exact specimen names in `MODELS` in `src/content/kamitron/index.ts`. No final GLB assets existed in the source repository. `#owner` is a public preview convenience, not authentication.

## Email setup

`api/contact.js` is a Vercel ESM serverless function (converted from the source's CommonJS to match this repository). Contact and waitlist requests use `/api/contact` and Resend. Set these in the **Ogun Forge Vercel project**, then redeploy:

- `RESEND_API_KEY`
- `CONTACT_TO`
- `CONTACT_FROM` (a sender on a verified Resend domain)

These are deployment secrets and must not be committed. Environment variables from the separate Kamitron project are not copied automatically. Missing configuration returns 503 with the existing direct-email fallback; failures never display a success message. Local Vite serves the frontend only; use Vercel development or a deployment to exercise the actual function.

Membership purchases, community accounts, events and build submissions remain planned features as labeled in the original source. This integration does not invent a billing backend or unlock secret content.

## Validation

- `pnpm build`: TypeScript and production bundle
- `pnpm smoke`: existing routes plus all imported pages and 35 specimen URLs
- `pnpm test:manufacturing`: manufacturing behavior regression checks
- `pnpm test:kamitron`: specimen geometry/isolation plus contact validation, email escaping, provider failures and missing configuration
