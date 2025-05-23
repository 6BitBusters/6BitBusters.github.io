jest.mock("../config", () => ({
  FLIGHTS_API_CONFIG: {
    START_DATETIME: 0,
    NUM_INTERVALS: 2,
    INTERVAL_DURATION: 3600,
    AIRPORTS: [
      { id: 0, name: "Parigi", airportCode: "LFPG" },
      { id: 1, name: "Milano", airportCode: "LIMC" },
    ],
    BASE_URL: "https://api.example.com/flights",
    LEGEND: {
      x: "Fascia oraria",
      y: "Numero di partenze",
      z: "Aeroporto",
    },
  },
}));

jest.mock("axios");

import { Test, TestingModule } from "@nestjs/testing";
import { FlightsApiFetcher } from "./flights-api-fetcher";
import { FLIGHTS_API_CONFIG } from "../config";
import { FlightsData } from "../interfaces/flights-data.interface";
import axios from "axios";
import { RawDataset } from "src/interfaces/raw-dataset.interface";
import { Legend } from "src/interfaces/legend.interface";
import { HttpStatus } from "@nestjs/common";

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("FlightsApiFetcher", () => {
  let flightsApiFetcher: FlightsApiFetcher;
  const expectedResult: RawDataset = {
    data: [],
    xLabels: ["1/1 0-1", "1/1 1-2"],
    zLabels: ["Parigi", "Milano"],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlightsApiFetcher],
    }).compile();

    flightsApiFetcher = module.get<FlightsApiFetcher>(FlightsApiFetcher);
    mockedAxios.get = jest.fn();
  });

  it("should be defined", () => {
    expect(flightsApiFetcher).toBeDefined();
  });

  it("should return the correct name", () => {
    const name = flightsApiFetcher.getName();
    expect(name).toBe(FLIGHTS_API_CONFIG.NAME);
  });

  it("should return the correct size", () => {
    const size = flightsApiFetcher.getSize();
    const expectedSize = [
      FLIGHTS_API_CONFIG.NUM_INTERVALS,
      FLIGHTS_API_CONFIG.AIRPORTS.length,
    ];
    expect(size).toEqual(expectedSize);
  });

  it("should return the correct description", () => {
    const description = flightsApiFetcher.getDescription();
    expect(description).toBe(FLIGHTS_API_CONFIG.DESCRIPTION);
  });

  it("should return the correct legend", () => {
    const legend: Legend = flightsApiFetcher.getLegend();
    expect(legend).toEqual(FLIGHTS_API_CONFIG.LEGEND);
  });

  it("should fetch data and return transformed dataset", async () => {
    // Simuliamo la risposta API con dati fittizi
    const mockFlightsData: FlightsData = {
      LFPG: [{ firstSeen: 10 }, { firstSeen: 20 }, { firstSeen: 3630 }],
      LIMC: [{ firstSeen: 15 }, { firstSeen: 3625 }, { firstSeen: 3600 }],
    };

    // Simuliamo la risposta di Axios
    (mockedAxios.get as jest.Mock)
      .mockResolvedValueOnce({
        data: mockFlightsData["LFPG"],
      })
      .mockResolvedValueOnce({
        data: mockFlightsData["LIMC"],
      });

    // Chiamata al metodo pubblico getDataset()
    const result = await flightsApiFetcher.getDataset();

    // Verifica che il risultato sia stato trasformato (controllo generico)
    expect(result).toBeDefined();
    expectedResult.data = [
      {
        id: 0,
        x: 0,
        y: 2,
        z: 0,
      },
      {
        id: 2,
        x: 1,
        y: 1,
        z: 0,
      },
      {
        id: 1,
        x: 0,
        y: 1,
        z: 1,
      },
      {
        id: 3,
        x: 1,
        y: 2,
        z: 1,
      },
    ];
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error if axios fails", async () => {
    // Simula un errore di rete
    (mockedAxios.get as jest.Mock).mockRejectedValue(
      new Error("Network Error"),
    );

    await expect(flightsApiFetcher.getDataset()).rejects.toThrow(
      "Errore nel recupero dei dati\nError: Network Error",
    );
  });

  it("should throw an error if data format is invalid", async () => {
    // Simuliamo una risposta API con formato non valido
    const mockFlightsData = { departures: 12 };

    (mockedAxios.get as jest.Mock).mockResolvedValue({
      data: mockFlightsData,
    });

    await expect(flightsApiFetcher.getDataset()).rejects.toThrow(
      "Errore nel recupero dei dati\nError: Formato dei dati non valido\nTypeError: data[airport.airportCode].filter is not a function",
    );
  });

  it("should handle 404 error and return empty array", async () => {
    (mockedAxios.get as jest.Mock).mockRejectedValue({
      response: {
        status: HttpStatus.NOT_FOUND,
      },
    });
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

    const result = await flightsApiFetcher.getDataset();

    expectedResult.data = [
      {
        id: 0,
        x: 0,
        y: 0,
        z: 0,
      },
      {
        id: 2,
        x: 1,
        y: 0,
        z: 0,
      },
      {
        id: 1,
        x: 0,
        y: 0,
        z: 1,
      },
      {
        id: 3,
        x: 1,
        y: 0,
        z: 1,
      },
    ];
    expect(result).toEqual(expectedResult);
  });
});
