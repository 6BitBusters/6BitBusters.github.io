import { ConfigService } from "@nestjs/config";
import { CurrencyApiFetcher } from "../services/currency-api-fetcher";
import { FlightsApiFetcher } from "../services/flights-api-fetcher";
import { PopulationApiFetcher } from "../services/population-api-fetcher";
import { WeatherApiFetcher } from "../services/weather-api-fetcher";
import { BaseFetcher } from "../services/base-fetcher";

export const fetchersFactory = (
  configService: ConfigService,
): BaseFetcher[] => {
  return [
    new CurrencyApiFetcher(configService),
    new FlightsApiFetcher(),
    new PopulationApiFetcher(),
    new WeatherApiFetcher(),
  ];
};
