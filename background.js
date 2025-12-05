// Rickroll link patterns to block
const rickrollPatterns = [
  "*://www.youtube.com/watch?v=dQw4w9WgXcQ*",
  "*://youtu.be/dQw4w9WgXcQ*"
];

// Add block rules on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3, 4, 5],
    addRules: rickrollPatterns.map((pattern, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "block"
      },
      condition: {
        urlFilter: pattern,
        resourceTypes: ["main_frame", "sub_frame"]
      }
    }))
  });
});


function calculateSafetyScore(url) {
  let score = 100;
  const lower = url.toLowerCase();

  const keywords = ["login", "verify", "update", "secure", "account", "bank", "refund", "password"];
  if (keywords.some(k => lower.includes(k))) score -= 15;

  const brandWords = ["amazon", "paytm", "paypal", "facebook", "instagram"];
  const officialDomains = ["amazon.in", "paytm.com", "paypal.com", "facebook.com", "instagram.com"];

  if (brandWords.some(b => lower.includes(b)) &&
     !officialDomains.some(d => lower.includes(d))) score -= 25;

  if (/\d+\.\d+\.\d+\.\d+/.test(url)) score -= 30;

  if (!url.startsWith("https://")) score -= 15;

  const shorteners = ["bit.ly", "tinyurl.com", "cutt.ly", "t.co", "rb.gy"];
  if (shorteners.some(s => lower.includes(s))) score -= 10;

  if (url.length > 80) score -= 10;

  return Math.max(score, 1);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {

    const score = calculateSafetyScore(tab.url);

    chrome.tabs.sendMessage(tabId, {
      type: "score",
      url: tab.url,
      score
    }).catch(err => console.log("Message not sent:", err));
  }
});

