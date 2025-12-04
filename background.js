const rickrollPatterns = [
  "*://www.youtube.com/watch?v=dQw4w9WgXcQ*",
  "*://youtu.be/dQw4w9WgXcQ*"
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3],
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

// Show notification when rule blocks something
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon.png",
    title: "⚠ Suspicious Link Blocked!",
    message: "Rickroll attempt detected and blocked 😎"
  });
});
