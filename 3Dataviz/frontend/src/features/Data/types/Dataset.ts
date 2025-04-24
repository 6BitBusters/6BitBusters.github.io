import { Entry } from "../interfaces/entry";
import { Legend } from "./legend";

export type Dataset = {
  data: Entry[];
  legend: Legend | null;
  zLabels: string[];
  xLabels: string[];
};
