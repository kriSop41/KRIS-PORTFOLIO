import * as THREE from 'three';

export function createObjects(sceneController) {
  const animatedObjects = {
    terrain: null,
    orb: null,
    particles: null
  };

  // 1. Massive Infinite Wireframe Terrain (Synthwave Style) - Optimized resolution
  const terrainGeo = new THREE.PlaneGeometry(200, 200, 40, 40);
  terrainGeo.rotateX(-Math.PI / 2);

  const terrainMat = new THREE.MeshBasicMaterial({
      color: 0x0cd1a9, // Mint green glow outline
      wireframe: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
  });

  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.position.y = -10;
  
  // Store base properties for dynamic infinite animation
  const posArray = terrainGeo.attributes.position.array;
  terrain.userData.baseX = new Float32Array(posArray.length / 3);
  terrain.userData.baseZ = new Float32Array(posArray.length / 3);
  for(let i=0; i<posArray.length; i+=3) {
      terrain.userData.baseX[i/3] = posArray[i];
      terrain.userData.baseZ[i/3] = posArray[i+2];
  }

  // Real-time pure math flyover update
  terrain.updateVertices = function(time) {
      const arr = this.geometry.attributes.position.array;
      const baseX = this.userData.baseX;
      const baseZ = this.userData.baseZ;
      const speed = time * 20;

      for ( let i = 0; i < arr.length; i += 3 ) {
          const x = baseX[i/3];
          const z = baseZ[i/3] - speed; // Offset Z by time to fly forward continuously
          
          // Organic sine wave combinations for organic mountains
          arr[i+1] = Math.sin(x*0.1 + z*0.1) * 3 
                   + Math.cos(x*0.05 - z*0.08) * 4
                   + Math.sin(x*0.02 + z*0.02) * 8; 
      }
      this.geometry.attributes.position.needsUpdate = true;
  };

  sceneController.add(terrain);
  animatedObjects.terrain = terrain;

  // 2. Massive Glowing Sun/Orb in the distance - Reduced segments for performance
  const orbGeo = new THREE.SphereGeometry(20, 32, 32);
  const orbMat = new THREE.MeshBasicMaterial({ 
    color: 0xff2a5f, // Intense neon pink
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(0, 5, -80);
  sceneController.add(orb);
  animatedObjects.orb = orb;

  // 3. Ambient Dust Particles
  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 2000;
  const dustPos = new Float32Array(dustCount * 3);
  for(let i=0; i<dustCount*3; i++) {
    dustPos[i] = (Math.random() - 0.5) * 100;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.1, color: 0xffffff, transparent:true, opacity:0.3, blending: THREE.AdditiveBlending
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  sceneController.add(dust);
  animatedObjects.particles = dust;

  return animatedObjects;
}
