import { Entry } from "../interfaces/Entry";
import { Legend } from "./Legend";

export type Dataset = {
  data: Entry[];
  legend: Legend | null;
  zLabels: string[];
  xLabels: string[];
};
