/* Ambient neural/spider-web canvas background.
   A field of drifting nodes connected by thin threads when close enough —
   reads as a digital neural network, not a literal web. */
(function () {
  const canvas = document.getElementById("web-bg");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, dpr;
  let nodes = [];
  const LINK_DIST = 150;
  const COLORS = ["124,92,255", "0,229,199"];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = Math.max(window.innerHeight, document.body.scrollHeight * 0.4);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function initNodes() {
    const density = Math.min(70, Math.floor((width * height) / 22000));
    nodes = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.4 + 0.6,
      c: COLORS[Math.random() > 0.7 ? 1 : 0],
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.16;
          ctx.strokeStyle = `rgba(${a.c},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.c},0.75)`;
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  step();
})();
