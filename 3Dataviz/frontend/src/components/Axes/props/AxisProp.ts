import * as THREE from "three";

type PlacementFunction = (input: number) => THREE.Vector3;

export type axisProp = {
  labels: string[];
  color: THREE.Color;
  endPoint: THREE.Vector3;
  labelScale?: number;
  placementFunction: PlacementFunction;
};
