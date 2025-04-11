import { Dataset } from "src/interfaces/dataset.interface";
import { Entry } from "src/interfaces/entry.interface";
import { Legend } from "src/interfaces/legend.interface";

export class DatasetDto implements Dataset {
  data: Entry[];
  legend: Legend;
  xLabels: string[];
  zLabels: string[];

  constructor(dataset: Dataset) {
    this.data = dataset.data;
    this.legend = dataset.legend;
    this.xLabels = dataset.xLabels;
    this.zLabels = dataset.zLabels;
  }
}
