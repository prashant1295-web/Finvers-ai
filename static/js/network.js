/* Interactive behaviour for the agent-network SVG diagram used on the
   homepage ("Meet the Web") and the /network page ("Inside the Web"). */
(function () {
  const stage = document.getElementById("network-stage");
  if (!stage) return;

  const tooltip = document.getElementById("network-tooltip");
  const nodes = stage.querySelectorAll(".agent-node");
  const threads = stage.querySelectorAll(".web-thread");

  // Map each node to the thread(s) touching it, by matching data-link tokens.
  function litThreadsFor(nodeName) {
    threads.forEach((t) => {
      const link = t.getAttribute("data-link") || "";
      t.classList.toggle("is-lit", link.split(" ").includes(nodeName));
    });
  }

  function clearThreads() {
    threads.forEach((t) => t.classList.remove("is-lit"));
  }

  function showTooltip(node, evt) {
    const title = node.getAttribute("data-title");
    const desc = node.getAttribute("data-desc");
    tooltip.querySelector("strong").textContent = title;
    tooltip.querySelector("span").textContent = desc;

    const stageRect = stage.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    let left = nodeRect.left - stageRect.left + nodeRect.width / 2 - 105;
    let top = nodeRect.top - stageRect.top - 12;
    left = Math.max(8, Math.min(left, stageRect.width - 238));
    if (top < 0) top = nodeRect.bottom - stageRect.top + 12;

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
    tooltip.classList.add("is-visible");
  }

  function hideTooltip() {
    tooltip.classList.remove("is-visible");
  }

  nodes.forEach((node) => {
    const name = node.getAttribute("data-node");

    node.addEventListener("mouseenter", (e) => {
      node.classList.add("is-active");
      litThreadsFor(name);
      showTooltip(node, e);
    });
    node.addEventListener("mouseleave", () => {
      node.classList.remove("is-active");
      clearThreads();
      hideTooltip();
    });
    node.addEventListener("focus", (e) => {
      node.classList.add("is-active");
      litThreadsFor(name);
      showTooltip(node, e);
    });
    node.addEventListener("blur", () => {
      node.classList.remove("is-active");
      clearThreads();
      hideTooltip();
    });
    node.addEventListener("click", (e) => {
      const isActive = node.classList.contains("is-tapped");
      nodes.forEach((n) => n.classList.remove("is-tapped", "is-active"));
      clearThreads();
      if (!isActive) {
        node.classList.add("is-tapped", "is-active");
        litThreadsFor(name);
        showTooltip(node, e);
      } else {
        hideTooltip();
      }
    });
    node.setAttribute("tabindex", "0");
  });
})();
