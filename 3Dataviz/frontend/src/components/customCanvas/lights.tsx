import { LightsProp } from "./props/lightsProp";

function Lights({ intensity, lightPosition }: LightsProp) {
  return (
    <>
      <ambientLight intensity={intensity} />
      <directionalLight
        position={lightPosition}
        intensity={intensity}
        castShadow
      />
    </>
  );
}

export default Lights;
