export function initFluid() {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;

  const isMobile = window.innerWidth < 768;
  const particles = [];
  const particleCount = isMobile ? 60 : 120;
  const mouse = { x: -100, y: -100, active: false };
  const connLimitSq = 150 * 150;
  const mouseDistSq = 300 * 300;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.init();
    }

    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 2 + 1;
      this.color = `rgba(255, 42, 95, ${Math.random() * 0.5 + 0.2})`; // Neon pink sparks
      this.history = [];
      this.maxHistory = 15;
    }

    update() {
      // Mouse interaction
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouseDistSq) {
          const force = (300 - Math.sqrt(distSq)) / 3000;
          this.vx += dx * force;
          this.vy += dy * force;
        }
      }

      // Friction
      this.vx *= 0.98;
      this.vy *= 0.98;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around
      if (this.x < -10) this.x = width + 10;
      if (this.x > width + 10) this.x = -10;
      if (this.y < -10) this.y = height + 10;
      if (this.y > height + 10) this.y = -10;

      // History for trails
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > this.maxHistory) this.history.shift();
    }

    draw() {
      if (this.history.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(this.history[0].x, this.history[0].y);
      for (let i = 1; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  function animate() {
    // Semi-transparent redraw for trail persistence look if desired
    // Or clear and draw history trails
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections (Fluid look)
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      for (let j = i + 1; j < len; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dSq = dx * dx + dy * dy;

        if (dSq < connLimitSq) {
          ctx.beginPath();
          const dist = Math.sqrt(dSq);
          ctx.strokeStyle = `rgba(12, 209, 169, ${(150 - dist) / 1000})`; // Mint green connections
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}
