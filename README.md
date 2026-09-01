# 🕷️ SpiderSense AI

Connecting the dots. Understanding the market.

A hackathon-ready frontend for a multi-agent financial intelligence platform,
served by a small Flask backend. The backend currently returns **mock data**
shaped exactly like a real multi-agent orchestrator would, so you can swap
`get_company_payload()` in `app.py` for real agent calls later without
touching a single template.

## Run it

```bash
pip install -r requirements.txt
python app.py
```

Then open **spidersense-ai.vercel.app**

## Pages

| Route              | What it is                                              |
|---------------------|----------------------------------------------------------|
| `/`                  | Landing page, hero search, "Meet the Web" diagram        |
| `/analyze`           | Search + funny agent-status loading sequence             |
| `/results?q=...`     | Full score dashboard for a company                        |
| `/network`           | "Inside the Web" — the interactive agent architecture     |
| `/watchlist`         | Saved companies (stored in the browser via `localStorage`)|
| `/about`             | Problem statement + how the system works                  |

## Try these in the search box

`Tata Motors`, `Reliance`, `Infosys` return curated demo data. Anything else
generates a deterministic mock score, so the whole flow works end-to-end for
arbitrary input.

## Where the real backend plugs in

Everything the frontend needs comes from two places in `app.py`:

- `get_company_payload(query)` — returns one company's full analysis
- `/api/agent-messages` — the loading-sequence copy

Replace the body of `get_company_payload` with real calls to your
News / Fundamental / Market / Risk / Synthesis agents and keep the same
return shape — the templates and JS don't need to change.

## Structure

```
app.py                  Flask routes + mock data
templates/               Jinja templates (one per page + shared base/network partial)
static/css/style.css     Full design system
static/js/webbg.js       Ambient canvas web background
static/js/network.js     Interactive agent-network diagram
static/js/analyze.js     Loading sequence + agent status grid
static/js/results.js     Score ring + breakdown bar animations
static/js/watchlist.js   Watchlist rendering (localStorage)
static/js/main.js        Nav toggle + shared watchlist helper
```
