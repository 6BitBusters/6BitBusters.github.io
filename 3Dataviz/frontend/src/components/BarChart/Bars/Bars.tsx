import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from 'three';
import { Data } from "../../../features/Data/interfaces/Data";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { GetIntersection, GetIntersectionId } from "./RaycastUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/Store";
import { useAppDispatch } from "../../../app/Hooks";
import { setHit, setTooltipPosition } from "../../../features/Raycast/RaycastHitSlice";

type BarsProps = {
    data: Data[];
    clickHandler: (value: number) => void;
    hoverHandler: (barId: number) => void;
}

function Bars({data,clickHandler,hoverHandler}:BarsProps) {
    const { scene,camera } = useThree();
    const count = data.length;
    const mesh = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
    const material = useMemo(() => new THREE.MeshPhysicalMaterial({ 
        color: 'white', 
        clearcoat: 0.2, 
        transparent:true, 
        opacity:1 }
    ),[]);

    const raycastState = useSelector((state:RootState) => state.raycast);
    const dispatch = useAppDispatch();

    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const highlightColor = new THREE.Color("white");

    const randomColors = () => {
        const hue = Math.random();         // Tonalità (da 0 a 1)
        // Saturazione (da 0.5 a 1, colori più vivaci)
        const saturation = Math.random() * 0.5 + 0.5;
        // Luminosità (da 0.3 a 0.8, evita estremi)
        const lightness = Math.random() * 0.5 + 0.3;
        return new THREE.Color().setHSL(hue, saturation, lightness);
    }

    const availableColors = Array.from({ length:Math.max(...data.map(d=>d.x))+1 }, () => randomColors());

    var [instanceOpacity, _] = useState(() => { // Inizializzazione con una funzione
        const array = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            array[i] = 1.0;
        }
        return array;
    });

    const instancedBarsMatrix = useMemo(() => {
        const array = new Float32Array(count * 16);
        const colors = new Float32Array(count * 3); // Array per i colori (RGB)
    
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
          const { matrices, colors } = instancedBarsMatrix;
          const instancedMesh = mesh.current;
    
          instancedMesh.instanceMatrix.array = matrices;
          instancedMesh.instanceMatrix.needsUpdate = true;
          instancedMesh.computeBoundingSphere();
    
          // Usa instanced colors
          instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
          instancedMesh.instanceColor.needsUpdate = true;
    
          var colorBase = new Float32Array(colors);
          instancedMesh.geometry.setAttribute('colorBase', new THREE.BufferAttribute(colorBase, 3));
          instancedMesh.geometry.setAttribute('color', instancedMesh.instanceColor);
          instancedMesh.geometry.setAttribute('instanceOpacity', new THREE.InstancedBufferAttribute(instanceOpacity, 1));
        }
    }, [instancedBarsMatrix]);

    const aura = (id:number|null, h: boolean) => {
        if(mesh.current != undefined && id!=null) {
            mesh.current.geometry.attributes.color.setXYZ(
                id,
                h ? highlightColor.r : mesh.current.geometry.attributes.colorBase.getX(id),
                h ? highlightColor.g : mesh.current.geometry.attributes.colorBase.getY(id),
                h ? highlightColor.b : mesh.current.geometry.attributes.colorBase.getZ(id)
              );
            mesh.current.geometry.attributes.color.needsUpdate = true;
        }
    }

    useEffect(() => {
        data.forEach((d,i) => {
            if (!d.show) {
                instanceOpacity[i]  = 0.2;
            } else {
                instanceOpacity[i] = 1.0;
            }
        });
        console.log(instanceOpacity);
        mesh.current.geometry.attributes.instanceOpacity.needsUpdate = true;
    }, [data,raycastState.previousSelectedBarId]);

    const [vertexShader, setVertexShader] = useState('');
    const [fragmentShader, setFragmentShader] = useState('');

    useEffect(() => {
        const fileLoader = new THREE.FileLoader();
    
        fileLoader.load(
          '/Shaders/BarVertexShader.GLSL',
          (vertexShaderData) => {
            const shaderString = typeof vertexShaderData === 'string' ? vertexShaderData : new TextDecoder().decode(vertexShaderData);
            setVertexShader(shaderString);
          },
          undefined,
          (error) => {
            console.error('Error loading vertex shader:', error);
          }
        );
    
        fileLoader.load(
          '/Shaders/BarFragmentShader.GLSL',
          (fragmentShaderData) => {
            const shaderString = typeof fragmentShaderData === 'string' ? fragmentShaderData : new TextDecoder().decode(fragmentShaderData);
            setFragmentShader(shaderString);
          },
          undefined,
          (error) => {
            console.error('Error loading fragment shader:', error);
          }
        );
      }, []);

    useEffect(()=>{
        let ambient: THREE.AmbientLight | null = null;
        let point: THREE.PointLight | null = null;
        scene.traverse(object => {
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
        transparent:true,
        uniforms: {
            ambientColor: { value: ambient!.color },
            pointLightPosition: { value: point!.position },
            pointLightColor: { value: point!.color },
            pointLightIntensity: { value: point!.intensity },
            pointLightDistance: { value: point!.distance },
            pointLightShadowMap: { value: point!.shadow.map ? point!.shadow.map.texture : null },
            pointLightShadowMatrixInverse: { value: new THREE.Matrix4() },
          },
        vertexShader:vertexShader,
        fragmentShader: fragmentShader
        });
            mesh.current.material = newMaterial;
      },[data,instancedBarsMatrix,vertexShader,fragmentShader]);

    const mouse = useRef(new THREE.Vector2());
    useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        const canvas = event.target as HTMLCanvasElement;
        if (canvas instanceof HTMLCanvasElement) {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [camera, scene])
    return (
        <>
        <instancedMesh 
            ref={mesh} 
            args={[geometry, material, count]}
            onClick={(e: ThreeEvent<PointerEvent>)=>{
                console.log(mouse.current)
                const bar = GetIntersectionId(mesh.current,mouse.current,e.camera);
                const prevId: number|null = raycastState.previousSelectedBarId;
                if (bar!==null && bar != prevId) {
                    clickHandler(bar);
                    aura(bar,true)
                    aura(prevId,false);
                    dispatch(setHit(bar));
                }
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>)=>{
                if (hoverTimeout.current !== null) {
                    clearTimeout(hoverTimeout.current);
                }
                hoverTimeout.current = setTimeout(() => {
                    const bar = GetIntersectionId(mesh.current,mouse.current,e.camera);
                    const worldPointIntersection = GetIntersection(mesh.current,mouse.current,e.camera);
                    console.log(worldPointIntersection);
                    if(bar!==null && worldPointIntersection != null) {
                      const tooltipPoint = worldPointIntersection.point.add(new THREE.Vector3(0.5, -0.5, 0));
                      dispatch(setTooltipPosition([tooltipPoint.x,tooltipPoint.y,tooltipPoint.z]));
                        hoverHandler(bar)
                    }
                },500)
            }}
            onPointerLeave={()=>{
                if (hoverTimeout.current !== null) {
                    clearTimeout(hoverTimeout.current);
                }
                dispatch(setTooltipPosition(null));
                hoverHandler(0)
            }}
            >
          <primitive object={geometry} />
          <primitive object={material} />
        </instancedMesh>
        </>
    )
}

export default Bars;