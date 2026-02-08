# Reddit Subreddit Renamer — Extension README

This is a simple Chrome/Edge unpacked extension that renames subreddit text on reddit.com using a JSON mapping (`nameMap.json`).

Files you should have in the extension folder:
- `manifest.json` (Manifest V3)
- `content.js` (Content script)
- `nameMap.json` (Subreddit mapping)

Quick install (Chrome / Edge on Windows):
1. Open the Extensions page:
   - Chrome: chrome://extensions
   - Edge: edge://extensions
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this project folder (the folder that contains `manifest.json`).
4. After the extension loads, open reddit.com to test. The content script runs at `document_idle` and will attempt to load `nameMap.json` and perform replacements.

Reloading after changes:
- If you edit `content.js`, `manifest.json`, or `nameMap.json`, go to chrome://extensions and click the **Reload** button for the unpacked extension.

Debugging tips:
- If the console shows `Failed to fetch` when loading `nameMap.json`:
  - Make sure `web_accessible_resources` in `manifest.json` includes `nameMap.json` and matches the pages you're loading (the repo already uses `https://*.reddit.com/*`).
  - Reload the extension in chrome://extensions after making manifest changes.
  - Ensure you loaded the extension via **Load unpacked** instead of opening `manifest.json` directly in the browser (opening the file directly will trigger unrelated PWA warnings).
- To see the runtime URL that the content script is fetching, add a temporary log in `content.js`:
  - console.log(chrome.runtime.getURL('nameMap.json'))
  - Then open the page console (F12 on reddit) and verify that the URL is reachable (it should be a chrome-extension://<extension-id>/nameMap.json URL).
- Check the page console for errors from the extension — open Developer Tools on reddit and look at the Console.
