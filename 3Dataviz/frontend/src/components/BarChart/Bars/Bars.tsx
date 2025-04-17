import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Data } from "../../../features/Data/interfaces/Data";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { GetIntersection, GetIntersectionId } from "./Utils/RaycastUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/Store";
import { useAppDispatch } from "../../../app/Hooks";
import {
  setHit,
  setTooltipPosition,
} from "../../../features/Raycast/RaycastHitSlice";
import { LoadShader } from "./Utils/ShaderUtils";
import { UpdateMousePosition } from "./Utils/PointerInterectionUtils";
import { Selection, RandomColors } from "./Utils/ColorsUtils";

type BarsProps = {
  data: Data[];
  clickHandler: (value: number) => void;
  hoverHandler: (barId: number) => void;
};

function Bars({ data, clickHandler, hoverHandler }: BarsProps) {
  const { scene, camera } = useThree();

  // redux
  const raycastState = useSelector((state: RootState) => state.raycast);
  const dispatch = useAppDispatch();

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
  const availableColors = Array.from(
    { length: Math.max(...data.map((d) => d.x)) + 1 },
    () => RandomColors(),
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
      dummy.scale.set(2, height, 2);
      dummy.rotation.set(0, 0, 0);
      const color = availableColors[data[i].x];
      colors.set([color.r, color.g, color.b], i * 3);

      dummy.updateMatrix();
      dummy.matrix.toArray(array, i * 16);
    }
    return { matrices: array, colors };
  }, [count]);

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

      var colorBase = new Float32Array(colors);
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
      newOpacity[i] = d.show ? 1.0 : 0.2;
    });
    setInstanceOpacity(newOpacity);
  }, [data, raycastState.previousSelectedBarId]);

  useEffect(() => {
    if (mesh.current && mesh.current.geometry.attributes.instanceOpacity) {
      mesh.current.geometry.attributes.instanceOpacity.array.set(
        instanceOpacity,
      );
      mesh.current.geometry.attributes.instanceOpacity.needsUpdate = true;
    }
  }, [instanceOpacity]);

  useEffect(() => {
    LoadShader("/Shaders/BarVertexShader.GLSL").then((shader)=>setVertexShader(shader))
    LoadShader("/Shaders/BarFragmentShader.GLSL").then((shader)=>setFragmentShader(shader))
  }, []);
  
  useEffect(() => {
    let ambient: THREE.AmbientLight | null = null;
    let point: THREE.PointLight | null = null;
    scene.traverse((object) => {
      if (object instanceof THREE.AmbientLight) {
        if (!ambient) {
          ambient = object;
        }
      }
      if (object instanceof THREE.PointLight) {
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
        pointLightDistance: { value: point!.distance },
        pointLightShadowMap: {
          value: point!.shadow.map ? point!.shadow.map.texture : null,
        },
        pointLightShadowMatrixInverse: { value: new THREE.Matrix4() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    mesh.current.material = newMaterial;
  }, [data, instancedBarMatrices, vertexShader, fragmentShader]);

  useEffect(() => {
    window.addEventListener("mousemove", (e: MouseEvent) => UpdateMousePosition(mouse.current,e));
    return () => {
      window.removeEventListener("mousemove", (e: MouseEvent) => UpdateMousePosition(mouse.current,e));
    };
  }, [camera, scene]);


  // interazioni con le barre
  const onClick = (e: ThreeEvent<PointerEvent>) => {
    const bar = GetIntersectionId(
      mesh.current,
      mouse.current,
      e.camera,
    );
    const prevId: number | null = raycastState.previousSelectedBarId;
    if (bar !== null && bar != prevId) {
      clickHandler(bar);
      Selection(mesh.current,bar, true);
      Selection(mesh.current,prevId, false);
      dispatch(setHit(bar));
    }
  }

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (hoverTimeout.current !== null) {
      clearTimeout(hoverTimeout.current);
    }
    hoverTimeout.current = setTimeout(() => {
      const bar = GetIntersectionId(
        mesh.current,
        mouse.current,
        e.camera,
      );
      const worldPointIntersection = GetIntersection(
        mesh.current,
        mouse.current,
        e.camera,
      );
      if (bar !== null && worldPointIntersection != null) {
        const tooltipPoint = worldPointIntersection.point.add(
          new THREE.Vector3(0.5, -0.5, 0),
        );
        dispatch(
          setTooltipPosition([
            tooltipPoint.x,
            tooltipPoint.y,
            tooltipPoint.z,
          ]),
        );
        hoverHandler(bar);
      }
    }, 500);
  }

  const onPointerLeave = () => {
    if (hoverTimeout.current !== null) {
      clearTimeout(hoverTimeout.current);
    }
    dispatch(setTooltipPosition(null));
    hoverHandler(0);
  }

  return (
    <>
      <group onClick={onClick} onPointerEnter={onPointerOver }  onPointerLeave={onPointerLeave}>
        <instancedMesh
          ref={mesh}
          args={[geometry, material, count]}
          >
          <primitive object={geometry} />
          <primitive object={material} />
        </instancedMesh>
      </group>
    </>
  );
}

export default Bars;
