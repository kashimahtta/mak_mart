# Mak Mart

Similar to Blinkit (2026 style) as a minimal toddler-mode demo — no extra decoration.

# Mak Mart — Toddler Mode Demo

Simple static demo showing a toddler-mode switch between Girls (pink) and Boys (blue). Features:

- Toggle between modes (pink/blue)
- Card grid showing items with name, price and availability
- Search box that filters local items
- Optional: integrate Google Custom Search JSON API by supplying `API Key` and `CSE ID`

How to run:

1. Open [index.html](index.html) in a browser.
2. Click the switch or the side buttons to toggle modes.
3. Use search to filter items. To search Google results, paste your Google API Key and CSE ID into the inputs and run a query.

Notes:

- The Google Custom Search API requires an API key and a configured Custom Search Engine (CSE ID). If not provided, the UI filters local demo data.
- This is a minimal demo; extend item objects with images/pricing from your backend or a real shopping API.

Local images:

- You can add local images to `assets/images/` using the normalized item name rule: `assets/images/<item-name>.png` or `.jpg`.
- Example: for `Lipstick` add `assets/images/lipstick.png`. The app tries `.png` then `.jpg`, then falls back to an automatic Unsplash image.
