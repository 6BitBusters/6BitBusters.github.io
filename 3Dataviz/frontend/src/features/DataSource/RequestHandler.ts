import { DatasetInfo } from "./types/DatasetInfo";

export const fetchDatasets = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/data-source");
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
