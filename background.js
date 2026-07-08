let lastCapture = null;

// Toolbar badges don't exist in Firefox for Android's menu-based UI,
// and a rejected promise here must never break the capture flow.
function flashBadge(text, tabId) {
  const action = browser.browserAction;
  if (!action || typeof action.setBadgeText !== "function") return;
  try {
    Promise.resolve(action.setBadgeText({ text, tabId })).catch(() => {});
    setTimeout(() => {
      Promise.resolve(action.setBadgeText({ text: "", tabId })).catch(() => {});
    }, 1200);
  } catch (e) {
    // Badge APIs unavailable on this platform — feedback is optional.
  }
}

async function copyImageToClipboard(blob) {
  if (
    typeof ClipboardItem === "undefined" ||
    !navigator.clipboard ||
    typeof navigator.clipboard.write !== "function"
  ) {
    throw new Error("Image clipboard is not available on this platform");
  }
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

browser.browserAction.onClicked.addListener(async (tab) => {
  try {
    // No windowId argument: capture the current window. The windows API is
    // limited on Firefox for Android, and the click always comes from the
    // active window anyway.
    const dataUrl = await browser.tabs.captureVisibleTab({ format: "png" });
    const blob = await (await fetch(dataUrl)).blob();

    try {
      await copyImageToClipboard(blob);
      flashBadge("✓", tab.id);
    } catch (clipboardError) {
      // Fallback (mainly Firefox for Android, where writing images to the
      // clipboard from a background page can fail): show the capture in a
      // tab where the user can copy, save, or share it.
      console.warn("Clipboard write failed, opening preview:", clipboardError);
      lastCapture = dataUrl;
      await browser.tabs.create({ url: browser.runtime.getURL("preview.html") });
    }
  } catch (e) {
    console.error(e);
    flashBadge("!", tab.id);
  }
});

browser.runtime.onMessage.addListener((message) => {
  if (message && message.type === "get-capture") {
    return Promise.resolve(lastCapture);
  }
});
