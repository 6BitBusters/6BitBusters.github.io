jest.mock("../config", () => ({
  POPULATION_API_CONFIG: {
    START_YEAR: 2022,
    END_YEAR: 2023,
    COUNTRIES: [
      { id: 0, name: "Germania", countryCode: "DEU" },
      { id: 1, name: "Francia", countryCode: "FRA" },
    ],
    BASE_URL: "https://api.example.com/population",
    LEGEND: {
      x: "Anno",
      y: "Popolazione",
      z: "Paese",
    },
  },
}));

jest.mock("axios");

import { Test, TestingModule } from "@nestjs/testing";
import { PopulationApiFetcher } from "./population-api-fetcher";
import { POPULATION_API_CONFIG } from "../config";
import { PopulationData } from "./population-api-fetcher";
import axios from "axios";
import { Dataset } from "src/interfaces/dataset.interface";

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PopulationApiFetcher", () => {
  let populationApiFetcher: PopulationApiFetcher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PopulationApiFetcher],
    }).compile();

    populationApiFetcher =
      module.get<PopulationApiFetcher>(PopulationApiFetcher);
    mockedAxios.get = jest.fn();
  });

  it("should be defined", () => {
    expect(populationApiFetcher).toBeDefined();
  });

  it("should return the correct name", () => {
    const name = populationApiFetcher.getName();
    expect(name).toBe(POPULATION_API_CONFIG.NAME);
  });

  it("should return the correct size", () => {
    const size = populationApiFetcher.getSize();
    const numYears =
      POPULATION_API_CONFIG.END_YEAR - POPULATION_API_CONFIG.START_YEAR + 1;
    const expectedSize = [numYears, POPULATION_API_CONFIG.COUNTRIES.length];
    expect(size).toEqual(expectedSize);
  });

  it("should return the correct description", () => {
    const description = populationApiFetcher.getDescription();
    expect(description).toBe(POPULATION_API_CONFIG.DESCRIPTION);
  });

  it("should fetch data and return transformed dataset", async () => {
    // Simuliamo la risposta API con dati fittizi
    const mockPopulationData: PopulationData[] = [
      [
        { countryiso3code: "FRA", date: "2022", value: 60000000 },
        { countryiso3code: "DEU", date: "2023", value: 70000000 },
        { countryiso3code: "DEU", date: "2022", value: 68000000 },
        { countryiso3code: "FRA", date: "2023", value: 62000000 },
      ],
    ];

    // Simuliamo la risposta di Axios
    (mockedAxios.get as jest.Mock).mockResolvedValue({
      data: mockPopulationData,
    });

    // Chiamata al metodo pubblico fetchData()
    const result = await populationApiFetcher.fetchData();

    // Verifica che axios sia stato chiamato con qualche URL (non conosciamo il valore esatto)
    expect(mockedAxios.get).toHaveBeenCalled();

    // Verifica che il risultato sia stato trasformato (controllo generico)
    expect(result).toBeDefined();

    const expectedResult: Dataset = {
      data: [
        {
          id: 1,
          x: 0,
          y: 60,
          z: 1,
        },
        {
          id: 2,
          x: 1,
          y: 70,
          z: 0,
        },
        {
          id: 0,
          x: 0,
          y: 68,
          z: 0,
        },
        {
          id: 3,
          x: 1,
          y: 62,
          z: 1,
        },
      ],
      legend: POPULATION_API_CONFIG.LEGEND,
      xLabels: ["2022", "2023"],
      zLabels: ["Germania", "Francia"],
    };
    expect(result).toEqual(expectedResult);
  });

  it("should throw an error if axios fails", async () => {
    // Simuliamo un errore di rete
    (mockedAxios.get as jest.Mock).mockRejectedValue(
      new Error("Network Error"),
    );

    await expect(populationApiFetcher.fetchData()).rejects.toThrow(
      "Errore nel recupero dei dati.\nError: Network Error",
    );
  });

  it("should throw an error if data format is invalid", async () => {
    // Simuliamo una risposta API con formato non valido
    const mockPopulationData = [[{ value: 68 }]];

    (mockedAxios.get as jest.Mock).mockResolvedValue({
      data: mockPopulationData,
    });

    await expect(populationApiFetcher.fetchData()).rejects.toThrow(
      "Errore nel recupero dei dati.\nError: Formato dei dati non valido",
    );
  });
});
