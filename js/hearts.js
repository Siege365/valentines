/* ============================================
   HEARTS — Floating heart bubbles that rise
   from the bottom with organic sway
   ============================================ */

const FloatingHearts = (() => {
  let container;
  let spawnInterval;
  let isActive = false;

  const HEART_CHARS = ['♥', '♡', '❤', '💕'];
  const HEART_COLORS = [
    '#e85a71',
    '#c9506b',
    '#f0a0b0',
    '#d4a574',
    '#e8b4b8',
    '#f7c5cc',
    '#ff6b81',
  ];

  function init(containerEl) {
    container = containerEl;
  }

  function createHeart() {
    if (!container) return;

    const heart = document.createElement('div');
    heart.className = 'floating-heart';

    const char = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
    const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    const size = Math.random() * 18 + 10;
    const duration = Math.random() * 5 + 5;
    const sway = (Math.random() - 0.5) * 60;
    const opacity = Math.random() * 0.4 + 0.2;
    const left = Math.random() * 100;
    const blur = Math.random() < 0.3 ? Math.random() * 2 + 0.5 : 0;
    const delay = Math.random() * 0.8;

    heart.textContent = char;
    heart.style.cssText = `
      --heart-size: ${size}px;
      --heart-color: ${color};
      --heart-duration: ${duration}s;
      --heart-sway: ${sway}px;
      --heart-opacity: ${opacity};
      --heart-blur: ${blur}px;
      left: ${left}%;
      color: ${color};
      animation-delay: ${delay}s;
    `;

    container.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, (duration + delay) * 1000 + 500);
  }

  function start(intensity = 'normal') {
    if (isActive) return;
    isActive = true;

    const intervals = { gentle: 1800, normal: 1000, intense: 500 };
    const interval = intervals[intensity] || 1000;

    // Initial gentle hearts
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createHeart(), i * 400);
    }

    spawnInterval = setInterval(createHeart, interval);
  }

  function stop() {
    isActive = false;
    clearInterval(spawnInterval);
  }

  function burst(count = 8) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => createHeart(), i * 100);
    }
  }

  return { init, start, stop, burst };
})();
