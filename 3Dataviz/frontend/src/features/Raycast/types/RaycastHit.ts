import { Vector3 } from "@react-three/fiber"

export type RaycastHit = {
    previousSelectedBarId: number | null,
    barTooltipPosition: Vector3 | null
}