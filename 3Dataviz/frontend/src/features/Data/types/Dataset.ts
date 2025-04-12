import { Entity } from "../interfaces/Entry";
import { Legend } from "./Legend";

export type Dataset = {
  data: Entity[];
  legend: Legend | null;
  zLabels: string[];
  xLabels: string[];
};
