import { DatasetInfo } from "./types/DatasetInfo";

export const fetchDatasets = async () => {
  const response = await fetch("http://127.0.0.1:5000/data-source");
  if (!response.ok) {
    throw response.status;
  }
  const data = (await response.json()) as DatasetInfo[];
  return data;
};
