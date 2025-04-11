import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";
import axios from "axios";
import { populationApiConfig } from "../config";
import { Dataset } from "../../../interfaces/dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";
import { PopulationData } from "../interfaces/population-data.interface";

@Injectable()
export class PopulationApiFetcher extends BaseFetcher {
  private buildUrl(): string {
    const countryCode = populationApiConfig.COUNTRIES.map(
      (country) => country.countryCode,
    ).join(";");
    const startYear = populationApiConfig.START_YEAR;
    const endYear = populationApiConfig.END_YEAR;
    const baseUrl = populationApiConfig.BASE_URL;
    const url = baseUrl
      .replace("@COUNTRY_CODE@", countryCode)
      .replace("@START_YEAR@", startYear.toString())
      .replace("@END_YEAR@", endYear.toString());
    return url;
  }

  getName(): string {
    return populationApiConfig.NAME;
  }

  getSize(): [number, number] {
    const numYears =
      populationApiConfig.END_YEAR - populationApiConfig.START_YEAR + 1;
    const numCountries = populationApiConfig.COUNTRIES.length;
    return [numYears, numCountries];
  }

  getDescription(): string {
    return populationApiConfig.DESCRIPTION;
  }

  async fetchData(): Promise<Dataset> {
    try {
      const url = this.buildUrl();
      const response = await axios.get<PopulationData[]>(url);
      const data = response.data;
      const dataset = this.transformData(data);
      return dataset;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Errore nel recupero dei dati\n${error}`,
      );
    }
  }

  protected transformData(data: PopulationData[]): Dataset {
    const entries: Entry[] = [];
    const legend: Legend = populationApiConfig.LEGEND;
    try {
      const records = data[data.length - 1];
      // Array di tutti gli anni in ordine crescente, escludendo i duplicati
      const xLabels = [...new Set(records.map((entry) => entry.date))].sort();
      const zLabels = populationApiConfig.COUNTRIES.map(
        (country) => country.name,
      );
      records.forEach((record) => {
        const xIndex = xLabels.indexOf(record.date);
        const zIndex = zLabels.indexOf(
          populationApiConfig.COUNTRIES.find(
            (country) => country.countryCode === record.countryiso3code,
          )!.name,
        );
        const entry: Entry = {
          id: xIndex * zLabels.length + zIndex,
          x: xIndex,
          // Convert to millions
          y: record.value / 1000000,
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
      throw new Error(`Formato dei dati non valido\n${error}`);
    }
  }
}
