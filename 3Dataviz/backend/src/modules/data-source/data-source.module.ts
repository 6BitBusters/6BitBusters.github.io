import { Module } from "@nestjs/common";
import { DataSourceController } from "./controllers/data-source.controller";
import { DataSourceService } from "./services/data-source.service";
import { CurrencyApiFetcher } from "../fetchers/services/currency-api-fetcher";
import { ConfigService } from "@nestjs/config";
import { WeatherApiFetcher } from "../fetchers/services/weather-api-fetcher";
import { FlightsApiFetcher } from "../fetchers/services/flights-api-fetcher";
import { PopulationApiFetcher } from "../fetchers/services/population-api-fetcher";

@Module({
  controllers: [DataSourceController],
  providers: [
    DataSourceService,
    {
      provide: "FETCHERS",
      useFactory: (configService: ConfigService) => {
        return [
          new CurrencyApiFetcher(configService),
          new FlightsApiFetcher(),
          new PopulationApiFetcher(),
          new WeatherApiFetcher(),
        ];
      },
      inject: [ConfigService],
    },
  ],
})
export class DataSourceModule {}
