# Krishang Naikar - Portfolio

A Minecraft-themed personal portfolio, built as a Next.js app. The layout, GUI and code structure are adapted from the public repo https://github.com/ghaiaarav/portfolio; all content here is Krishang's.

## Run it

```powershell
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests
npm run build    # static export to ./out
```

## Editing content

| What | Where |
|---|---|
| Projects (Singleplayer worlds), experience (Multiplayer servers), skills, honors, stats, side quests | `content/portfolio.json` |
| Splash texts | `content/portfolio.json` -> `splashTexts[]` |
| Contact links (email, LinkedIn, phone are left blank on purpose) | `content/portfolio.json` -> `contact` |
| Resume button on the title screen | `content/portfolio.json` -> `resume.url` (currently GitHub; drop a PDF in `public/` and point this at it) |
| Photos screen and Secret Room | `components/options/GalleryScreen.tsx`, `components/easter-eggs/SecretRoomScreen.tsx` (placeholder art now) |
| Title logo | `python scripts/generate_minecraft_logo.py` (edit the two words in the script) |
| Canonical site URL | `lib/site.ts` |
| Social preview image | add `app/opengraph-image.png` |
| Minecraft skin | `public/skins/steve.png` |

## Deploying to Cloudflare Pages

This is a static export (`output: "export"`). In the Cloudflare Pages project settings use:

| Setting | Value |
|---|---|
| Framework preset | None (or Next.js static export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Environment variable | `NODE_VERSION` = `22` (a `.node-version` file also sets this) |

`public/recruiter.html` is served at `/recruiter.html`.
