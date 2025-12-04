const dangerousTLDs = ["xyz", "top", "click", "support", "rest", "monster", "info"];

// Known Rickroll URLs
const rickrollPatterns = [
  "dQw4w9WgXcQ",
  "rickroll",
  "never-gonna-give-you-up",
  "astley"
];

// Shorteners commonly used to hide URLs
const shorteners = [
  "bit.ly", "tinyurl.com", "t.co", "rb.gy", "rebrand.ly", "goo.gl"
];

// Scoring function
function analyzeUrl(url, anchorText = "") {
  let score = 0;
  const lowerUrl = url.toLowerCase();

  // Rickroll detection
  if (rickrollPatterns.some(pattern => lowerUrl.includes(pattern))) {
    score += 50;
  }

  // Suspicious TLD detection
  const domainParts = lowerUrl.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (dangerousTLDs.includes(tld)) {
    score += 20;
  }

  // Short URL detection
  if (shorteners.some(s => lowerUrl.includes(s))) {
    score += 15;
  }

  // Display text mismatch
  if (anchorText && !anchorText.includes(url.substring(0, 10))) {
    score += 10;
  }

  return score;
}

// Hover highlight
document.addEventListener("mouseover", event => {
  const a = event.target.closest("a");
  if (!a) return;

  const score = analyzeUrl(a.href, a.innerText.trim());
  if (score >= 40) {
    a.style.borderBottom = "3px solid red";
    a.title = "⚠️ Suspicious or Rickroll risk detected!";
  }
});

// Click interception warning
document.addEventListener("click", event => {
  const a = event.target.closest("a");
  if (!a) return;

  const score = analyzeUrl(a.href, a.innerText.trim());

  if (score >= 40) {
    event.preventDefault();
    alert("⚠️ Warning: High-risk link detected!\nScore: " + score + "\nClick blocked for safety.");
  } else if (score >= 20) {
    alert("⚠ Slightly suspicious link detected. Continue carefully.");
  }
});
