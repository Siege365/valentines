/* ============================================
   CURSOR — Sparkle trail following mouse,
   leaving golden stardust behind
   ============================================ */

const CursorTrail = (() => {
  let trailContainer;
  let isActive = false;
  let lastX = 0, lastY = 0;
  let throttleTimer = null;

  // Custom cursor dot
  let cursorDot;

  function init(containerEl) {
    trailContainer = containerEl;

    // Create custom cursor dot
    cursorDot = document.createElement('div');
    cursorDot.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--gold-bright), var(--gold));
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px var(--gold-bright), 0 0 20px rgba(255,215,0,0.3);
      transition: width 0.2s, height 0.2s;
      opacity: 0;
    `;
    document.body.appendChild(cursorDot);
  }

  function onMouseMove(e) {
    const x = e.clientX;
    const y = e.clientY;

    // Update custom cursor
    cursorDot.style.left = x + 'px';
    cursorDot.style.top = y + 'px';
    cursorDot.style.opacity = '1';

    // Distance check — only spawn if moved enough
    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 8) return;

    lastX = x;
    lastY = y;

    // Spawn sparkle
    spawnSparkle(x, y);

    // Occasionally spawn a cross sparkle
    if (Math.random() < 0.25) {
      setTimeout(() => {
        spawnSparkle(
          x + (Math.random() - 0.5) * 16,
          y + (Math.random() - 0.5) * 16,
          true
        );
      }, 50);
    }
  }

  function spawnSparkle(x, y, isCross = false) {
    if (!trailContainer) return;

    const el = document.createElement('div');
    el.className = isCross ? 'sparkle sparkle--cross' : 'sparkle';

    const size = Math.random() * 4 + 2;
    const life = Math.random() * 0.5 + 0.4;
    const drift = (Math.random() - 0.5) * 30 - 10;

    el.style.cssText = `
      --sparkle-size: ${size}px;
      --sparkle-life: ${life}s;
      --sparkle-drift: ${drift}px;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
    `;

    trailContainer.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, life * 1000 + 100);
  }

  function start() {
    if (isActive) return;
    isActive = true;
    document.addEventListener('mousemove', onMouseMove);
  }

  function stop() {
    isActive = false;
    document.removeEventListener('mousemove', onMouseMove);
    if (cursorDot) cursorDot.style.opacity = '0';
  }

  return { init, start, stop };
})();
