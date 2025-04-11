import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";
import axios from "axios";
import { weatherApiConfig } from "../config";
import { Dataset } from "../../../interfaces/dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";
import { WeatherData } from "../interfaces/weather-data.interface";

@Injectable()
export class WeatherApiFetcher extends BaseFetcher {
  private daysBetween(start: Date, end: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((end.getTime() - start.getTime()) / oneDay) + 1;
  }

  private buildUrl(): string {
    const latitudes = weatherApiConfig.CITIES.map((city) => city.latitude).join(
      ",",
    );
    const longitudes = weatherApiConfig.CITIES.map(
      (city) => city.longitude,
    ).join(",");
    const startDate = weatherApiConfig.START_DATE;
    const endDate = weatherApiConfig.END_DATE;
    const baseUrl = weatherApiConfig.BASE_URL;
    const url = baseUrl
      .replace("@LATITUDE@", latitudes)
      .replace("@LONGITUDE@", longitudes)
      .replace("@START_DATE@", startDate)
      .replace("@END_DATE@", endDate);
    return url;
  }

  getName(): string {
    return weatherApiConfig.NAME;
  }

  getSize(): [number, number] {
    const numDays = this.daysBetween(
      new Date(weatherApiConfig.START_DATE),
      new Date(weatherApiConfig.END_DATE),
    );
    const numHours = numDays * 24;
    const numCities = weatherApiConfig.CITIES.length;
    return [numHours, numCities];
  }

  getDescription(): string {
    return weatherApiConfig.DESCRIPTION;
  }

  async fetchData(): Promise<Dataset> {
    try {
      const url = this.buildUrl();
      const response = await axios.get<WeatherData[]>(url);
      const data = response.data;
      const dataset = this.transformData(data);
      return dataset;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Errore nel recupero dei dati\n${error}`,
      );
    }
  }

  protected transformData(data: WeatherData[]): Dataset {
    const entries: Entry[] = [];
    const legend: Legend = weatherApiConfig.LEGEND;

    const xLabels = data[0].hourly.time;
    const zLabels = weatherApiConfig.CITIES.map((city) => city.name);

    for (let i = 0; i < data.length; i++) {
      const hours = data[i].hourly.time;
      const values = data[i].hourly.temperature_2m;
      if (!hours || !values) {
        throw new Error("Formato dei dati non valido\n");
      }
      for (let j = 0; j < hours.length; j++) {
        const entry: Entry = {
          id: j * data.length + i,
          x: xLabels.indexOf(hours[j]),
          y: values[j],
          z: i,
        };
        entries.push(entry);
      }
    }
    const dataset: Dataset = {
      data: entries,
      legend: legend,
      xLabels: xLabels,
      zLabels: zLabels,
    };
    return dataset;
  }
}
