# RKN Suite · live update feed (rkn-updates)

This repository publishes the signed update file that the **To be noted** tab in RKN Suite downloads.
Only files signed with RKN's private key are accepted by the tool, so nobody can push fake updates — not even with a copied link.

## One-time setup (about 10 minutes)
1. Create a free GitHub account (github.com/signup). A separate account such as `rknassociates` is ideal.
2. Create a **public** repository named exactly `rkn-updates`.
3. Upload every file and folder in this kit (keep the `.github/workflows` folder).
4. Repository **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `FEED_KEY`
   - Value: the full contents of `FEED_KEY.pem` (from the separate *private* folder — never upload the file itself).
5. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
6. **Actions** tab → *Publish signed feed* → **Run workflow**. In ~1 minute the feed is live at
   `https://<your-username>.github.io/rkn-updates/feed.json`
7. In RKN Suite open **To be noted → Update source (admin)**, type your GitHub username and tap **Save & check**.
   (Send your username to Claude so it can be built into the next release, so CPs never have to type it.)

## How weekly updates work
- Every Monday a scheduled Claude task checks official sources (DLD, RTA, Dubai Media Office, K-RERA, developer stock-exchange filings and press releases) and drafts new items for `items.json`, each with a source link.
- **Approval = publishing.** You review the draft; once it is merged / committed to `main`, the GitHub Action validates it, signs it and publishes it. CPs see it the next time the tool is online.
- Nothing is published without your approval.

## Editing by hand
Add an object to the top of `items.json`:
```json
{"id":"2026-10-12-emaar-new-launch","date":"2026-10-12","cat":"launch","impact":"positive",
 "title":"Short headline","body":"Two or three factual sentences.","area":"Dubai Creek Harbour",
 "project":"Exact project name as shown in the tool (optional)",
 "source":{"name":"Emaar press release","url":"https://..."}}
```
`cat` is one of: price, launch, handover, metro, infra, law, market, rkn. `impact`: positive, neutral or caution.

Price / handover / payment-plan corrections for Dubai projects go in `patches.json`:
```json
{"dxb":{"emaar|Montiva":{"price":1950000,"ho":"Q4 2029","plan":"80/20","date":"2026-10-12","src":"https://..."}}}
```
The key is `developerKey|Project name` exactly as in the tool (developer keys: emaar, binghatti, damac, sobha, azizi, danube, samana, ellington, nakheel, meraas).
The workflow refuses to publish items without an https source link.

## Security
- `FEED_KEY.pem` is the signing key. Keep it private and backed up. If it leaks, ask for a new key pair and a new app release.
- The tool only downloads `feed.json`; it never sends anything about the CP or their clients.
