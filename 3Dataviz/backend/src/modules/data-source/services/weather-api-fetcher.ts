import { Injectable } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";
import axios from "axios";
import { WEATHER_API_CONFIG } from "../config";
import { Dataset } from "../../../interfaces/dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";

export interface WeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

@Injectable()
export class WeatherApiFetcher extends BaseFetcher {
  private daysBetween(start: Date, end: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((end.getTime() - start.getTime()) / oneDay);
  }

  private buildUrl(): string {
    const latitudes = WEATHER_API_CONFIG.CITIES.map(
      (city) => city.latitude,
    ).join(",");
    const longitudes = WEATHER_API_CONFIG.CITIES.map(
      (city) => city.longitude,
    ).join(",");
    const startDate = WEATHER_API_CONFIG.START_DATE;
    const endDate = WEATHER_API_CONFIG.END_DATE;
    const baseUrl = WEATHER_API_CONFIG.BASE_URL;
    const url = baseUrl
      .replace("@latitude@", latitudes)
      .replace("@longitude@", longitudes)
      .replace("@start_date@", startDate)
      .replace("@end_date@", endDate);
    return url;
  }

  getName(): string {
    return WEATHER_API_CONFIG.NAME;
  }

  getSize(): [number, number] {
    const numberOfDays = this.daysBetween(
      new Date(WEATHER_API_CONFIG.START_DATE),
      new Date(WEATHER_API_CONFIG.END_DATE),
    );
    const numberOfHours = numberOfDays * 24;
    const numberOfCities = WEATHER_API_CONFIG.CITIES.length;
    return [numberOfHours, numberOfCities];
  }

  getDescription(): string {
    return WEATHER_API_CONFIG.DESCRIPTION;
  }

  async fetchData(): Promise<Dataset> {
    try {
      const url = this.buildUrl();
      const response = await axios.get<WeatherData[]>(url);
      const data = response.data;
      const dataset = this.transformData(data);
      return dataset;
    } catch (error) {
      throw new Error("Errore nel recupero dei dati meteo: " + error);
    }
  }

  protected transformData(data: WeatherData[]): Dataset {
    const entries: Entry[] = [];
    const legend: Legend = WEATHER_API_CONFIG.LEGEND;

    const xLabels = data[0].hourly.time;
    const zLabels = WEATHER_API_CONFIG.CITIES.map((city) => city.name);

    for (let i = 0; i < data.length; i++) {
      const hours = data[i].hourly.time;
      const values = data[i].hourly.temperature_2m;
      if (!hours || !values) {
        throw new Error("Formato dei dati non valido");
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
