import {
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { BaseFetcher } from "../interfaces/base-fetcher.interface";
import { BaseApiFetcher } from "./base-api-fetcher";
import axios from "axios";
import { FLIGHTS_API_CONFIG } from "../config";
import { RawDataset } from "../../../interfaces/raw-dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";
import {
  FlightsData,
  FlightsRecord,
} from "../interfaces/flights-data.interface";

@Injectable()
export class FlightsApiFetcher
  extends BaseApiFetcher<FlightsData>
  implements BaseFetcher
{
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

  getLegend(): Legend {
    return FLIGHTS_API_CONFIG.LEGEND;
  }

  protected async fetchData(): Promise<FlightsData> {
    const data: FlightsData = {};
    try {
      for (const airport of FLIGHTS_API_CONFIG.AIRPORTS) {
        const url = this.buildUrl(airport.airportCode);
        const responseData = await axios
          .get<FlightsRecord[]>(url)
          .then((response): FlightsRecord[] => response.data)
          .catch((error): FlightsRecord[] => {
            if (
              axios.isAxiosError(error) &&
              error.response?.status === HttpStatus.NOT_FOUND
            ) {
              // Se 404, restituisci array vuoto
              return [];
            } else {
              throw error;
            }
          });
        data[airport.airportCode] = responseData;
      }
      return data;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Errore nel recupero dei dati\n${error}`,
      );
    }
  }

  protected transformData(data: FlightsData): RawDataset {
    const entries: Entry[] = [];
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
        const day = this.formatShortDate(startDate);
        
        const intervalSeconds = FLIGHTS_API_CONFIG.INTERVAL_DURATION;
        const intervalDurationInHours = intervalSeconds / 3600;

        const startHour = startDate.getUTCHours();
        const endHour = (startHour + intervalDurationInHours) % 24;

        return `${day} ${startHour}-${endHour}`;
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
      const dataset: RawDataset = {
        data: entries,
        xLabels: xLabels,
        zLabels: zLabels,
      };
      return dataset;
    } catch (error) {
      throw new Error(`Formato dei dati non valido\n${error}`);
    }
  }

  private formatShortDate(date: Date): string {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    return `${day}/${month}`;
  }
}
