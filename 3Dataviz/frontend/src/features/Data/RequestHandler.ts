// import axios from "axios";
import { Dataset } from "./types/Dataset";

export const fetchDataset = async (datasetId: number) => {
  if (datasetId < 0) {
    throw 500;
  }
  const response = await fetch("http://127.0.0.1:5000/api/" + datasetId);
  if (!response.ok) {
    throw response.status;
  }
  const data = (await response.json()) as Dataset;
  return data;
};
