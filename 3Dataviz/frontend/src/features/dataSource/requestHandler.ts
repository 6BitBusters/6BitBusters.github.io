import { DatasetInfo } from "./types/datasetInfo";

export const fetchDatasets = async () => {
  try {
    const response = await fetch("http://localhost:3000/data-source");
    if (!response.ok) {
      throw response.status;
    }
    const data = (await response.json()) as DatasetInfo[];
    return data;
  } catch (error) {
    if (typeof error === "number") {
      throw error;
    }
    throw 500;
  }
};
