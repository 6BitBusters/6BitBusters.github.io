import { Vector3 } from "three";

export type RaycastHit = {
  previousSelectedBarId: number | null;
  barTooltipPosition: Vector3 | null;
};
