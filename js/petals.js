/* ============================================
   PETALS — DOM-based rose petal generator
   Realistic falling with 3D rotation & sway
   ============================================ */

const PetalSystem = (() => {
  let container;
  let spawnInterval;
  let isActive = false;

  const PETAL_COLORS = [
    '#e85a71',   // vibrant rose
    '#d44a5b',   // deep rose
    '#c9506b',   // rose
    '#f0a0b0',   // blush
    '#e8b4b8',   // rose gold
    '#b33a5e',   // wine rose
    '#f7c5cc',   // light pink
    '#d4737d',   // medium rose
  ];

  function init(containerEl) {
    container = containerEl;
  }

  function createPetal() {
    if (!container) return;

    const petal = document.createElement('div');
    petal.className = 'petal';

    const shape = document.createElement('div');
    shape.className = 'petal__shape';
    petal.appendChild(shape);

    // Randomize properties
    const size = Math.random() * 16 + 10;
    const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    const duration = Math.random() * 6 + 6;
    const sway = (Math.random() - 0.5) * 160;
    const rotate = Math.random() * 360;
    const spinDuration = Math.random() * 4 + 3;
    const opacity = Math.random() * 0.4 + 0.4;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.5;

    petal.style.cssText = `
      --petal-size: ${size}px;
      --petal-color: ${color};
      --petal-duration: ${duration}s;
      --petal-sway: ${sway}px;
      --petal-rotate: ${rotate}deg;
      --petal-spin-duration: ${spinDuration}s;
      --petal-opacity: ${opacity};
      left: ${left}%;
      animation-delay: ${delay}s;
    `;

    container.appendChild(petal);

    // Remove after animation completes
    setTimeout(() => {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal);
      }
    }, (duration + delay) * 1000 + 500);
  }

  function start(intensity = 'normal') {
    if (isActive) return;
    isActive = true;

    // Intervals: gentle=1200ms, normal=700ms, intense=350ms
    const intervals = { gentle: 1200, normal: 700, intense: 350 };
    const interval = intervals[intensity] || 700;

    // Initial burst of a few petals
    for (let i = 0; i < 4; i++) {
      setTimeout(() => createPetal(), i * 200);
    }

    spawnInterval = setInterval(createPetal, interval);
  }

  function stop() {
    isActive = false;
    clearInterval(spawnInterval);
  }

  function burst(count = 12) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createPetal(), i * 80);
    }
  }

  return { init, start, stop, burst };
})();
