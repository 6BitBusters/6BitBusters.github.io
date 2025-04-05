import { Injectable } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";
import axios from "axios";
import { FLIGHTS_API_CONFIG } from "../config";
import { Dataset } from "../../../interfaces/dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";

interface FlightsRecord {
  estDepartureAirport: string;
}

export type FlightsData = FlightsRecord[];

@Injectable()
export class FlightsApiFetcher extends BaseFetcher {
  private buildUrl(id: number, hour: number): string {
    const airportCode = FLIGHTS_API_CONFIG.AIRPORTS[id].airportCode;
    const startDatetime = FLIGHTS_API_CONFIG.START_DATETIME + hour * 3600;
    // Intervalli di un'ora (senza intersezione)
    const endDatetime = startDatetime + 3599;
    const baseUrl = FLIGHTS_API_CONFIG.BASE_URL;
    const url = baseUrl
      .replace("@AIRPORT@", airportCode)
      .replace("@START_DATETIME@", startDatetime.toString())
      .replace("@END_DATETIME@", endDatetime.toString());
    return url;
  }

  getName(): string {
    return FLIGHTS_API_CONFIG.NAME;
  }

  getSize(): [number, number] {
    const numIntervals = FLIGHTS_API_CONFIG.NUM_INTERVALS;
    const numAirports = FLIGHTS_API_CONFIG.AIRPORTS.length;
    return [numIntervals, numAirports];
  }

  getDescription(): string {
    return FLIGHTS_API_CONFIG.DESCRIPTION;
  }

  async fetchData(): Promise<Dataset> {
    const data: FlightsData[] = [];
    try {
      for (let hour = 0; hour < FLIGHTS_API_CONFIG.NUM_INTERVALS; hour++) {
        for (let i = 0; i < FLIGHTS_API_CONFIG.AIRPORTS.length; i++) {
          const url = this.buildUrl(i, hour);
          const response = await axios.get<FlightsData>(url);
          console.log(response);
          data.push(response.data);
        }
      }
      const dataset = this.transformData(data);
      return dataset;
    } catch (error) {
      throw new Error("Errore nel recupero dei dati.\n" + error);
    }
  }

  protected transformData(data: FlightsData[]): Dataset {
    const entries: Entry[] = [];
    const legend: Legend = FLIGHTS_API_CONFIG.LEGEND;
    const xLabels = Array.from(
      { length: FLIGHTS_API_CONFIG.NUM_INTERVALS },
      (_, hour) => {
        const start = hour.toString().padStart(2, "0") + ":00";
        const end = hour.toString().padStart(2, "0") + ":59";
        return `${start} - ${end}`;
      },
    );
    const zLabels = FLIGHTS_API_CONFIG.AIRPORTS.map((airport) => airport.name);
    try {
      for (
        let xIndex = 0;
        xIndex < FLIGHTS_API_CONFIG.NUM_INTERVALS;
        xIndex++
      ) {
        for (
          let zIndex = 0;
          zIndex < FLIGHTS_API_CONFIG.AIRPORTS.length;
          zIndex++
        ) {
          const index = xIndex * FLIGHTS_API_CONFIG.AIRPORTS.length + zIndex;
          const record = data[index];
          if (!record.length) {
            throw new Error();
          }
          const entry: Entry = {
            id: index,
            x: xIndex,
            y: record.length, // Numero di voli in partenza
            z: zIndex,
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
    } catch (error) {
      throw new Error("Formato dei dati non valido.\n" + error);
    }
  }
}
