import { Module } from "@nestjs/common";
import { CurrencyApiFetcher } from "./services/currency-api-fetcher";
import { FlightsApiFetcher } from "./services/flights-api-fetcher";
import { PopulationApiFetcher } from "./services/population-api-fetcher";
import { WeatherApiFetcher } from "./services/weather-api-fetcher";

@Module({
  providers: [
    CurrencyApiFetcher,
    FlightsApiFetcher,
    PopulationApiFetcher,
    WeatherApiFetcher,
  ],
  exports: [
    CurrencyApiFetcher,
    FlightsApiFetcher,
    PopulationApiFetcher,
    WeatherApiFetcher,
  ],
})
export class FetchersModule {}
