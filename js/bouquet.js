/* ============================================
   BOUQUET — Romantic wrapped rose bouquet
   DOM construction & animation orchestration
   ============================================ */

const BouquetDisplay = (() => {
  let container;
  let bouquetEl;
  let built = false;
  let swayTimer = null;

  /* === Colour Variants === */
  const BQ_COLORS = [
    { outer: '#c91844', mid: '#e04565', inner: '#fcc5d0', glow: 'rgba(201,24,68,0.2)' },
    { outer: '#d42c4f', mid: '#e85775', inner: '#fdd0d8', glow: 'rgba(212,44,79,0.18)' },
    { outer: '#e0455a', mid: '#f06878', inner: '#fde0e5', glow: 'rgba(224,69,90,0.16)' },
    { outer: '#d84870', mid: '#f07898', inner: '#fce8ed', glow: 'rgba(216,72,112,0.18)' },
    { outer: '#c73a5e', mid: '#e86a88', inner: '#fcd8e0', glow: 'rgba(199,58,94,0.18)' },
    { outer: '#e88098', mid: '#f4a0b0', inner: '#fff0f2', glow: 'rgba(232,128,152,0.16)' },
  ];

  /* === Rose Positions (% within cluster) === */
  const ROSE_LAYOUT = [
    { x: 50, y: 14, size: 42 },   // Hero rose — top center, largest
    { x: 27, y: 32, size: 36 },   // Upper left
    { x: 73, y: 30, size: 37 },   // Upper right
    { x: 14, y: 52, size: 30 },   // Far left
    { x: 86, y: 50, size: 31 },   // Far right
    { x: 40, y: 50, size: 34 },   // Center left
    { x: 60, y: 48, size: 33 },   // Center right
  ];

  /* === Leaf Positions === */
  const LEAF_LAYOUT = [
    { x: 5,  y: 38, w: 30, h: 14, angle: -28, mirror: false },
    { x: 95, y: 36, w: 28, h: 13, angle: 25,  mirror: true },
    { x: 18, y: 65, w: 24, h: 11, angle: -38, mirror: false },
    { x: 82, y: 62, w: 25, h: 11, angle: 32,  mirror: true },
    { x: 50, y: 62, w: 20, h: 10, angle: -8,  mirror: false },
    { x: 33, y: 18, w: 22, h: 10, angle: -22, mirror: false },
    { x: 68, y: 16, w: 20, h: 9,  angle: 18,  mirror: true },
  ];

  /* === Baby's Breath Positions === */
  const FILLER_LAYOUT = [
    { x: 18, y: 18, size: 5 },
    { x: 82, y: 16, size: 4 },
    { x: 38, y: 8,  size: 5 },
    { x: 62, y: 10, size: 4 },
    { x: 8,  y: 44, size: 6 },
    { x: 92, y: 46, size: 5 },
    { x: 48, y: 4,  size: 4 },
    { x: 55, y: 68, size: 5 },
    { x: 25, y: 58, size: 4 },
    { x: 75, y: 56, size: 3 },
  ];

  /* === Helpers === */
  function el(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

  /* === Build Bouquet DOM === */
  function build() {
    bouquetEl = el('div', 'bouquet');

    // --- Ambient glow ---
    bouquetEl.appendChild(el('div', 'bouquet__glow'));

    // --- Wrapping paper ---
    const wrap = el('div', 'bouquet__wrap');
    wrap.appendChild(el('div', 'bouquet__fold bouquet__fold--left'));
    wrap.appendChild(el('div', 'bouquet__fold bouquet__fold--right'));
    bouquetEl.appendChild(wrap);

    // --- Tissue paper ---
    bouquetEl.appendChild(el('div', 'bouquet__tissue bouquet__tissue--1'));
    bouquetEl.appendChild(el('div', 'bouquet__tissue bouquet__tissue--2'));
    bouquetEl.appendChild(el('div', 'bouquet__tissue bouquet__tissue--3'));

    // --- Rose cluster container ---
    const cluster = el('div', 'bouquet__cluster');

    // Baby's breath (behind roses)
    FILLER_LAYOUT.forEach((f, i) => {
      const dot = el('div', 'bouquet__filler');
      dot.style.cssText = `
        --bf-size: ${f.size}px;
        left: ${f.x}%;
        top: ${f.y}%;
        transition-delay: ${0.8 + i * 0.08}s;
      `;
      cluster.appendChild(dot);
    });

    // Leaves (behind roses, on top of filler)
    LEAF_LAYOUT.forEach((l, i) => {
      const leaf = el('div', 'bouquet__leaf' + (l.mirror ? ' bouquet__leaf--mirror' : ''));
      leaf.style.cssText = `
        --bl-w: ${l.w}px;
        --bl-h: ${l.h}px;
        --bl-angle: ${l.angle}deg;
        left: ${l.x}%;
        top: ${l.y}%;
        transition-delay: ${0.5 + i * 0.1}s;
      `;
      cluster.appendChild(leaf);
    });

    // Roses (on top)
    ROSE_LAYOUT.forEach((r, i) => {
      const color = BQ_COLORS[i % BQ_COLORS.length];
      const rose = el('div', 'bq-rose');
      rose.style.cssText = `
        --bq-size: ${r.size}px;
        --bq-rot: ${Math.floor(Math.random() * 360)}deg;
        --bq-outer: ${color.outer};
        --bq-mid: ${color.mid};
        --bq-inner: ${color.inner};
        --bq-glow: ${color.glow};
        left: ${r.x}%;
        top: ${r.y}%;
        transition-delay: ${0.4 + i * 0.18}s;
      `;
      cluster.appendChild(rose);
    });

    bouquetEl.appendChild(cluster);

    // --- Ribbon bow ---
    // Ribbon band that goes around the wrap
    const bowWrap = el('div', 'bouquet__bow-wrap');
    // Position the bow where wrapping paper meets flower cluster
    bowWrap.style.cssText = 'top: 42%;';

    bowWrap.appendChild(el('div', 'bouquet__ribbon-band'));
    bowWrap.appendChild(el('div', 'bouquet__bow-loop bouquet__bow-loop--left'));
    bowWrap.appendChild(el('div', 'bouquet__bow-loop bouquet__bow-loop--right'));
    bowWrap.appendChild(el('div', 'bouquet__bow-knot'));
    bowWrap.appendChild(el('div', 'bouquet__bow-tail bouquet__bow-tail--left'));
    bowWrap.appendChild(el('div', 'bouquet__bow-tail bouquet__bow-tail--right'));

    bouquetEl.appendChild(bowWrap);

    container.appendChild(bouquetEl);
    built = true;
  }

  /* === Present Bouquet (rise + bloom) === */
  function present() {
    if (!built) build();

    // Remove retracting state if re-presenting
    bouquetEl.classList.remove('is-retracting', 'is-swaying');

    // Rise from bottom
    requestAnimationFrame(() => {
      bouquetEl.classList.add('is-presented');

      // Bloom roses one by one (staggered via CSS transition-delay)
      setTimeout(() => {
        bouquetEl.querySelectorAll('.bq-rose').forEach(r => {
          r.classList.add('is-bloomed');
        });
      }, 900);

      // Show leaves
      setTimeout(() => {
        bouquetEl.querySelectorAll('.bouquet__leaf').forEach(l => {
          l.classList.add('is-visible');
        });
      }, 700);

      // Show baby's breath
      setTimeout(() => {
        bouquetEl.querySelectorAll('.bouquet__filler').forEach(f => {
          f.classList.add('is-visible');
        });
      }, 1200);

      // Start gentle sway after rising animation completes
      if (swayTimer) clearTimeout(swayTimer);
      swayTimer = setTimeout(() => {
        if (bouquetEl.classList.contains('is-presented')) {
          bouquetEl.classList.add('is-swaying');
        }
      }, 3000);
    });
  }

  /* === Retract Bouquet (descend + close) === */
  function retract() {
    if (!bouquetEl) return;

    if (swayTimer) {
      clearTimeout(swayTimer);
      swayTimer = null;
    }

    // Close roses
    bouquetEl.querySelectorAll('.bq-rose').forEach(r => {
      r.classList.remove('is-bloomed');
    });

    // Hide leaves
    bouquetEl.querySelectorAll('.bouquet__leaf').forEach(l => {
      l.classList.remove('is-visible');
    });

    // Hide baby's breath
    bouquetEl.querySelectorAll('.bouquet__filler').forEach(f => {
      f.classList.remove('is-visible');
    });

    // Descend after a brief close delay
    setTimeout(() => {
      bouquetEl.classList.remove('is-presented', 'is-swaying');
      bouquetEl.classList.add('is-retracting');
    }, 400);
  }

  /* === Init === */
  function init(containerEl) {
    container = containerEl;
  }

  return { init, present, retract };
})();
