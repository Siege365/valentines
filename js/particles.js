/* ============================================
   PARTICLES — Canvas-based particle engine
   Fireflies, golden stardust, ambient glow
   ============================================ */

const ParticleEngine = (() => {
  let canvas, ctx;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animId;
  let isRunning = false;

  /* --- Firefly Particle --- */
  class Firefly {
    constructor(w, h) {
      this.reset(w, h, true);
    }

    reset(w, h, initial = false) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.radius = Math.random() * 2.2 + 0.8;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = initial ? 0 : this.baseAlpha;
      this.fadeIn = initial;

      // Organic sine-curve motion
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.sinAmpX = Math.random() * 30 + 10;
      this.sinAmpY = Math.random() * 20 + 8;
      this.sinSpeedX = Math.random() * 0.005 + 0.002;
      this.sinSpeedY = Math.random() * 0.004 + 0.002;
      this.sinOffsetX = Math.random() * Math.PI * 2;
      this.sinOffsetY = Math.random() * Math.PI * 2;
      this.originX = this.x;
      this.originY = this.y;
      this.time = 0;

      // Glow pulse
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.pulseOffset = Math.random() * Math.PI * 2;

      // Color warmth
      const warmth = Math.random();
      if (warmth < 0.4) {
        this.color = { r: 255, g: 215, b: 0 };     // Gold
      } else if (warmth < 0.7) {
        this.color = { r: 255, g: 228, b: 181 };    // Light gold
      } else if (warmth < 0.85) {
        this.color = { r: 232, g: 180, b: 184 };    // Rose gold
      } else {
        this.color = { r: 255, g: 255, b: 240 };    // Warm white
      }
    }

    update(w, h, dt) {
      this.time += dt;

      // Fade in
      if (this.fadeIn) {
        this.alpha += 0.003;
        if (this.alpha >= this.baseAlpha) {
          this.fadeIn = false;
          this.alpha = this.baseAlpha;
        }
      }

      // Organic motion
      this.x = this.originX
        + Math.sin(this.time * this.sinSpeedX + this.sinOffsetX) * this.sinAmpX
        + this.vx * this.time * 0.05;
      this.y = this.originY
        + Math.sin(this.time * this.sinSpeedY + this.sinOffsetY) * this.sinAmpY
        + this.vy * this.time * 0.05;

      // Pulse
      const pulse = Math.sin(this.time * this.pulseSpeed + this.pulseOffset);
      this.currentAlpha = this.alpha * (0.6 + pulse * 0.4);

      // Wrap around
      if (this.x < -20) this.originX += w + 40;
      if (this.x > w + 20) this.originX -= w + 40;
      if (this.y < -20) this.originY += h + 40;
      if (this.y > h + 20) this.originY -= h + 40;
    }

    draw(ctx) {
      if (this.currentAlpha <= 0.01) return;

      const { r, g, b } = this.color;

      // Outer glow
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius * 8
      );
      gradient.addColorStop(0, `rgba(${r},${g},${b},${this.currentAlpha * 0.6})`);
      gradient.addColorStop(0.3, `rgba(${r},${g},${b},${this.currentAlpha * 0.15})`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 8, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.currentAlpha})`;
      ctx.fill();
    }
  }

  /* --- Stardust (tiny drifting motes) --- */
  class Stardust {
    constructor(w, h) {
      this.reset(w, h);
    }

    reset(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.radius = Math.random() * 0.8 + 0.3;
      this.alpha = Math.random() * 0.25 + 0.05;
      this.vy = -(Math.random() * 0.15 + 0.05);
      this.vx = (Math.random() - 0.5) * 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 600 + 300;
    }

    update(w, h, dt) {
      this.life += dt * 0.05;
      this.x += this.vx;
      this.y += this.vy;

      const lifeRatio = this.life / this.maxLife;
      if (lifeRatio > 0.8) {
        this.alpha *= 0.98;
      }

      if (this.life > this.maxLife || this.y < -10 || this.alpha < 0.01) {
        this.reset(w, h);
        this.y = h + 10;
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 248, 240, ${this.alpha})`;
      ctx.fill();
    }
  }

  /* --- Public API --- */
  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  function populate(fireflyCount = 45, stardustCount = 60) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    particles = [];

    for (let i = 0; i < fireflyCount; i++) {
      particles.push(new Firefly(w, h));
    }
    for (let i = 0; i < stardustCount; i++) {
      particles.push(new Stardust(w, h));
    }
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    let lastTime = performance.now();

    function loop(now) {
      if (!isRunning) return;
      const dt = now - lastTime;
      lastTime = now;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.update(w, h, dt);
        p.draw(ctx);
      }

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
  }

  function stop() {
    isRunning = false;
    cancelAnimationFrame(animId);
  }

  return { init, populate, start, stop, mouse };
})();
