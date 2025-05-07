import { CurrencyApiFetcher } from "../services/currency-api-fetcher";
import { FlightsApiFetcher } from "../services/flights-api-fetcher";
import { PopulationApiFetcher } from "../services/population-api-fetcher";
import { WeatherApiFetcher } from "../services/weather-api-fetcher";
import { BaseFetcher } from "../interfaces/base-fetcher.interface";

export const fetchersFactory = (): BaseFetcher[] => {
  return [
    new CurrencyApiFetcher(),
    new FlightsApiFetcher(),
    new PopulationApiFetcher(),
    new WeatherApiFetcher(),
  ];
};
