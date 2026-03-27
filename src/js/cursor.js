import gsap from 'gsap';

export function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  
  // Custom cursor is active only for non-touch devices
  if (window.innerWidth < 768) {
    if (dot) dot.style.display = 'none';
    if (outline) outline.style.display = 'none';
    return;
  }

  // Mouse position
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  // Lerped cursor position to give it that smooth "trailing" effect
  const pos = {
    dot: { x: mouse.x, y: mouse.y },
    outline: { x: mouse.x, y: mouse.y }
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Animate loop
  const speed = 0.2; // Lerp speed for outline
  
  gsap.ticker.add(() => {
    // Dot follows immediately but smoothly
    pos.dot.x += (mouse.x - pos.dot.x) * 0.8;
    pos.dot.y += (mouse.y - pos.dot.y) * 0.8;
    
    // Outline follows with lag
    pos.outline.x += (mouse.x - pos.outline.x) * speed;
    pos.outline.y += (mouse.y - pos.outline.y) * speed;

    if (dot && outline) {
      dot.style.transform = `translate(${pos.dot.x}px, ${pos.dot.y}px) translate(-50%, -50%)`;
      outline.style.transform = `translate(${pos.outline.x}px, ${pos.outline.y}px) translate(-50%, -50%)`;
    }
  });

  // Hover states for interactions
  const interactables = document.querySelectorAll('a, button, [data-cursor="hover"]');
  interactables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      outline?.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      outline?.classList.remove('hover');
    });
  });
}
