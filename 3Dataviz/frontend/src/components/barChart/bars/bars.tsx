import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { GetIntersection, GetIntersectionId } from "./utils/raycastUtils";
import { useSelector } from "react-redux";
import { selectorRaycastHit } from "../../../features/raycast/raycastHitSlice";
import { LoadShader } from "./utils/shaderUtils";
import { UpdateMousePosition } from "./utils/pointerInterectionUtils";
import { Selection } from "./utils/colorsUtils";
import { BarsProps } from "./props/barsProps";

function Bars({ data, clickHandler, hoverHandler }: BarsProps) {
  const { scene, camera } = useThree();

  const [shaderError, setShaderError] = useState(true);
  const [previeousSelectedBar, setPreviousSelectedBar] = useState(-1);

  // redux
  const raycastState = useSelector(selectorRaycastHit);

  // instancedMesh
  const count = data.length;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "white",
        clearcoat: 0.2,
        transparent: true,
        opacity: 1,
      }),
    [],
  );

  // variabili per instancedMesh
  const [vertexShader, setVertexShader] = useState("");
  const [fragmentShader, setFragmentShader] = useState("");
  const [instanceOpacity, setInstanceOpacity] = useState(() =>
    new Float32Array(count).fill(1.0),
  );

  // interazioni puntatore
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mouse = useRef(new THREE.Vector2());

  // hooks per aggiornamento instanced mesh e shader
  const instancedBarMatrices = useMemo(() => {
    const array = new Float32Array(count * 16);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const height = data[i].y;
      dummy.position.set(data[i].x * 6 + 4, height / 2, data[i].z * 6 + 6);
      dummy.scale.set(2, height + 0.01, 2);
      dummy.rotation.set(0, 0, 0);

      // colori riferiti all`altezza di ogni barra
      const maxHeight = Math.max(...data.map((d) => d.y));
      const normalizedHeight = height / maxHeight;
      const red = 1.0 - normalizedHeight;
      const green = normalizedHeight;
      const blue = 0.0;
      colors[i * 3 + 0] = red;
      colors[i * 3 + 1] = green;
      colors[i * 3 + 2] = blue;

      dummy.updateMatrix();
      dummy.matrix.toArray(array, i * 16);
    }
    return { matrices: array, colors };
  }, [count, dummy]);

  useEffect(() => {
    if (mesh.current) {
      const { matrices, colors } = instancedBarMatrices;
      const instancedMesh = mesh.current;

      instancedMesh.instanceMatrix.array = matrices;
      instancedMesh.instanceMatrix.needsUpdate = true;
      instancedMesh.computeBoundingSphere();

      // Usa instanced colors
      instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(
        colors,
        3,
      );
      instancedMesh.instanceColor.needsUpdate = true;

      const colorBase = new Float32Array(colors);
      instancedMesh.geometry.setAttribute(
        "colorBase",
        new THREE.BufferAttribute(colorBase, 3),
      );
      instancedMesh.geometry.setAttribute("color", instancedMesh.instanceColor);
      instancedMesh.geometry.setAttribute(
        "instanceOpacity",
        new THREE.InstancedBufferAttribute(instanceOpacity, 1),
      );
    }
  }, [instancedBarMatrices]);

  useEffect(() => {
    const newOpacity = new Float32Array(count);
    data.forEach((d, i) => {
      newOpacity[i] = d.show ? 1.0 : 0.15;
    });
    setInstanceOpacity(newOpacity);
  }, [data, count]);

  useEffect(() => {
    if (mesh.current && mesh.current.geometry.attributes.instanceOpacity) {
      mesh.current.geometry.attributes.instanceOpacity.array.set(
        instanceOpacity,
      );
      mesh.current.geometry.attributes.instanceOpacity.needsUpdate = true;
    }
  }, [instanceOpacity]);

  useEffect(() => {
    Promise.all([
      LoadShader("/shaders/barVertexShader.GLSL"),
      LoadShader("/shaders/barFragmentShader.GLSL"),
    ])
      .then(([vertex, fragment]) => {
        setShaderError(false);
        setVertexShader(vertex);
        setFragmentShader(fragment);
      })
      .catch((e) => {
        console.error("Shader error:", e);
        setShaderError(true);
      });
  }, []);

  useEffect(() => {
    if (shaderError) return;
    let ambient: THREE.AmbientLight | null = null;
    let point: THREE.DirectionalLight | null = null;
    scene.traverse((object) => {
      if (object instanceof THREE.AmbientLight) {
        if (!ambient) {
          ambient = object;
        }
      }
      if (object instanceof THREE.DirectionalLight) {
        if (!point) {
          point = object;
        }
      }
    });
    point!.shadow.mapSize.width = 2048;
    point!.shadow.mapSize.height = 2048;
    point!.shadow.camera.near = 0.1;
    point!.shadow.camera.far = 10;
    const newMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        ambientColor: { value: ambient!.color },
        pointLightPosition: { value: point!.position },
        pointLightColor: { value: point!.color },
        pointLightIntensity: { value: point!.intensity },
        pointLightShadowMap: {
          value: point!.shadow.map ? point!.shadow.map.texture : null,
        },
        pointLightShadowMatrixInverse: { value: new THREE.Matrix4() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    mesh.current.material = newMaterial;
  }, [
    data,
    scene,
    instancedBarMatrices,
    vertexShader,
    fragmentShader,
    shaderError,
  ]);

  useEffect(() => {
    const currentMouse = mouse.current;
    const handleMouseMove = (e: MouseEvent) => {
      UpdateMousePosition(currentMouse, e);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera, scene]);

  useEffect(() => {
    const currentBar = raycastState.previousSelectedBarId;
    Selection(mesh.current, currentBar, true);
    if (previeousSelectedBar >= 0) {
      Selection(mesh.current, previeousSelectedBar, false);
    }
    if (currentBar == null) return;
    setPreviousSelectedBar(currentBar);
  }, [raycastState.previousSelectedBarId]);

  // interazioni con le barre
  const onClick = (e: ThreeEvent<PointerEvent>) => {
    const bar = GetIntersectionId(mesh.current, mouse.current, e.camera);
    const prevId: number | null = raycastState.previousSelectedBarId;
    if (bar !== null && bar != prevId) {
      clickHandler(bar);
    }
  };

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (hoverTimeout.current !== null) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      const bar = GetIntersectionId(mesh.current, mouse.current, e.camera);
      const worldPointIntersection = GetIntersection(
        mesh.current,
        mouse.current,
        e.camera,
      );
      if (bar !== null && worldPointIntersection != null) {
        const tooltipPoint = worldPointIntersection.point.add(
          new THREE.Vector3(0.5, -0.5, 0),
        );
        hoverHandler(bar, tooltipPoint.toArray());
      }
    }, 500);
  };

  const onPointerLeave = () => {
    if (hoverTimeout.current !== null) {
      clearTimeout(hoverTimeout.current);
    }
    hoverHandler(0, null);
  };

  return (
    <>
      <group
        onClick={onClick}
        onPointerEnter={onPointerOver}
        onPointerLeave={onPointerLeave}>
        <instancedMesh ref={mesh} args={[geometry, material, count]}>
          <primitive object={geometry} />
          <primitive object={material} />
        </instancedMesh>
      </group>
    </>
  );
}

export default Bars;
