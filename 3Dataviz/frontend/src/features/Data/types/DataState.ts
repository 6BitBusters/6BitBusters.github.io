import { Data } from "../interfaces/Data";
import { Legend } from "./Legend";

export type DataState = {
  data: Data[];
  legend: Legend | null;
  average: number;
  z: string[];
  x: string[];
};
