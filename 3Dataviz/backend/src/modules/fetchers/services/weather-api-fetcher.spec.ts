jest.mock("../config", () => ({
  WEATHER_API_CONFIG: {
    START_DATE: "2023-01-01",
    END_DATE: "2023-01-02",
    CITIES: [
      { id: 0, name: "Francoforte", latitude: 0, longitude: 0 },
      { id: 1, name: "Parigi", latitude: 0, longitude: 0 },
    ],
    BASE_URL: "https://api.example.com/weather",
    LEGEND: {
      x: "Ore",
      y: "Temperatura (°C)",
      z: "Città",
    },
  },
}));

jest.mock("axios");

import { Test, TestingModule } from "@nestjs/testing";
import { WeatherApiFetcher } from "./weather-api-fetcher";
import { WEATHER_API_CONFIG } from "../config";
import { WeatherData } from "../interfaces/weather-data.interface";
import axios from "axios";
import { Dataset } from "src/interfaces/dataset.interface";

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("WeatherApiService", () => {
  let weatherApiFetcher: WeatherApiFetcher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherApiFetcher],
    }).compile();

    weatherApiFetcher = module.get<WeatherApiFetcher>(WeatherApiFetcher);
    mockedAxios.get = jest.fn();
  });

  it("should be defined", () => {
    expect(weatherApiFetcher).toBeDefined();
  });

  it("should return the correct name", () => {
    const name = weatherApiFetcher.getName();
    expect(name).toBe(WEATHER_API_CONFIG.NAME);
  });

  it("should return the correct size", () => {
    const size = weatherApiFetcher.getSize();
    const numDays = 2; // 2023-01-01 to 2023-01-02
    const expectedSize = [numDays * 24, WEATHER_API_CONFIG.CITIES.length];
    expect(size).toEqual(expectedSize);
  });

  it("should return the correct description", () => {
    const description = weatherApiFetcher.getDescription();
    expect(description).toBe(WEATHER_API_CONFIG.DESCRIPTION);
  });

  it("should fetch data and return transformed dataset", async () => {
    // Simuliamo la risposta API con dati fittizi
    const mockWeatherData: WeatherData[] = [
      {
        hourly: {
          time: ["2025-01-01T12:00:00", "2025-01-01T13:00:00"],
          temperature_2m: [20, 21],
        },
      },
      {
        hourly: {
          time: ["2025-01-01T12:00:00", "2025-01-01T13:00:00"],
          temperature_2m: [22, 23],
        },
      },
    ];

    // Simuliamo la risposta di Axios
    (mockedAxios.get as jest.Mock).mockResolvedValue({ data: mockWeatherData });

    // Chiamata al metodo pubblico fetchData()
    const result = await weatherApiFetcher.fetchData();

    // Verifica che il risultato sia stato trasformato (controllo generico)
    expect(result).toBeDefined();

    const expectedResult: Dataset = {
      data: [
        {
          id: 0,
          x: 0,
          y: 20,
          z: 0,
        },
        {
          id: 2,
          x: 1,
          y: 21,
          z: 0,
        },
        {
          id: 1,
          x: 0,
          y: 22,
          z: 1,
        },
        {
          id: 3,
          x: 1,
          y: 23,
          z: 1,
        },
      ],
      legend: WEATHER_API_CONFIG.LEGEND,
      xLabels: ["2025-01-01T12:00:00", "2025-01-01T13:00:00"],
      zLabels: ["Francoforte", "Parigi"],
    };
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error if axios fails", async () => {
    // Simuliamo un errore di rete
    (mockedAxios.get as jest.Mock).mockRejectedValue(
      new Error("Network Error"),
    );

    await expect(weatherApiFetcher.fetchData()).rejects.toThrow(
      "Errore nel recupero dei dati\nError: Network Error",
    );
  });

  it("should throw an error if data format is invalid", async () => {
    // Simuliamo una risposta API con formato non valido
    const mockWeatherData = [
      {
        hourly: {
          time: ["2025-01-01T12:00:00", "2025-01-01T13:00:00"],
        },
      },
    ];

    (mockedAxios.get as jest.Mock).mockResolvedValue({ data: mockWeatherData });

    await expect(weatherApiFetcher.fetchData()).rejects.toThrow(
      "Errore nel recupero dei dati\nError: Formato dei dati non valido",
    );
  });
});
