const api = (typeof browser !== "undefined") ? browser : chrome;

const statusEl = document.getElementById("status");
const btn = document.getElementById("copyBtn");

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.className = "status" + (isError ? " err" : "");
}

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return await res.blob();
}

btn.addEventListener("click", async () => {
  setStatus("Capturing…");

  let resp;
  try {
    resp = await api.runtime.sendMessage({ type: "CAPTURE_VISIBLE" });
  } catch (e) {
    setStatus("Failed to talk to background: " + String(e), true);
    return;
  }

  if (!resp || !resp.ok) {
    setStatus("Capture failed: " + (resp?.error || "Unknown error"), true);
    return;
  }

  try {
    const blob = await dataUrlToBlob(resp.dataUrl);

    // Clipboard image write (works on modern Firefox, but can vary by version/settings).
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);

    setStatus("Copied ✓");
    // optional: window.close();
  } catch (e) {
    // Fallback: copy the data URL as text (at least something usable)
    try {
      await navigator.clipboard.writeText(resp.dataUrl);
      setStatus("Image copy blocked; copied image as text (data URL).");
    } catch (e2) {
      setStatus("Clipboard failed: " + String(e), true);
    }
  }
});