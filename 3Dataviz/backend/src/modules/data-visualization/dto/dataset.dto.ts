import { Legend } from "src/interfaces/legend.interface";
import { Entry } from "src/interfaces/entry.interface";

export class DatasetDto {
  data: Entry[];
  legend: Legend;
  xLabels: string[];
  zLabels: string[];
}
