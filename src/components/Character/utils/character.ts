import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);
  let disposed = false;
  let blobUrl: string | undefined;

  const releaseBlob = () => {
    if (!blobUrl) return;
    URL.revokeObjectURL(blobUrl);
    blobUrl = undefined;
  };

  const disposeModel = (model: THREE.Object3D) => {
    model.traverse((object) => {
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
  };

  const loadCharacter = () => {
    return new Promise<GLTF | null>((resolve, reject) => {
      void (async () => {
        try {
          const encryptedBlob = await decryptFile(
            "/models/character.enc?v=2",
            "MyCharacter12"
          );
          if (disposed) {
            resolve(null);
            return;
          }

          blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));
          loader.load(
            blobUrl,
            async (gltf) => {
              const character = gltf.scene;
              try {
                await renderer.compileAsync(character, camera, scene);
              } catch (error) {
                disposeModel(character);
                releaseBlob();
                reject(error);
                return;
              }

              if (disposed) {
                disposeModel(character);
                releaseBlob();
                resolve(null);
                return;
              }

              character.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                const mesh = child;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
              });
              character.getObjectByName("footR")!.position.y = 3.36;
              character.getObjectByName("footL")!.position.y = 3.36;
              releaseBlob();
              dracoLoader.dispose();
              resolve(gltf);
            },
            undefined,
            (error) => {
              releaseBlob();
              if (disposed) resolve(null);
              else reject(error);
            }
          );
        } catch (error) {
          if (disposed) resolve(null);
          else reject(error);
        }
      })();
    });
  };

  const dispose = () => {
    disposed = true;
    releaseBlob();
    dracoLoader.dispose();
  };

  return { loadCharacter, dispose };
};

export default setCharacter;
