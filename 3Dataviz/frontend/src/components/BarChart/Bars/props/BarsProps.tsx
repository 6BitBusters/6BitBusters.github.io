import { Data } from "../../../../features/data/interfaces/data";

export type BarsProps = {
  data: Data[];
  clickHandler: (value: number) => void;
  hoverHandler: (
    barId: number,
    hitPosition: [number, number, number] | null,
  ) => void;
};
