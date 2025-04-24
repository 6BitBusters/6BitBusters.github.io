import { Data } from "../../../../features/data/interfaces/data";
import { Legend } from "../../../../features/data/types/legend";

export type TooltipProps = {
  data: Data;
  legend: Legend | null;
  Xlabel: string;
  Zlabel: string;
};
