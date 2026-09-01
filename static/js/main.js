/* Shared behaviour across all pages: nav toggle + a small Watchlist
   helper backed by localStorage, used by results.html and watchlist.html. */

(function navToggle() {
  const btn = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    })
  );
})();

const SpiderWatchlist = {
  KEY: "Finvers_watchlist",

  all() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  save(list) {
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },

  add(entry) {
    const list = this.all().filter((e) => e.symbol !== entry.symbol);
    list.unshift(entry);
    this.save(list);
  },

  remove(symbol) {
    this.save(this.all().filter((e) => e.symbol !== symbol));
  },

  has(symbol) {
    return this.all().some((e) => e.symbol === symbol);
  },
};

// Hero search box on the homepage — routes to the analyze flow.
(function heroSearch() {
  const form = document.getElementById("hero-search-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = form.querySelector("input").value.trim();
    window.location.href = "/analyze" + (q ? `?q=${encodeURIComponent(q)}` : "");
  });
})();
