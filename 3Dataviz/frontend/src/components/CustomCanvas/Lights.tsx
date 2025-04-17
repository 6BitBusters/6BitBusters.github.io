import { LightsProp } from "./props/LightsProp";

function Lights({ intensity, lightPosition, distance }: LightsProp) {
  return (
    <>
      <ambientLight intensity={intensity} />
      <pointLight
        position={lightPosition}
        intensity={intensity}
        distance={distance}
        castShadow
      />
    </>
  );
}

export default Lights;
