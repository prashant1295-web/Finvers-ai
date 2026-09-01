(function () {
  const container = document.getElementById("watchlist-content");
  if (!container || !window.SpiderWatchlist) return;

  function render() {
    const items = SpiderWatchlist.all();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state glass">
          <span class="glyph">🕷️</span>
          <p>Nothing caught in the web yet. Add a company.</p>
          <a href="/analyze" class="btn btn-primary">+ Catch Another One</a>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="watchlist-grid">${items
      .map(
        (item) => `
      <div class="wl-card glass">
        <div class="wl-top">
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <span class="sym">${escapeHtml(item.symbol)}</span>
          </div>
          <button class="remove" data-symbol="${escapeHtml(item.symbol)}" aria-label="Remove ${escapeHtml(item.name)} from watchlist">✕</button>
        </div>
        <div class="score">${escapeHtml(String(item.score))}</div>
        <a class="view" href="/results?q=${encodeURIComponent(item.name)}">View report →</a>
      </div>`
      )
      .join("")}</div>`;

    container.querySelectorAll(".remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        SpiderWatchlist.remove(btn.getAttribute("data-symbol"));
        render();
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  render();
})();
