import { Data } from "../../../../features/Data/interfaces/Data";
import { Legend } from "../../../../features/Data/types/Legend";

export type ToolTipProps = {
  data: Data;
  legend: Legend | null;
  Xlabel: string;
  Zlabel: string;
};
