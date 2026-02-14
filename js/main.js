/* ============================================
   MAIN — Scene timeline orchestrator
   Click-to-open envelope, close & reopen,
   flower garden integration
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Element References ─── */
  const scene       = document.getElementById('scene');
  const canvas      = document.getElementById('particleCanvas');
  const petalsBox   = document.getElementById('petalsContainer');
  const heartsBox   = document.getElementById('heartsContainer');
  const cursorBox   = document.getElementById('cursorTrail');
  const gardenBox   = document.getElementById('gardenContainer');
  const bouquetBox  = document.getElementById('bouquetLayer');
  const waxSeal     = document.getElementById('waxSeal');
  const letterTitle = document.getElementById('letterTitle');
  const letterMsg   = document.getElementById('letterMessage');
  const divider     = document.getElementById('letterDivider');
  const footer      = document.getElementById('letterFooter');
  const signature   = document.getElementById('letterSignature');
  const closeBtn    = document.getElementById('letterClose');

  /* ─── State ─── */
  let isOpen = false;           // envelope open state
  let isAnimating = false;      // prevent double-clicks
  let typewriterDone = false;   // track if text has been typed at least once
  let heartsStarted = false;

  /* ─── Initialize Modules ─── */
  ParticleEngine.init(canvas);
  PetalSystem.init(petalsBox);
  FloatingHearts.init(heartsBox);
  CursorTrail.init(cursorBox);
  FlowerGarden.init(gardenBox);
  BouquetDisplay.init(bouquetBox);

  /* ─── Seal Burst Effect ─── */
  function burstSeal() {
    if (!waxSeal) return;
    const rect = waxSeal.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Gold sparkle particles
    for (let i = 0; i < 22; i++) {
      const angle = (Math.PI * 2 / 22) * i + (Math.random() - 0.5) * 0.4;
      const dist = Math.random() * 90 + 40;
      const size = Math.random() * 5 + 3;

      const particle = document.createElement('div');
      particle.className = 'seal-particle';
      particle.style.cssText = `
        --sp-size: ${size}px;
        --sp-x: ${Math.cos(angle) * dist}px;
        --sp-y: ${Math.sin(angle) * dist}px;
        left: ${cx}px;
        top: ${cy}px;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1200);
    }

    // Wax fragments
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 70 + 25;
      const size = Math.random() * 7 + 4;
      const rot = Math.random() * 360;

      const frag = document.createElement('div');
      frag.className = 'wax-fragment';
      frag.style.cssText = `
        --wf-size: ${size}px;
        --wf-x: ${Math.cos(angle) * dist}px;
        --wf-y: ${Math.sin(angle) * dist}px;
        --wf-rot: ${rot}deg;
        left: ${cx}px;
        top: ${cy}px;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(frag);
      setTimeout(() => frag.remove(), 1000);
    }
  }

  /* ═══════════════════════════════════════════
     OPEN ENVELOPE
     ═══════════════════════════════════════════ */
  function openEnvelope() {
    if (isOpen || isAnimating) return;
    isAnimating = true;
    isOpen = true;

    // 1. Burst the seal
    scene.classList.add('act-seal-break');
    burstSeal();
    PetalSystem.burst(10);

    // 2. Open flap (after quick delay for seal break feel)
    setTimeout(() => {
      scene.classList.add('act-open');
    }, 600);

    // 3. Grow the flower garden from the edges
    setTimeout(() => {
      FlowerGarden.grow();
    }, 1000);

    // 4. Petal burst from the opening
    setTimeout(() => {
      PetalSystem.burst(15);
    }, 1200);

    // 5. Letter rises
    setTimeout(() => {
      scene.classList.add('act-letter');
    }, 2000);

    // 6. Show close button
    setTimeout(() => {
      if (closeBtn) closeBtn.classList.add('is-visible');
    }, 3000);

    // 7. Typewriter / text content
    setTimeout(async () => {
      isAnimating = false;

      if (!typewriterDone) {
        // First open: type everything character by character
        await Typewriter.type(letterTitle, 'Happy Valentine\'s Day', {
          speed: 80,
          variance: 25,
        });
        letterTitle.classList.add('is-complete');

        setTimeout(() => {
          if (divider) divider.classList.add('is-visible');
        }, 400);

        setTimeout(async () => {
          await Typewriter.type(letterMsg, 'Will you be my valentines, my sweet baby girl?', {
            speed: 60,
            variance: 20,
          });
          letterMsg.classList.add('is-complete');

          setTimeout(() => {
            if (footer) footer.classList.add('is-visible');
          }, 500);

          setTimeout(async () => {
            if (signature) {
              signature.classList.add('is-visible');
              await Typewriter.type(signature, '\u2014 Forever & always yours', {
                speed: 55,
                variance: 15,
              });
            }
          }, 1000);

          // Start floating hearts on first completion
          if (!heartsStarted) {
            heartsStarted = true;
            setTimeout(() => {
              FloatingHearts.start('gentle');
            }, 600);
          }

          // Boost petals
          PetalSystem.stop();
          PetalSystem.start('normal');

          // Present the bouquet as the final gift
          BouquetDisplay.present();

          typewriterDone = true;
        }, 1600);

      } else {
        // Re-open: show text instantly (already typed before)
        letterTitle.textContent = 'Happy Valentine\'s Day';
        letterTitle.classList.add('is-complete');

        setTimeout(() => {
          if (divider) divider.classList.add('is-visible');
        }, 200);

        setTimeout(() => {
          letterMsg.textContent = 'Will you be my valentines, my sweet baby girl?';
          letterMsg.classList.add('is-complete');
        }, 400);

        setTimeout(() => {
          if (footer) footer.classList.add('is-visible');
        }, 600);

        setTimeout(() => {
          if (signature) {
            signature.textContent = '\u2014 Forever & always yours';
            signature.classList.add('is-visible');
          }
        }, 800);

        // Re-present bouquet on reopen
        setTimeout(() => {
          BouquetDisplay.present();
        }, 800);

        // Resume hearts if not already running
        if (!heartsStarted) {
          heartsStarted = true;
          FloatingHearts.start('gentle');
        }

        PetalSystem.stop();
        PetalSystem.start('normal');
      }
    }, 3200);
  }

  /* ═══════════════════════════════════════════
     CLOSE ENVELOPE  (reset for replay)
     ═══════════════════════════════════════════ */
  function closeEnvelope() {
    if (!isOpen || isAnimating) return;
    isAnimating = true;
    isOpen = false;

    // 1. Hide close button
    if (closeBtn) closeBtn.classList.remove('is-visible');

    // 2. Hide letter content signals
    if (footer) footer.classList.remove('is-visible');
    if (signature) signature.classList.remove('is-visible');
    if (divider) divider.classList.remove('is-visible');
    letterTitle.classList.remove('is-complete');
    letterMsg.classList.remove('is-complete');

    // 3. Retract flowers & bouquet
    FlowerGarden.retract();
    BouquetDisplay.retract();

    // 4. Letter descends
    setTimeout(() => {
      scene.classList.remove('act-letter');
    }, 400);

    // 5. Close flap
    setTimeout(() => {
      scene.classList.remove('act-open');
    }, 1200);

    // 6. Restore seal
    setTimeout(() => {
      scene.classList.remove('act-seal-break');
      waxSeal.classList.add('is-restored');

      // After restore animation, clean up the class
      setTimeout(() => {
        waxSeal.classList.remove('is-restored');
      }, 1600);
    }, 1800);

    // 7. Slow petals back to gentle
    setTimeout(() => {
      PetalSystem.stop();
      PetalSystem.start('gentle');
    }, 1000);

    // 8. Stop floating hearts
    FloatingHearts.stop();
    heartsStarted = false;

    // 9. Done
    setTimeout(() => {
      isAnimating = false;
    }, 2800);
  }

  /* ─── Click Handlers ─── */
  // Clicking the wax seal opens the envelope
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });

    // Touch support
    waxSeal.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEnvelope();
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEnvelope();
    });

    closeBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEnvelope();
    });
  }

  /* ═══════════════════════════════════════════
     INTRO TIMELINE (automatic)
     Only the ambient and envelope arrival
     are automated — opening is manual
     ═══════════════════════════════════════════ */
  const introTimeline = [
    // 0.0s — Canvas particles start
    {
      time: 0,
      action: () => {
        ParticleEngine.populate(40, 50);
        ParticleEngine.start();
        CursorTrail.start();
      }
    },

    // 1.5s — Cinema bars retract, bg reveals
    {
      time: 1500,
      action: () => {
        scene.classList.add('act-reveal');
      }
    },

    // 3.0s — Gentle petals begin
    {
      time: 3000,
      action: () => {
        PetalSystem.start('gentle');
      }
    },

    // 4.5s — Envelope slides into view
    {
      time: 4500,
      action: () => {
        scene.classList.add('act-envelope');
      }
    },
  ];

  /* ─── Execute Intro ─── */
  introTimeline.forEach(({ time, action }) => {
    setTimeout(action, time);
  });
});
