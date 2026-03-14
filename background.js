browser.browserAction.onClicked.addListener(async (tab) => {
  try {
    const dataUrl = await browser.tabs.captureVisibleTab(tab.windowId, { format: "png" });

    const res = await fetch(dataUrl);
    const blob = await res.blob();

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

    // optional: tiny feedback
    browser.browserAction.setBadgeText({ text: "✓", tabId: tab.id });
    setTimeout(() => browser.browserAction.setBadgeText({ text: "", tabId: tab.id }), 1200);
  } catch (e) {
    console.error(e);
    browser.browserAction.setBadgeText({ text: "!", tabId: tab.id });
    setTimeout(() => browser.browserAction.setBadgeText({ text: "", tabId: tab.id }), 1200);
  }
});