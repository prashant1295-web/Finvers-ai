/* Handles the "Deploy the Spiders" flow: validates input, plays the
   funny agent status sequence, animates the agent-status grid, then
   sends the user to /results?q=... where the server renders real data. */
(function () {
  const form = document.getElementById("analyze-form");
  const input = document.getElementById("analyze-q");
  const btn = document.getElementById("analyze-btn");
  const errorEl = document.getElementById("analyze-error");
  const panel = document.getElementById("status-panel");
  const linesWrap = document.getElementById("status-lines");
  const statusGrid = document.getElementById("agent-status-grid");

  // Pre-fill from ?q= if the homepage search sent us here.
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) input.value = params.get("q");

  const AGENT_ORDER = ["news", "fundamentals", "market", "risk", "synthesis"];

  function setAgentState(name, state) {
    const card = statusGrid.querySelector(`[data-agent="${name}"]`);
    if (!card) return;
    card.querySelector(".state").textContent = state;
    const dot = card.querySelector(".status-dot");
    dot.classList.toggle("ready", state === "Working" || state === "Done");
    dot.classList.toggle("waiting", state === "Waiting");
  }

  async function runSequence(query) {
    let messages;
    try {
      const res = await fetch("/api/agent-messages");
      messages = await res.json();
    } catch (e) {
      messages = [
        { text: "Connecting to the web...", icon: "🕷️" },
        { text: "The web is complete.", icon: "✅" },
      ];
    }

    linesWrap.innerHTML = "";
    panel.classList.add("is-visible");

    for (let i = 0; i < messages.length; i++) {
      const line = document.createElement("div");
      line.className = "status-line";
      line.innerHTML = `<span class="spinner"></span><span class="check">✅</span><span class="msg">${messages[i].icon} ${messages[i].text}</span>`;
      linesWrap.appendChild(line);

      // Roughly line up agent-grid state with the matching message.
      const agentIdx = i - 1; // messages[0] is the generic "connecting" line
      if (agentIdx >= 0 && agentIdx < AGENT_ORDER.length) {
        setAgentState(AGENT_ORDER[agentIdx], "Working");
      }

      await new Promise((r) => setTimeout(r, i === messages.length - 1 ? 500 : 620));
      line.classList.add("is-done");
      if (agentIdx >= 0 && agentIdx < AGENT_ORDER.length) {
        setAgentState(AGENT_ORDER[agentIdx], "Done");
      }
    }

    await new Promise((r) => setTimeout(r, 300));
    window.location.href = "/results?q=" + encodeURIComponent(query);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) {
      errorEl.classList.add("is-visible");
      input.focus();
      return;
    }
    errorEl.classList.remove("is-visible");
    btn.disabled = true;
    btn.textContent = "Weaving...";
    runSequence(q);
  });
})();
