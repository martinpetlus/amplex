# Amplex

Amplex web project with integrated tools.

## 📁 Project Structure

```
/
├── apps/
│   └── offer-generator/     # Generátor cenových ponúk PDF
├── public/                  # Static assets (logo, favicon, etc.)
├── src/
│   └── pages/               # Astro pages
└── package.json
```

## 🎯 Available Apps

### Offer Generator (`apps/offer-generator`)

Automatický generátor cenných ponúk PDF v slovenčine pre Amplex.

**Rýchly začiatok:**

```bash
cd apps/offer-generator
npm install
npm run dev
```

**Tri spôsoby použitia:**

1. **Interaktívny režim:** `npm run dev`
2. **Z JSON súboru:** `npm run dev sample-offer.json`
3. **Programaticky:** Pozrite [src/index.js](apps/offer-generator/src/index.js)

Pozrite [apps/offer-generator/QUICKSTART.md](apps/offer-generator/QUICKSTART.md) pre detaily.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command          | Action                                      |
| :--------------- | :------------------------------------------ |
| `pnpm install`   | Installs dependencies                       |
| `pnpm dev`       | Starts local dev server at `localhost:4321` |
| `pnpm build`     | Build your production site to `./dist/`     |
| `pnpm preview`   | Preview your build locally, before deploy   |
| `pnpm astro ...` | Run CLI commands like `astro add`           |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
