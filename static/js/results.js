(function () {
  // Animate the circular score ring.
  const panel = document.getElementById("score-panel");
  const fill = document.getElementById("score-fill");
  if (panel && fill) {
    const score = parseFloat(panel.getAttribute("data-score")) || 0;
    const circumference = 2 * Math.PI * 64; // r=64
    const offset = circumference - (score / 10) * circumference;
    requestAnimationFrame(() => {
      setTimeout(() => {
        fill.style.strokeDashoffset = String(offset);
      }, 150);
    });
  }

  // Animate the breakdown bars from the center outward.
  document.querySelectorAll(".bar-fill").forEach((bar) => {
    const value = Math.abs(parseFloat(bar.getAttribute("data-value")) || 0);
    const pct = Math.min(50, value * 28); // scale so bars stay legible
    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.width = pct + "%";
      }, 250);
    });
  });

  // Add-to-watchlist button.
  const wlBtn = document.getElementById("watchlist-btn");
  if (wlBtn && window.SpiderWatchlist) {
    const symbol = wlBtn.getAttribute("data-symbol");
    const refresh = () => {
      const caught = SpiderWatchlist.has(symbol);
      wlBtn.textContent = caught ? "✓ In Your Web" : "+ Catch in Watchlist";
    };
    refresh();
    wlBtn.addEventListener("click", () => {
      if (SpiderWatchlist.has(symbol)) {
        SpiderWatchlist.remove(symbol);
      } else {
        SpiderWatchlist.add({
          symbol,
          name: wlBtn.getAttribute("data-name"),
          score: wlBtn.getAttribute("data-score"),
        });
      }
      refresh();
    });
  }
})();
