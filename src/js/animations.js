import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initFluid } from './fluid.js';

export function setupAnimations(sceneController, animatedObjects) {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Preloader Animation Matrix
  const tl = gsap.timeline();
  tl.to('.preloader-text', { opacity: 0, duration: 1, delay: 1 })
    .to('.preloader', { yPercent: -100, duration: 1.5, ease: "power4.inOut" })
    .from('.hero-title', { yPercent: 120, duration: 1.8, stagger: 0.1, ease: "power4.out" }, "-=0.8")
    .from('.hero-subtitle', { opacity: 0, y: 30, duration: 1 }, "-=1.2");

  // 2. Infinite Continuous Terrain Flyover
  gsap.ticker.add((time) => {
    if(animatedObjects.terrain) {
      // Instead of shifting the mesh, we shift the mathematical waves across the vertices
      animatedObjects.terrain.updateVertices(time);
    }
    if(animatedObjects.orb) {
      // Gentle pulsing of the sun
      animatedObjects.orb.scale.setScalar(1 + Math.sin(time*2)*0.02);
    }
    if(animatedObjects.particles) {
      animatedObjects.particles.rotation.y = time * 0.05;
    }
  });

  // 3. Deep Cinematic Camera Scroll
  gsap.to(sceneController.camera.position, {
    z: -50, // Fly aggressively forward towards the sun
    y: 10,  // Fly upwards
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: "#smooth-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5 // Buttery smooth scrubbing
    }
  });
  
  // Rotate the camera slightly upward while flying
  gsap.to(sceneController.camera.rotation, {
    x: 0.1,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: "#smooth-wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5
    }
  });

  // 4. Kinetic Typography & Glass Panes reveal
  gsap.utils.toArray('.content-glass').forEach(block => {
    gsap.fromTo(block, 
      { opacity: 0, y: 150, rotateX: -10 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 2,
        scrollTrigger: {
          trigger: block,
          start: "top 85%",
          end: "top 40%",
          scrub: 1
        }
      }
    );
  });

  // 5. Magnetic Button Micro-interaction
  const magBtn = document.querySelector('.mag-btn');
  if(magBtn) {
    magBtn.addEventListener('mousemove', (e) => {
      const rect = magBtn.getBoundingClientRect();
      // Calculate distance from center
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      gsap.to(magBtn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
    });
    magBtn.addEventListener('mouseleave', () => {
      gsap.to(magBtn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
  }
  // 6. Cinematic Ignite & Wake Up Sequences
  const igniteBtn = document.getElementById('ignite-btn');
  const flashOverlay = document.getElementById('flash-overlay');
  const portfolioLoader = document.getElementById('portfolio-loader');
  const portfolioView = document.getElementById('portfolio-view');
  const smoothWrapper = document.getElementById('smooth-wrapper');
  
  const wakeUpBtn = document.getElementById('wake-up-btn');
  const blackoutOverlay = document.getElementById('blackout-overlay');
  const thankyouScreen = document.getElementById('thankyou-screen');

  if(igniteBtn) {
    igniteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const tl = gsap.timeline();
      
      // 1. Orb Explosion (Turn blinding white/red and massive scale)
      if (animatedObjects.orb) {
        tl.to(animatedObjects.orb.material.color, { r: 10, g: 1, b: 1, duration: 0.8 })
          .to(animatedObjects.orb.scale, { x: 50, y: 50, z: 50, duration: 1.5, ease: "power4.in" }, "-=0.5");
      }
      
      // 2. White flash and transition
      tl.to(flashOverlay, { opacity: 1, duration: 0.2, onStart: () => flashOverlay.classList.add('active') }, "-=0.2")
        .to(portfolioLoader, { opacity: 1, duration: 0.5, onStart: () => portfolioLoader.classList.add('active') })
        .add(() => {
          smoothWrapper.style.display = 'none'; // hide old site
          document.getElementById('webgl-canvas').style.display = 'none'; // hide 3D
        })
        .to('.loader-text', { opacity: 0, duration: 0.5, delay: 2 })
        .to(portfolioLoader, { opacity: 0, duration: 0.5, onComplete: () => portfolioLoader.classList.remove('active') })
        .to(portfolioView, { 
          opacity: 1, 
          duration: 1, 
          onStart: () => {
            portfolioView.classList.add('active');
            // Kill Lenis so it stops hijacking scroll events
            if(window.lenisInstance) {
              window.lenisInstance.destroy();
              window.lenisInstance = null;
            }
            portfolioView.style.overflowY = 'auto';
            portfolioView.style.pointerEvents = 'all';
            window.refreshCursor?.();
          }
        })
        .to(flashOverlay, { opacity: 0, duration: 1, onComplete: () => flashOverlay.classList.remove('active') }, "-=1");
    });
  }

  if(wakeUpBtn) {
    wakeUpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const tl = gsap.timeline();
      
      // 1. Instant blackout
      tl.to(blackoutOverlay, { opacity: 1, duration: 0, onStart: () => {
          blackoutOverlay.classList.add('active');
          portfolioView.style.display = 'none';
        }})
        // 2. Initialize the interactive fluid world
        .add(() => initFluid())
        // 3. Open eye (reveal the and 'Wake Up' to the fluid world)
        .add(() => blackoutOverlay.classList.add('eye-open'), "+=1.5")
        // 4. Show thank you text on top of the fluid world
        .to(thankyouScreen, { opacity: 1, duration: 2, delay: 1, onStart: () => thankyouScreen.classList.add('active') })
        // 5. Final cinematic reveal: The eye stays open, allowing interaction
        .add(() => {
          // Change cursor to something interactive or just leave it
          console.log("Fluid world active.");
        }, "+=2");
    });
  }

  // 7. Interactive 3D Project Cards Tilt & Glow
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (centerY - y) / 10;
      const rotateY = (x - centerX) / 10;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: "power2.out"
      });
      
      const glow = card.querySelector('.card-glow');
      if(glow) {
        gsap.to(glow, {
          x: x - centerX,
          y: y - centerY,
          duration: 0.2
        });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

  // Helper to re-init cursor observers for new content
  window.refreshCursor = () => {
    const outline = document.querySelector('.cursor-outline');
    const interactables = document.querySelectorAll('a, button, [data-cursor="hover"], .project-card');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => outline?.classList.add('hover'));
      el.addEventListener('mouseleave', () => outline?.classList.remove('hover'));
    });
  };
}
