import * as THREE from 'three';

export class SceneController {
  constructor() {
    this.canvas = document.querySelector('#webgl-canvas');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Default fog to blend far objects into the dark background
    this.scene.fog = new THREE.FogExp2('#0d0f12', 0.05);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    const isMobile = window.innerWidth < 768;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // Transparent background so CSS applies
      antialias: !isMobile, // Disable antialias on mobile for performance
      powerPreference: "default",
      precision: isMobile ? 'lowp' : 'mediump'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));

    // Lights
    this.initLights();

    // Mouse Tracking for Parallax
    this.mouse = new THREE.Vector2(0, 0);
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.height) * 2 + 1;
    });

    // Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);
    
    // Add cool accent lights
    const pointLightPurple = new THREE.PointLight(0x6d5dfc, 2, 20); // Accent 1
    pointLightPurple.position.set(-2, 1, 2);
    this.scene.add(pointLightPurple);

    const pointLightMint = new THREE.PointLight(0x0cd1a9, 2, 20); // Accent 2
    pointLightMint.position.set(2, -1, 1);
    this.scene.add(pointLightMint);
    
    this.pointLightPurple = pointLightPurple;
    this.pointLightMint = pointLightMint;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  add(object) {
    this.scene.add(object);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
