const sleep = ms => new Promise(r => setTimeout(r, ms));

const isVisible = el => !!(el.offsetParent || el.getClientRects().length);

// Find a visible span whose text matches, searching newest dialogs/menus first
function findText(re) {
  const roots = [...document.querySelectorAll('[role="dialog"],[role="menu"]')].reverse();
  roots.push(document);
  for (const root of roots) {
    const hit = [...root.querySelectorAll('span[dir="auto"]')]
      .find(s => isVisible(s) && re.test(s.textContent.trim()));
    if (hit) return hit;
  }
  return null;
}

async function waitFor(re, timeout = 5000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const el = findText(re);
    if (el) return el;
    await sleep(150);
  }
  return null;
}

async function step(re, { optional = false, timeout } = {}) {
  const el = await waitFor(re, timeout);
  if (!el) {
    if (optional) return false;
    throw new Error(`Couldn't find "${re.source}"`);
  }
  el.click();
  await sleep(600);
  return true;
}

async function quickBlock(menuBtn) {
  menuBtn.click();
  await step(/^Report (post|photo|video|reel|link|ad)$/i);
  await step(/^Scam, fraud or false information$/);
  await step(/^Sharing false information$/);
  // Optional "Submit"/"Next" in case FB adds a step before the block option
  await step(/^(Submit|Next)$/, { optional: true, timeout: 1500 });
  await step(/^Block .+/);                       // "Block Jack's profile" / "Block <Page>"
  // Confirmation dialog, if one appears
  await step(/^(Confirm|Block)$/, { optional: true, timeout: 2500 });
  await step(/^(Done|Close)$/, { optional: true, timeout: 2500 });
}

function addButtons() {
  document.querySelectorAll('[role="button"][aria-label^="Actions for this post"]:not([data-qb])')
    .forEach(menuBtn => {
      menuBtn.dataset.qb = '1';
      const who = menuBtn.getAttribute('aria-label').replace(/^Actions for this post( by )?/, '') || 'this poster';

      const b = document.createElement('button');
      b.textContent = '🚫';
      b.title = `Report & block ${who}`;
      b.style.cssText = 'margin-right:6px;cursor:pointer;border:none;background:none;font-size:18px;align-self:center';
      b.onclick = async e => {
        e.preventDefault();
        e.stopPropagation();
        b.textContent = '⏳';
        try {
          await quickBlock(menuBtn);
          b.textContent = '✅';
        } catch (err) {
          b.textContent = '❌';
          console.warn('[FB Quick Block]', err);
          alert('Quick block stopped: ' + err.message);
        }
      };

      // Insert beside the wrapper <div> so it sits in the flex row next to "…"
      const wrapper = menuBtn.parentElement;
      wrapper.parentElement.insertBefore(b, wrapper);
    });
}

new MutationObserver(addButtons).observe(document.body, { childList: true, subtree: true });
addButtons();