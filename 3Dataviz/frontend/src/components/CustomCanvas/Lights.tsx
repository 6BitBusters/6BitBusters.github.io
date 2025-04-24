import { lightsProp } from "./props/lightsProp";

function Lights({ intensity, lightPosition, distance }: lightsProp) {
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
