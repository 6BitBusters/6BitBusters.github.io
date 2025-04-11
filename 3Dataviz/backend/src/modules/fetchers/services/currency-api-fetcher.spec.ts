jest.mock("../config", () => ({
  CURRENCY_API_CONFIG: {
    START_YEAR: 2000,
    END_YEAR: 2001,
    NUM_CURRENCIES: 3,
    BASE_URL: "https://api.example.com/currency",
    LEGEND: {
      x: "Anno",
      y: "Tasso",
      z: "Valuta",
    },
  },
}));

jest.mock("axios");

jest.mock("@nestjs/config");

import { Test, TestingModule } from "@nestjs/testing";
import { CurrencyApiFetcher } from "./currency-api-fetcher";
import { CURRENCY_API_CONFIG } from "../config";
import { CurrencyData } from "../interfaces/currency-data.interface";
import axios from "axios";
import { Dataset } from "src/interfaces/dataset.interface";
import { ConfigService } from "@nestjs/config";

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CurrencyApiFetcher", () => {
  let currencyApiFetcher: CurrencyApiFetcher;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyApiFetcher,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("API_KEY"), // Mock del servizio
          },
        },
      ],
    }).compile();

    currencyApiFetcher = module.get<CurrencyApiFetcher>(CurrencyApiFetcher);
    configService = module.get<ConfigService>(ConfigService);
    mockedAxios.get = jest.fn();
  });

  it("should be defined", () => {
    expect(currencyApiFetcher).toBeDefined();
  });

  it("should return the correct name", () => {
    const name = currencyApiFetcher.getName();
    expect(name).toBe(CURRENCY_API_CONFIG.NAME);
  });

  it("should return the correct size", () => {
    const size = currencyApiFetcher.getSize();
    const numYears =
      CURRENCY_API_CONFIG.END_YEAR - CURRENCY_API_CONFIG.START_YEAR + 1;
    const expectedSize = [numYears, CURRENCY_API_CONFIG.NUM_CURRENCIES];
    expect(size).toEqual(expectedSize);
  });

  it("should return the correct description", () => {
    const description = currencyApiFetcher.getDescription();
    expect(description).toBe(CURRENCY_API_CONFIG.DESCRIPTION);
  });

  it("should fetch data and return transformed dataset", async () => {
    // Simuliamo la risposta API con dati fittizi
    const mockCurrencyData: CurrencyData[] = [
      {
        rates: {
          USD: 1.2,
          GBP: 0.9,
          JPY: 130,
        },
      },
      {
        rates: {
          USD: 1.3,
          GBP: 0.85,
        },
      },
    ];

    // Simuliamo la risposta di Axios
    (mockedAxios.get as jest.Mock)
      .mockResolvedValueOnce({
        data: mockCurrencyData[0],
      })
      .mockResolvedValueOnce({
        data: mockCurrencyData[1],
      });
    // Chiamata al metodo pubblico fetchData()
    const result = await currencyApiFetcher.fetchData();

    // Verifica che il risultato sia stato trasformato (controllo generico)
    expect(result).toBeDefined();

    const expectedResult: Dataset = {
      data: [
        {
          id: 0,
          x: 0,
          y: 1.2,
          z: 0,
        },
        {
          id: 1,
          x: 0,
          y: 0.9,
          z: 1,
        },
        {
          id: 2,
          x: 0,
          y: 130,
          z: 2,
        },
        {
          id: 3,
          x: 1,
          y: 1.3,
          z: 0,
        },
        {
          id: 4,
          x: 1,
          y: 0.85,
          z: 1,
        },
        {
          id: 5,
          x: 1,
          y: 0,
          z: 2,
        },
      ],
      legend: CURRENCY_API_CONFIG.LEGEND,
      xLabels: ["2000", "2001"],
      zLabels: ["USD", "GBP", "JPY"],
    };
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error if API key is not found", async () => {
    // Simuliamo la mancanza della chiave API
    (configService.get as jest.Mock).mockReturnValue(undefined);

    await expect(currencyApiFetcher.fetchData()).rejects.toThrow(
      "API key non trovata",
    );
  });

  it("should throw an error if axios fails", async () => {
    // Simuliamo un errore di rete
    (mockedAxios.get as jest.Mock).mockRejectedValue(
      new Error("Network Error"),
    );

    await expect(currencyApiFetcher.fetchData()).rejects.toThrow(
      "Errore nel recupero dei dati\nError: Network Error",
    );
  });

  it("should throw an error if data format is invalid", async () => {
    // Simuliamo una risposta API con formato non valido
    const mockCurrencyData = { rates: [{ USD: "0" }] };

    (mockedAxios.get as jest.Mock).mockResolvedValue({
      data: mockCurrencyData,
    });

    await expect(currencyApiFetcher.fetchData()).rejects.toThrow(
      "Errore nel recupero dei dati\nError: Formato dei dati non valido\nError: Atteso number, ricevuto object",
    );
  });
});
