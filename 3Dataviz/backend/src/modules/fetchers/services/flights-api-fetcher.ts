import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";
import axios from "axios";
import { FLIGHTS_API_CONFIG } from "../config";
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
    const startDatetime = FLIGHTS_API_CONFIG.START_DATETIME;
    const endDatetime =
      FLIGHTS_API_CONFIG.START_DATETIME +
      FLIGHTS_API_CONFIG.NUM_INTERVALS * FLIGHTS_API_CONFIG.INTERVAL_DURATION -
      1;
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
    const data: FlightsData = {};
    try {
      for (const airport of FLIGHTS_API_CONFIG.AIRPORTS) {
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
    const legend: Legend = FLIGHTS_API_CONFIG.LEGEND;
    const xLabels = Array.from(
      { length: FLIGHTS_API_CONFIG.NUM_INTERVALS },
      (_, index) => {
        const startDate = new Date(
          FLIGHTS_API_CONFIG.START_DATETIME * 1000 +
            index * FLIGHTS_API_CONFIG.INTERVAL_DURATION * 1000,
        );
        const endDate = new Date(
          startDate.getTime() +
            (FLIGHTS_API_CONFIG.INTERVAL_DURATION - 1) * 1000,
        );
        const day = formatDate(startDate);
        const startTime = formatTime(startDate);
        const endTime = formatTime(endDate);
        return `${day} ${startTime} - ${endTime}`;
      },
    );
    const zLabels = FLIGHTS_API_CONFIG.AIRPORTS.map((airport) => airport.name);
    try {
      FLIGHTS_API_CONFIG.AIRPORTS.forEach((airport, zIndex) => {
        for (let i = 0; i < FLIGHTS_API_CONFIG.NUM_INTERVALS; i++) {
          // Filtra i record per l'aeroporto e la fascia oraria
          const records = data[airport.airportCode].filter(
            (record) =>
              record.firstSeen >=
                FLIGHTS_API_CONFIG.START_DATETIME +
                  i * FLIGHTS_API_CONFIG.INTERVAL_DURATION &&
              record.firstSeen <
                FLIGHTS_API_CONFIG.START_DATETIME +
                  (i + 1) * FLIGHTS_API_CONFIG.INTERVAL_DURATION,
          );
          const xIndex = i;
          const index = i * FLIGHTS_API_CONFIG.AIRPORTS.length + zIndex;
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
