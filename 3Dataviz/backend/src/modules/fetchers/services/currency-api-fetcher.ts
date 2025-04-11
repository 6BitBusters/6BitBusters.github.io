import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";
import axios from "axios";
import { CURRENCY_API_CONFIG } from "../config";
import { Dataset } from "../../../interfaces/dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";
import { ConfigService } from "@nestjs/config";
import { CurrencyData } from "../interfaces/currency-data.interface";

@Injectable()
export class CurrencyApiFetcher extends BaseFetcher {
  constructor(private configService: ConfigService) {
    super();
  }

  private buildUrl(year: number): string {
    const baseUrl = CURRENCY_API_CONFIG.BASE_URL;
    const apiKey = this.configService.get<string>("CURRENCY_API_KEY");
    if (!apiKey) {
      throw new Error("API key non trovata.");
    }
    const url = baseUrl
      .replace("@API_KEY@", apiKey)
      .replace("@YEAR@", year.toString());
    return url;
  }

  getName(): string {
    return CURRENCY_API_CONFIG.NAME;
  }

  getSize(): [number, number] {
    const numYears =
      CURRENCY_API_CONFIG.END_YEAR - CURRENCY_API_CONFIG.START_YEAR + 1;
    const numCurrencies = CURRENCY_API_CONFIG.NUM_CURRENCIES;
    return [numYears, numCurrencies];
  }

  getDescription(): string {
    return CURRENCY_API_CONFIG.DESCRIPTION;
  }

  async fetchData(): Promise<Dataset> {
    const data: CurrencyData[] = [];
    try {
      for (
        let year = CURRENCY_API_CONFIG.START_YEAR;
        year <= CURRENCY_API_CONFIG.END_YEAR;
        year++
      ) {
        const url = this.buildUrl(year);
        const response = await axios.get<CurrencyData>(url);
        data.push(response.data);
      }
      const dataset = this.transformData(data);
      return dataset;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Errore nel recupero dei dati\n${error}`,
      );
    }
  }

  protected transformData(data: CurrencyData[]): Dataset {
    const entries: Entry[] = [];
    const legend: Legend = CURRENCY_API_CONFIG.LEGEND;

    const numYears = this.getSize()[0];
    const xLabels = Array.from({ length: numYears }, (_, offset) => {
      return (CURRENCY_API_CONFIG.START_YEAR + offset).toString();
    });
    const zLabelsSet = new Set<string>();
    for (const record of data) {
      for (const currencyCode in record.rates) {
        zLabelsSet.add(currencyCode);
      }
    }
    const zLabels = Array.from(zLabelsSet);

    try {
      for (let xIndex = 0; xIndex < numYears; xIndex++) {
        for (let zIndex = 0; zIndex < zLabels.length; zIndex++) {
          const currencyCode = zLabels[zIndex];
          // Se il tasso di cambio non è disponibile, imposta a 0
          const value = data[xIndex].rates[currencyCode] ?? 0;
          if (typeof value !== "number") {
            throw new Error(`Atteso number, ricevuto ${typeof value}`);
          }
          const entry: Entry = {
            id: xIndex * zLabels.length + zIndex,
            x: xIndex,
            y: value,
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
      throw new Error(`Formato dei dati non valido\n${error}`);
    }
  }
}
