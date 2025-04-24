import * as THREE from "three";

export type BarChartProps = {
  onSelectedBar: (cameraPosition: THREE.Vector3, lookAt: THREE.Vector3) => void;
};
