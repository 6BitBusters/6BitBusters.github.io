import { Data } from "../../../../features/data/interfaces/data";
import { Legend } from "../../../../features/data/types/legend";

export type ToolTipProps = {
  data: Data;
  legend: Legend | null;
  Xlabel: string;
  Zlabel: string;
};
