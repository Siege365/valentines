/* ============================================
   PROPOSAL — Yes/No dodge logic + celebration
   ============================================ */

const Proposal = (() => {
  let proposalEl, yesBtn, noBtn, celebrationEl;
  let dodgeCount = 0;
  let answered = false;
  let onYesCallback = null;
  let originalParent = null;

  const TAUNT_TEXTS = [
    'No',
    'Really? 🤨',
    'Think again 💕',
    'Nice try 😏',
    'Nope!',
    'Haha 🙈',
    'You sure? 💔',
    '...',
    '🥺',
    'Just say yes!',
  ];

  const CONFETTI_COLORS = [
    '#ffd700', '#ff69b4', '#ff1493', '#ffb6c1',
    '#f0e68c', '#dda0dd', '#ff6b6b', '#e8b4b8',
    '#d4a574', '#ffc0cb', '#ffe4b5', '#c9506b',
  ];

  function init(opts) {
    proposalEl    = opts.proposalEl;
    yesBtn        = opts.yesBtn;
    noBtn         = opts.noBtn;
    celebrationEl = opts.celebrationEl;
    onYesCallback = opts.onYes || null;
    originalParent = proposalEl; // Store original parent for the No button

    // Yes handler
    yesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleYes();
    });
    yesBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleYes();
    });

    // No handler — dodge!
    noBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dodgeNo();
    });
    noBtn.addEventListener('mouseenter', () => {
      if (dodgeCount > 0) dodgeNo(); // After first click, also dodge on hover
    });
  }

  /* ─── Show the buttons ─── */
  function show() {
    if (answered) return;
    dodgeCount = 0;
    noBtn.textContent = 'No';
    noBtn.className = 'proposal__btn proposal__btn--no';
    noBtn.style.cssText = '';
    proposalEl.classList.add('is-visible');
    proposalEl.classList.remove('is-answered');
  }

  /* ─── Hide the buttons ─── */
  function hide() {
    proposalEl.classList.remove('is-visible');
    proposalEl.classList.add('is-answered');
    // Reset the No button and move back to original parent
    noBtn.classList.remove('is-dodging');
    noBtn.style.cssText = '';
    if (noBtn.parentElement !== originalParent) {
      originalParent.appendChild(noBtn);
    }
    dodgeCount = 0;
  }

  /* ─── Reset (for envelope close/reopen) ─── */
  function reset() {
    hide();
    // Don't reset answered — once you say yes, it's permanent 💕
    noBtn.textContent = 'No';
  }

  /* ─── Dodge the No button ─── */
  function dodgeNo() {
    if (answered) return;
    dodgeCount++;

    // On first dodge, move button to body so it escapes the transformed .letter container
    if (dodgeCount === 1) {
      document.body.appendChild(noBtn);
    }

    // Change to fixed positioning so it escapes the letter card
    noBtn.classList.add('is-dodging');

    // Remove old dodge-N classes, add new one
    for (let i = 1; i <= 5; i++) noBtn.classList.remove(`dodge-${i}`);
    if (dodgeCount >= 2 && dodgeCount <= 5) {
      noBtn.classList.add(`dodge-${dodgeCount}`);
    } else if (dodgeCount > 5) {
      noBtn.classList.add('dodge-5');
    }

    // Calculate safe dodge area (viewport minus some padding)
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const btnW = noBtn.offsetWidth || 80;
    const btnH = noBtn.offsetHeight || 36;
    // Larger padding on mobile to keep button in safe tappable area
    const isMobile = vw < 768;
    const pad = isMobile ? Math.max(40, vw * 0.08) : 30;

    // Random position, avoiding the Yes button region
    let newX, newY;
    const yesRect = yesBtn.getBoundingClientRect();
    let attempts = 0;

    do {
      // Keep button well within viewport, especially on mobile
      const safeW = Math.max(100, vw - btnW - pad * 2);
      const safeH = Math.max(100, vh - btnH - pad * 2);
      newX = pad + Math.random() * safeW;
      newY = pad + Math.random() * safeH;
      attempts++;
    } while (
      attempts < 20 &&
      Math.abs(newX - yesRect.left) < 100 &&
      Math.abs(newY - yesRect.top) < 80
    );

    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;

    // Re-trigger shake animation
    noBtn.style.animation = 'none';
    noBtn.offsetHeight; // force reflow
    noBtn.style.animation = '';

    // Taunt text
    const textIdx = Math.min(dodgeCount - 1, TAUNT_TEXTS.length - 1);
    noBtn.textContent = TAUNT_TEXTS[textIdx];
  }

  /* ─── Handle YES ─── */
  function handleYes() {
    if (answered) return;
    answered = true;

    // Hide buttons
    hide();

    // Trigger celebration after a beat
    setTimeout(() => {
      launchCelebration();
    }, 600);

    if (onYesCallback) onYesCallback();
  }

  /* ─── Launch Celebration ─── */
  function launchCelebration() {
    celebrationEl.classList.add('is-active');

    // Confetti cannon
    spawnConfetti(80);

    // Big heart burst
    spawnCelebHearts(12);

    // Sparkle ring around title
    spawnSparks(16);

    // Continuous confetti waves
    setTimeout(() => spawnConfetti(40), 2000);
    setTimeout(() => spawnConfetti(30), 4000);
    setTimeout(() => spawnCelebHearts(6), 3000);
  }

  /* ─── Confetti Generator ─── */
  function spawnConfetti(count) {
    const vw = window.innerWidth;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'celebration__confetti';
      const size = Math.random() * 10 + 5;
      const x = Math.random() * vw;
      const dx = (Math.random() - 0.5) * 200;
      const dur = Math.random() * 2 + 2.5;
      const delay = Math.random() * 1.5;
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const radius = Math.random() > 0.5 ? '50%' : `${Math.random() * 3 + 1}px`;

      piece.style.cssText = `
        --cc-size: ${size}px;
        --cc-color: ${color};
        --cc-dx: ${dx}px;
        --cc-dur: ${dur}s;
        --cc-delay: ${delay}s;
        --cc-radius: ${radius};
        left: ${x}px;
        top: -20px;
      `;
      celebrationEl.appendChild(piece);
      setTimeout(() => piece.remove(), (dur + delay) * 1000 + 500);
    }
  }

  /* ─── Big Celebration Hearts ─── */
  function spawnCelebHearts(count) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hearts = ['💕', '💖', '💗', '💘', '💝', '❤️', '🥰', '😍', '💞'];

    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'celebration__heart';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      const size = Math.random() * 40 + 30;
      const x = Math.random() * (vw - 60) + 30;
      const y = Math.random() * (vh * 0.6) + vh * 0.2;
      const dur = Math.random() * 3 + 3;
      const delay = Math.random() * 2;

      h.style.cssText = `
        --ch-size: ${size}px;
        --ch-dur: ${dur}s;
        --ch-delay: ${delay}s;
        left: ${x}px;
        top: ${y}px;
      `;
      celebrationEl.appendChild(h);
      setTimeout(() => h.remove(), (dur + delay) * 1000 + 500);
    }
  }

  /* ─── Sparkle Ring ─── */
  function spawnSparks(count) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2 - 30;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      spark.className = 'celebration__spark';
      const angle = (Math.PI * 2 / count) * i;
      const dist = Math.random() * 80 + 60;
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist;
      const delay = 0.3 + i * 0.06;

      spark.style.cssText = `
        --cs-x: ${sx}px;
        --cs-y: ${sy}px;
        --cs-delay: ${delay}s;
        left: ${cx}px;
        top: ${cy}px;
      `;
      celebrationEl.appendChild(spark);
      setTimeout(() => spark.remove(), (delay + 1.2) * 1000 + 200);
    }
  }

  /* ─── Check if user already answered ─── */
  function hasAnswered() {
    return answered;
  }

  return { init, show, hide, reset, hasAnswered, launchCelebration };
})();
