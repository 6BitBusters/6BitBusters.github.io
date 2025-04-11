import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";
import axios from "axios";
import { flightsApiConfig } from "../config";
import { Dataset } from "../../../interfaces/dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";
import {
  FlightsData,
  FlightsRecord,
} from "../interfaces/flights-data.interface";
import { formatDate, formatTime } from "../../../common/utils/date-utils";

@Injectable()
export class FlightsApiFetcher extends BaseFetcher {
  private buildUrl(airportCode: string): string {
    const startDatetime = flightsApiConfig.START_DATETIME;
    const endDatetime =
      flightsApiConfig.START_DATETIME +
      flightsApiConfig.NUM_INTERVALS * flightsApiConfig.INTERVAL_DURATION -
      1;
    const baseUrl = flightsApiConfig.BASE_URL;
    const url = baseUrl
      .replace("@AIRPORT@", airportCode)
      .replace("@START_DATETIME@", startDatetime.toString())
      .replace("@END_DATETIME@", endDatetime.toString());
    return url;
  }

  getName(): string {
    return flightsApiConfig.NAME;
  }

  getSize(): [number, number] {
    const numIntervals = flightsApiConfig.NUM_INTERVALS;
    const numAirports = flightsApiConfig.AIRPORTS.length;
    return [numIntervals, numAirports];
  }

  getDescription(): string {
    return flightsApiConfig.DESCRIPTION;
  }

  async fetchData(): Promise<Dataset> {
    const data: FlightsData = {};
    try {
      for (const airport of flightsApiConfig.AIRPORTS) {
        const url = this.buildUrl(airport.airportCode);
        const responseData = await axios
          .get<FlightsRecord[]>(url)
          .then((response): FlightsRecord[] => response.data)
          .catch((error): FlightsRecord[] => {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              // Se 404, restituisci array vuoto
              return [];
            } else {
              throw error;
            }
          });
        data[airport.airportCode] = responseData;
      }
      const dataset = this.transformData(data);
      return dataset;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Errore nel recupero dei dati\n${error}`,
      );
    }
  }

  protected transformData(data: FlightsData): Dataset {
    const entries: Entry[] = [];
    const legend: Legend = flightsApiConfig.LEGEND;
    const xLabels = Array.from(
      { length: flightsApiConfig.NUM_INTERVALS },
      (_, index) => {
        const startDate = new Date(
          flightsApiConfig.START_DATETIME * 1000 +
            index * flightsApiConfig.INTERVAL_DURATION * 1000,
        );
        const endDate = new Date(
          startDate.getTime() + (flightsApiConfig.INTERVAL_DURATION - 1) * 1000,
        );
        const day = formatDate(startDate);
        const startTime = formatTime(startDate);
        const endTime = formatTime(endDate);
        return `${day} ${startTime} - ${endTime}`;
      },
    );
    const zLabels = flightsApiConfig.AIRPORTS.map((airport) => airport.name);
    try {
      flightsApiConfig.AIRPORTS.forEach((airport, zIndex) => {
        for (let i = 0; i < flightsApiConfig.NUM_INTERVALS; i++) {
          // Filtra i record per l'aeroporto e la fascia oraria
          const records = data[airport.airportCode].filter(
            (record) =>
              record.firstSeen >=
                flightsApiConfig.START_DATETIME +
                  i * flightsApiConfig.INTERVAL_DURATION &&
              record.firstSeen <
                flightsApiConfig.START_DATETIME +
                  (i + 1) * flightsApiConfig.INTERVAL_DURATION,
          );
          const xIndex = i;
          const index = i * flightsApiConfig.AIRPORTS.length + zIndex;
          const entry: Entry = {
            id: index,
            x: xIndex,
            // Numero di voli in partenza nell'i-esima fascia oraria
            y: records.length,
            z: zIndex,
          };
          entries.push(entry);
        }
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
