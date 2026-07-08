const img = document.getElementById("shot");
const copyBtn = document.getElementById("copy");
const hint = document.getElementById("hint");

async function load() {
  const dataUrl = await browser.runtime.sendMessage({ type: "get-capture" });
  if (!dataUrl) {
    hint.textContent = "No screenshot available. Capture one first, then reopen this page.";
    copyBtn.disabled = true;
    img.hidden = true;
    return;
  }
  img.src = dataUrl;
}

copyBtn.addEventListener("click", async () => {
  // Retried here because a user-gesture clipboard write in a focused page
  // can succeed where the background-page write failed.
  try {
    const blob = await (await fetch(img.src)).blob();
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    copyBtn.textContent = "Copied ✓";
  } catch (e) {
    console.error(e);
    copyBtn.textContent = "Copy not supported — long-press the image instead";
    copyBtn.disabled = true;
  }
});

load();
