chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "score") {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.bottom = "20px";
    overlay.style.right = "20px";
    overlay.style.padding = "15px 20px";
    overlay.style.color = "#fff";
    overlay.style.borderRadius = "12px";
    overlay.style.fontSize = "18px";
    overlay.style.fontFamily = "Arial";
    overlay.style.zIndex = 999999;
    overlay.style.boxShadow = "0 0 15px rgba(0,0,0,.3)";

    if (msg.score >= 80) {
      overlay.style.background = "green";
      overlay.innerText = `✔ Safe Link (${msg.score}%)`;
    } else if (msg.score >= 50) {
      overlay.style.background = "orange";
      overlay.innerText = `⚠ Suspicious (${msg.score}%)`;
    } else {
      overlay.style.background = "red";
      overlay.innerText = `❌ Dangerous (${msg.score}%)`;
    }

    document.body.appendChild(overlay);

    setTimeout(() => overlay.remove(), 5000);
  }
});
