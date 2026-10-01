import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../../utils/motion";

const setLighting = (scene: THREE.Scene) => {
  let disposed = false;
  let environmentTexture: THREE.Texture | undefined;
  const directionalLight = new THREE.DirectionalLight(0x5eead4, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x22d3ee, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr?v=2", function (texture) {
      if (disposed) {
        texture.dispose();
        return;
      }
      environmentTexture = texture;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(
    screenLight:
      | THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
      | null
  ) {
    if (screenLight && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
  }
  const reducedMotion = prefersReducedMotion();
  const duration = reducedMotion ? 0 : 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: reducedMotion ? 0 : 0.2,
      duration: 2,
    });
  }

  function dispose() {
    disposed = true;
    environmentTexture?.dispose();
    if (scene.environment === environmentTexture) scene.environment = null;
    pointLight.shadow.map?.dispose();
    directionalLight.shadow.map?.dispose();
    scene.remove(pointLight, directionalLight);
    gsap.killTweensOf(scene);
    gsap.killTweensOf(directionalLight);
    gsap.killTweensOf(".character-rim");
  }

  return { setPointLight, turnOnLights, dispose };
};

export default setLighting;
