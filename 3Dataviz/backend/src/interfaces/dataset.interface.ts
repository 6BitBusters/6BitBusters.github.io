import { Entry } from "./entry.interface";
import { Legend } from "./legend.interface";

export interface Dataset {
  data: Entry[];
  legend: Legend;
  xLabels: string[];
  zLabels: string[];
}
