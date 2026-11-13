# FB Quick Block

A Chrome extension (Manifest V3) that adds a 🚫 button beside the "…" menu on Facebook posts. One click runs the report-and-block flow for you.

## What the click does

It opens the post's actions menu, then works through these steps in order:

1. Report post (also matches photo, video, reel, link and ad)
2. Scam, fraud or false information
3. Sharing false information
4. Submit or Next, if Facebook shows one (optional)
5. Block [Name]'s profile, or Block [Page]
6. Confirm or Block, if a confirmation dialog appears (optional)
7. Done or Close, if shown (optional)

The button shows ⏳ while it runs, ✅ when it finishes and ❌ if it stops. On failure it also shows an alert saying which step it couldn't find, and logs the error to the console with the prefix `[FB Quick Block]`.

## Install

1. Put `content.js` and `manifest.json` in a folder.
2. Open `chrome://extensions` and turn on Developer mode.
3. Click Load unpacked and pick the folder.
4. Reload Facebook.

The extension only runs on `https://www.facebook.com/*` and asks for no extra permissions. After editing `content.js`, hit the reload icon on the extension's card and refresh the Facebook tab.

## How it finds things

- The button is added to any element with `role="button"` and an `aria-label` starting "Actions for this post". The poster's name is taken from that label for the tooltip.
- Each menu step is found by matching visible text in a `span[dir="auto"]`, checking the newest dialogs and menus first. Each step waits up to 5 seconds, with a short pause after each click.
- The patterns live in `quickBlock()` in `content.js`.

## Caveats

- **It will break sometimes.** Facebook changes its menu wording and structure often, so expect to adjust the text patterns now and then. They only match English labels, and the "Actions for this post" label is English too.
- **It reports as "Sharing false information".** That is the route the code takes, and it is a false report whenever the post isn't actually false information. Facebook takes reports into account, so only use the button when that's fair. Changing the patterns to the Spam route would be a code change, and I haven't checked whether it has fewer steps.
- **Keep it one click per block.** Automating bulk blocking in the background could go against Facebook's automation rules and get your account flagged. Clicking the button yourself is the intended use, but I can't promise it is risk free.
- **Untested against current pages.** This is a starting point. I haven't run it against Facebook's current pages. Check the exact labels on your account in DevTools before relying on it.
