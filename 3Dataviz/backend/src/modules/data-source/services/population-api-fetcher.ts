import { Injectable } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";
import axios from "axios";
import { POPULATION_API_CONFIG } from "../config";
import { Dataset } from "../../../interfaces/dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";

interface PopulationRecord {
  countryiso3code: string;
  date: string;
  value: number;
}

export type PopulationData = PopulationRecord[];

@Injectable()
export class PopulationApiFetcher extends BaseFetcher {
  private buildUrl(): string {
    const countryCode = POPULATION_API_CONFIG.COUNTRIES.map(
      (country) => country.countryCode,
    ).join(";");
    const startYear = POPULATION_API_CONFIG.START_YEAR;
    const endYear = POPULATION_API_CONFIG.END_YEAR;
    const baseUrl = POPULATION_API_CONFIG.BASE_URL;
    const url = baseUrl
      .replace("@COUNTRY_CODE@", countryCode)
      .replace("@START_YEAR@", startYear.toString())
      .replace("@END_YEAR@", endYear.toString());
    return url;
  }

  getName(): string {
    return POPULATION_API_CONFIG.NAME;
  }

  getSize(): [number, number] {
    const numYears =
      POPULATION_API_CONFIG.END_YEAR - POPULATION_API_CONFIG.START_YEAR + 1;
    const numCountries = POPULATION_API_CONFIG.COUNTRIES.length;
    return [numYears, numCountries];
  }

  getDescription(): string {
    return POPULATION_API_CONFIG.DESCRIPTION;
  }

  async fetchData(): Promise<Dataset> {
    try {
      const url = this.buildUrl();
      const response = await axios.get<PopulationData[]>(url);
      const data = response.data;
      const dataset = this.transformData(data);
      return dataset;
    } catch (error) {
      throw new Error("Errore nel recupero dei dati.\n" + error);
    }
  }

  protected transformData(data: PopulationData[]): Dataset {
    const entries: Entry[] = [];
    const legend: Legend = POPULATION_API_CONFIG.LEGEND;
    try {
      const records = data[data.length - 1];
      // Array di tutti gli anni in ordine crescente, escludendo i duplicati
      const xLabels = [...new Set(records.map((entry) => entry.date))].sort();
      const zLabels = POPULATION_API_CONFIG.COUNTRIES.map(
        (country) => country.name,
      );
      records.forEach((record) => {
        const xIndex = xLabels.indexOf(record.date);
        const zIndex = zLabels.indexOf(
          POPULATION_API_CONFIG.COUNTRIES.find(
            (country) => country.countryCode === record.countryiso3code,
          )!.name,
        );
        const entry: Entry = {
          id: xIndex * zLabels.length + zIndex,
          x: xIndex,
          y: record.value / 1000000, // Convert to millions
          z: zIndex,
        };
        entries.push(entry);
      });
      const dataset: Dataset = {
        data: entries,
        legend: legend,
        xLabels: xLabels,
        zLabels: zLabels,
      };
      return dataset;
    } catch (error) {
      throw new Error("Formato dei dati non valido.\n" + error);
    }
  }
}
