import { Vector3 } from "three";

export type RaycastHit = {
  previousSelectedBarId: number | null;
  barTooltipPosition: [number, number, number] | null;
};
