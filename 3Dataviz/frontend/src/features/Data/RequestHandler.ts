// import axios from "axios";
import { Dataset } from "./types/dataset";

export const fetchDataset = async (datasetId: number) => {
  if (datasetId < 0) {
    throw 404;
  }
  try {
    const response = await fetch(
      "http://127.0.0.1:5000/data-visualization/" + datasetId,
    );
    if (!response.ok) {
      throw response.status;
    }
    const data = (await response.json()) as Dataset;
    return data;
  } catch (error) {
    if (typeof error === "number") {
      throw error;
    }
    throw 500;
  }
};
