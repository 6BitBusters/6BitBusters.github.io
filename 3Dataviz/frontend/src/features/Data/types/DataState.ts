import { Data } from "../interfaces/data";
import { Legend } from "./legend";

export type DataState = {
  data: Data[];
  legend: Legend | null;
  average: number;
  z: string[];
  x: string[];
};
