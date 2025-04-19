import { Canvas } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { OrbitControls as OrbitControlsType } from "three-stdlib";
import { gsap } from "gsap";
import "./CustomCanvas.css";
import BarChart from "../BarChart/BarChart";
import { CustomCanvasProps } from "./props/CustomCanvasProp";
import Lights from "./Lights";

function CustomCanvas({
  initialCameraPosition = [25, 25, 25],
  initialTarget: initialTarget = [10, 0, 10],
  initialZoom = 1,
}: CustomCanvasProps) {
  const controls = useRef<OrbitControlsType>(null);

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

  return (
    <>
      <Canvas
        id="canvas"
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
        <fog attach="fog" args={[0x121212, 0.1, 150]} />
        <Lights intensity={1} distance={500} lightPosition={[10, 30, 10]} />
        <gridHelper args={[500, 500, "#303030", "#303030"]} />
        <BarChart />
        <OrbitControls
          makeDefault
          ref={controls}
          target={initialTarget}
          dampingFactor={0.07}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1}
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
}

export default CustomCanvas;
