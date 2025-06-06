import { Canvas } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import { useImperativeHandle } from "react";
import { OrbitControls as OrbitControlsType } from "three-stdlib";
import { gsap } from "gsap";
import "./customCanvas.css";
import BarChart from "../barChart/barChart";
import { CustomCanvasProps } from "./props/customCanvasProp";
import Lights from "./lights";
import React from "react";
import * as THREE from "three";

const customCanvas = React.forwardRef<
  { resetCamera: () => void },
  CustomCanvasProps
>(
  (
    {
      initialCameraPosition = [30, 30, -40],
      initialTarget: initialTarget = [35, 25, 0],
      initialZoom = 0.8,
    },
    ref,
  ) => {
    const controls = React.useRef<OrbitControlsType>(null);

    const resetCamera = () => {
      // Ottieni la camera da OrbitControls
      if (!controls.current) return;
      const camera = controls.current.object;

      if (camera) {
        gsap.to(camera.position, {
          x: initialCameraPosition[0],
          y: initialCameraPosition[1],
          z: initialCameraPosition[2],
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            controls.current?.target.set(...initialTarget);
          },
        });
        gsap.to(controls.current.target, {
          x: initialTarget[0],
          y: initialTarget[1],
          z: initialTarget[2],
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            controls.current!.update();
          },
        });
        gsap.to(camera, {
          zoom: initialZoom,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            camera.updateProjectionMatrix();
          },
        });
      }
    };

    const cameraFocus = (
      cameraPosition: THREE.Vector3,
      lookAt: THREE.Vector3,
    ) => {
      if (!controls.current) return;
      const camera = controls.current.object;

      gsap.to(camera.position, {
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: cameraPosition.z,
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(controls.current.target, {
        x: lookAt.x,
        y: lookAt.y,
        z: lookAt.z,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          controls.current!.update();
        },
      });
    };

    useImperativeHandle(ref, () => ({
      resetCamera: resetCamera,
    }));
    return (
      <>
        <Canvas
          data-testid="canvas"
          dpr={window.devicePixelRatio}
          shadows
          gl={{ preserveDrawingBuffer: true }}
          camera={{
            position: initialCameraPosition,
            rotation: [-3.025, -0.38, 3.2],
            fov: 90,
            near: 0.01,
            far: 1000,
          }}>
          <fog attach="fog" args={[0x121212, 0.1, 300]} />
          <Lights intensity={1} lightPosition={[100, 0, -30]} />
          <BarChart onSelectedBar={cameraFocus} />
          <OrbitControls
            makeDefault
            ref={controls}
            target={initialTarget}
            dampingFactor={0.07}
            maxDistance={100}
          />
          <GizmoHelper alignment="top-left" margin={[60, 60]}>
            <GizmoViewport
              axisColors={["red", "green", "blue"]}
              labelColor="black"
            />
          </GizmoHelper>
        </Canvas>
      </>
    );
  },
);

export default customCanvas;
