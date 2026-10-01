import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { prefersReducedMotion } from "../utils/motion";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    const canvas = canvasDiv.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scene = sceneRef.current;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(rect.width, rect.height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvas.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      14.5,
      rect.width / rect.height,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    const clock = new THREE.Clock();
    const reducedMotion = prefersReducedMotion();
    const light = setLighting(scene);
    const progress = setProgress(setLoading);
    const characterLoader = setCharacter(renderer, scene, camera);
    const landingDiv = document.getElementById("landingDiv");
    const mouse = { x: 0, y: 0 };
    const interpolation = { x: 0.1, y: 0.2 };
    let disposed = false;
    let character: THREE.Object3D | null = null;
    let headBone: THREE.Object3D | null = null;
    let screenLight:
      | THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>
      | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let hoverCleanup: (() => void) | undefined;
    let animationCleanup: (() => void) | undefined;
    let characterTimelineCleanup: (() => void) | undefined;
    let allTimelineCleanup: (() => void) | undefined;
    let touchStartTimeout = 0;
    let resizeTimelineTimeout = 0;
    let introTimeout = 0;
    let stopTouchReset = () => {};
    let wasDesktop = window.innerWidth > 1024;

    const rebuildScrollTimelines = () => {
      if (!character) return;
      characterTimelineCleanup?.();
      allTimelineCleanup?.();
      characterTimelineCleanup = setCharTimeline(character, camera);
      allTimelineCleanup = setAllTimeline();
    };

    const animate = () => {
      if (headBone) {
        if (!reducedMotion) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
        }
        light.setPointLight(screenLight);
      }
      if (!reducedMotion) mixer?.update(Math.min(clock.getDelta(), 0.1));
      renderer.render(scene, camera);
    };

    let resizeFrame = 0;
    const onWindowResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        handleResize(renderer, camera, canvasDiv);
        const isDesktop = window.innerWidth > 1024;
        if (isDesktop !== wasDesktop) {
          wasDesktop = isDesktop;
          window.clearTimeout(resizeTimelineTimeout);
          resizeTimelineTimeout = window.setTimeout(rebuildScrollTimelines, 120);
        }
      });
    };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => {
        mouse.x = x;
        mouse.y = y;
      });
    };

    const onTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => {
        mouse.x = x;
        mouse.y = y;
      });
    };

    const onTouchStart = () => {
      window.clearTimeout(touchStartTimeout);
      touchStartTimeout = window.setTimeout(() => {
        landingDiv?.addEventListener("touchmove", onTouchMove, {
          passive: true,
        });
      }, 200);
    };

    const onTouchEnd = () => {
      window.clearTimeout(touchStartTimeout);
      landingDiv?.removeEventListener("touchmove", onTouchMove);
      stopTouchReset();
      stopTouchReset = handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse.x = x;
        mouse.y = y;
        interpolation.x = interpolationX;
        interpolation.y = interpolationY;
      });
    };

    const onVisibilityChange = () => {
      renderer.setAnimationLoop(
        document.hidden || reducedMotion || !character ? null : animate
      );
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onWindowResize, { passive: true });
    landingDiv?.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    landingDiv?.addEventListener("touchend", onTouchEnd, { passive: true });
    void characterLoader
      .loadCharacter()
      .then((gltf) => {
        if (disposed || !gltf) return;

        const animations = setAnimations(gltf);
        animationCleanup = animations.dispose;
        character = gltf.scene;
        mixer = animations.mixer;
        scene.add(character);
        headBone = character.getObjectByName("spine006") || null;
        const screenLightObject = character.getObjectByName("screenlight");
        screenLight =
          screenLightObject instanceof THREE.Mesh &&
          !Array.isArray(screenLightObject.material)
            ? (screenLightObject as THREE.Mesh<
                THREE.BufferGeometry,
                THREE.MeshStandardMaterial
              >)
            : null;
        hoverCleanup = hoverDivRef.current
          ? animations.hover(gltf, hoverDivRef.current)
          : undefined;
        characterTimelineCleanup = setCharTimeline(character, camera);
        allTimelineCleanup = setAllTimeline();
        if (!reducedMotion && !document.hidden) {
          renderer.setAnimationLoop(animate);
        }

        void progress.loaded().then(() => {
          if (disposed) return;
          if (reducedMotion) {
            light.turnOnLights();
            requestAnimationFrame(() => {
              if (!disposed) renderer.render(scene, camera);
            });
            return;
          }
          introTimeout = window.setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });
      })
      .catch((error: unknown) => {
        if (!disposed) console.error(error);
      });

    return () => {
      disposed = true;
      window.clearTimeout(touchStartTimeout);
      window.clearTimeout(resizeTimelineTimeout);
      window.clearTimeout(introTimeout);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      stopTouchReset();
      progress.stop();
      hoverCleanup?.();
      animationCleanup?.();
      characterTimelineCleanup?.();
      allTimelineCleanup?.();
      characterLoader.dispose();
      light.dispose();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onWindowResize);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchmove", onTouchMove);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      renderer.setAnimationLoop(null);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value instanceof THREE.Texture) value.dispose();
          });
          material.dispose();
        });
      });
      scene.clear();
      renderer.dispose();
      if (renderer.domElement.parentNode === canvas) {
        canvas.removeChild(renderer.domElement);
      }
    };
  }, [setLoading]);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
