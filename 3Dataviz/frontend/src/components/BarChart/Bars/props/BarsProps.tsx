import { Data } from "../../../../features/Data/interfaces/Data";

export type BarsProps = {
  data: Data[];
  clickHandler: (value: number) => void;
  hoverHandler: (barId: number) => void;
};
