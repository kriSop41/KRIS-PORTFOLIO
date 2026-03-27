import './style.css';
import { initScroll } from './js/app.js';
import { initCursor } from './js/cursor.js';
import { SceneController } from './js/three-scene.js';
import { createObjects } from './js/objects.js';
import { setupAnimations } from './js/animations.js';
import gsap from 'gsap';

const startApp = () => {
  console.log("Initializing App...");
  
  // 1. Initialize Smooth Scroll
  const lenis = initScroll();
  window.lenisInstance = lenis; // expose so we can destroy on Ignite

  // 2. Initialize Custom Cursor
  initCursor();

  // 3. Initialize Three.js Scene
  const sceneController = new SceneController();
  
  // 4. Create 3D Objects
  const objects = createObjects(sceneController);

  // 5. Setup ScrollAnimations
  setupAnimations(sceneController, objects);
  
  // Animation loop
  gsap.ticker.add((time) => {
    // Add immersive mouse parallax to the entire scene
    const targetRotX = sceneController.mouse.y * 0.15;
    const targetRotY = sceneController.mouse.x * 0.15;
    
    sceneController.scene.rotation.x += (targetRotX - sceneController.scene.rotation.x) * 0.05;
    sceneController.scene.rotation.y += (targetRotY - sceneController.scene.rotation.y) * 0.05;
    
    sceneController.render();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

