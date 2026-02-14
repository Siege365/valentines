/* ============================================
   FLOWERS — Rose garden generator
   Grows stems, unfurls leaves, blooms roses
   petal by petal from the envelope region
   ============================================ */

const FlowerGarden = (() => {
  let container;
  let allElements = []; // track all created DOM nodes for cleanup

  const ROSE_COLORS = [
    { outer: '#d42c4f', inner: '#ef5f78', glow: 'rgba(212,44,79,0.15)' },
    { outer: '#e04565', inner: '#f47a92', glow: 'rgba(224,69,101,0.12)' },
    { outer: '#c73a5e', inner: '#e86a88', glow: 'rgba(199,58,94,0.15)' },
    { outer: '#b8274b', inner: '#d85872', glow: 'rgba(184,39,75,0.12)' },
    { outer: '#f0a0b0', inner: '#fcd0d8', glow: 'rgba(240,160,176,0.15)' },
    { outer: '#e8b4b8', inner: '#f8d8dc', glow: 'rgba(232,180,184,0.12)' },
  ];

  function init(containerEl) {
    container = containerEl;
  }

  /* --- Build a single rose arrangement --- */
  function createRoseArrangement(config) {
    const {
      x,          // % from left
      stemHeight, // px
      bloomSize,  // px
      side,       // 'left' | 'right'
      delayBase,  // ms stagger offset
      colorIdx,
    } = config;

    const color = ROSE_COLORS[colorIdx % ROSE_COLORS.length];
    const flipX = side === 'right' ? -1 : 1;

    // --- Stem ---
    const stem = document.createElement('div');
    stem.className = 'rose-stem';
    stem.style.cssText = `
      left: ${x}%;
      transform: translateX(-50%);
    `;
    container.appendChild(stem);
    allElements.push(stem);

    // Thorns
    const thornCount = Math.floor(stemHeight / 60);
    for (let i = 0; i < thornCount; i++) {
      const thorn = document.createElement('div');
      const isLeft = i % 2 === 0;
      thorn.className = `rose-stem__thorn rose-stem__thorn--${isLeft ? 'left' : 'right'}`;
      thorn.style.bottom = `${30 + i * 55}px`;
      stem.appendChild(thorn);
    }

    // --- Leaves ---
    const leaves = [];
    const leafConfigs = [
      { bottom: '25%', angle: side === 'left' ? -35 : 35, mirror: side === 'right' },
      { bottom: '50%', angle: side === 'left' ? 30 : -30, mirror: side === 'left' },
      { bottom: '70%', angle: side === 'left' ? -25 : 25, mirror: side === 'right' },
    ];

    leafConfigs.forEach((lc, i) => {
      if (stemHeight < 100 && i > 1) return; // skip leaves on short stems
      const leaf = document.createElement('div');
      leaf.className = `rose-leaf${lc.mirror ? ' rose-leaf--mirror' : ''}`;
      leaf.style.cssText = `
        --leaf-angle: ${lc.angle}deg;
        bottom: ${lc.bottom};
        ${lc.mirror ? 'right' : 'left'}: -12px;
      `;
      
      const shape = document.createElement('div');
      shape.className = 'rose-leaf__shape';
      leaf.appendChild(shape);
      
      stem.appendChild(leaf);
      leaves.push(leaf);
    });

    // --- Rose Bloom ---
    const bloom = document.createElement('div');
    bloom.className = 'rose-bloom';
    bloom.style.cssText = `
      --bloom-size: ${bloomSize}px;
      --bloom-glow: ${color.glow};
      left: 50%;
      top: -${bloomSize / 2 - 2}px;
    `;

    // Outer petals (5)
    for (let i = 0; i < 5; i++) {
      const angle = (360 / 5) * i;
      const petal = document.createElement('div');
      petal.className = 'rose-petal';
      petal.style.setProperty('--petal-angle', angle + 'deg');
      
      const petalShape = document.createElement('div');
      petalShape.className = 'rose-petal__shape';
      petalShape.style.setProperty('--petal-color', color.outer);
      petal.appendChild(petalShape);
      bloom.appendChild(petal);
    }

    // Inner petals (3, smaller)
    for (let i = 0; i < 3; i++) {
      const angle = (360 / 3) * i + 30;
      const petal = document.createElement('div');
      petal.className = 'rose-petal rose-petal--inner';
      petal.style.setProperty('--petal-angle', angle + 'deg');
      
      const petalShape = document.createElement('div');
      petalShape.className = 'rose-petal__shape';
      petalShape.style.setProperty('--petal-inner', color.inner);
      petal.appendChild(petalShape);
      bloom.appendChild(petal);
    }

    // Center
    const center = document.createElement('div');
    center.className = 'rose-bloom__center';
    bloom.appendChild(center);

    stem.appendChild(bloom);

    // --- Baby's breath accents ---
    const babyBreathCount = Math.floor(Math.random() * 3) + 1;
    const babys = [];
    for (let i = 0; i < babyBreathCount; i++) {
      const bb = document.createElement('div');
      bb.className = 'babys-breath';
      bb.style.cssText = `
        left: ${x + (Math.random() - 0.5) * 6}%;
        bottom: ${Math.random() * stemHeight * 0.4 + stemHeight * 0.3}px;
      `;
      const dot = document.createElement('div');
      dot.className = 'babys-breath__dot';
      bb.appendChild(dot);
      container.appendChild(bb);
      allElements.push(bb);
      babys.push(bb);
    }

    // --- Vine tendril ---
    let vine = null;
    if (stemHeight > 120 && Math.random() > 0.4) {
      vine = document.createElement('div');
      vine.className = 'vine-tendril';
      vine.style.cssText = `
        left: calc(${x}% + ${flipX * 8}px);
        bottom: ${stemHeight * 0.6}px;
        transform: scale(0) scaleX(${flipX});
      `;
      container.appendChild(vine);
      allElements.push(vine);
    }

    return { stem, leaves, bloom, babys, vine, delayBase };
  }

  /* --- Animate garden growing --- */
  function grow() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw < 600;
    const isShort = vh < 500;

    // Responsive stem heights
    const maxStem = isShort ? vh * 0.3 : (isMobile ? vh * 0.32 : vh * 0.38);
    const minStem = maxStem * 0.4;

    // Responsive bloom sizes
    const maxBloom = isMobile ? 32 : 48;
    const minBloom = isMobile ? 22 : 30;

    // Arrangements — symmetrical pairs on left & right edges
    const arrangements = [];
    const positions = isMobile
      ? [
          // Mobile: fewer, closer to edges
          { x: 6, side: 'left' },
          { x: 14, side: 'left' },
          { x: 86, side: 'right' },
          { x: 94, side: 'right' },
        ]
      : [
          // Desktop: lush garden framing
          { x: 4, side: 'left' },
          { x: 10, side: 'left' },
          { x: 17, side: 'left' },
          { x: 24, side: 'left' },
          { x: 76, side: 'right' },
          { x: 83, side: 'right' },
          { x: 90, side: 'right' },
          { x: 96, side: 'right' },
        ];

    positions.forEach((pos, i) => {
      const stemH = Math.random() * (maxStem - minStem) + minStem;
      const bloomS = Math.random() * (maxBloom - minBloom) + minBloom;

      arrangements.push(createRoseArrangement({
        x: pos.x,
        stemHeight: stemH,
        bloomSize: bloomS,
        side: pos.side,
        delayBase: i * 200,
        colorIdx: i,
      }));
    });

    // Stagger the animation of each arrangement
    arrangements.forEach((arr, i) => {
      const delay = arr.delayBase;

      // Grow stem
      const stemH = Math.random() * (maxStem - minStem) + minStem;
      setTimeout(() => {
        arr.stem.classList.add('is-growing');
        arr.stem.style.height = `${stemH}px`;
      }, delay);

      // Unfurl leaves
      arr.leaves.forEach((leaf, li) => {
        setTimeout(() => {
          leaf.classList.add('is-unfurled');
        }, delay + 800 + li * 300);
      });

      // Bloom rose
      setTimeout(() => {
        arr.bloom.classList.add('is-blooming');
      }, delay + 1200);

      // Baby's breath
      arr.babys.forEach((bb, bi) => {
        setTimeout(() => {
          bb.classList.add('is-visible');
        }, delay + 1600 + bi * 200);
      });

      // Vine
      if (arr.vine) {
        setTimeout(() => {
          arr.vine.classList.add('is-growing');
        }, delay + 1400);
      }
    });

    return arrangements;
  }

  /* --- Retract all flowers --- */
  function retract() {
    // Close all blooms
    container.querySelectorAll('.rose-bloom').forEach(b => {
      b.classList.remove('is-blooming');
      b.classList.add('is-closing');
    });

    // Retract leaves
    container.querySelectorAll('.rose-leaf').forEach(l => {
      l.classList.remove('is-unfurled');
      l.classList.add('is-retracting');
    });

    // Retract stems
    setTimeout(() => {
      container.querySelectorAll('.rose-stem').forEach(s => {
        s.classList.remove('is-growing');
        s.classList.add('is-retracting');
      });
    }, 400);

    // Hide baby's breath + vines
    container.querySelectorAll('.babys-breath').forEach(b => {
      b.classList.remove('is-visible');
    });
    container.querySelectorAll('.vine-tendril').forEach(v => {
      v.classList.remove('is-growing');
    });

    // After retract animation, remove all elements
    setTimeout(() => {
      clear();
    }, 2000);
  }

  /* --- Remove all flower DOM nodes --- */
  function clear() {
    allElements.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    allElements = [];
  }

  return { init, grow, retract, clear };
})();
