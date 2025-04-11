import { Test, TestingModule } from "@nestjs/testing";
import { DataVisualizationService } from "./data-visualization.service";
import { Dataset } from "src/interfaces/dataset.interface";
import { BaseFetcher } from "../../../modules/fetchers/services/base-fetcher";
import { CacheService } from "../../../modules/cache/services/cache.service";

// Creazione di una classe mock per BaseFetcher
const mockDataset: Dataset = {
  data: [{ id: 0, x: 0, y: 0, z: 0 }],
  legend: { x: "X", y: "Y", z: "Z" },
  xLabels: ["Label 1"],
  zLabels: ["Label 1"],
};
class MockFetcher extends BaseFetcher {
  getName = jest.fn(() => "Mock Name");
  getSize = jest.fn(() => [10, 5] as [number, number]);
  getDescription = jest.fn(() => "Mock Description");

  fetchData = jest.fn(() => Promise.resolve(mockDataset));
  transformData = jest.fn(() => mockDataset);
}

describe("DataVisualizationService", () => {
  let service: DataVisualizationService;
  let cacheService: CacheService;
  let mockFetcher0: MockFetcher;
  let mockFetcher1: MockFetcher;

  beforeEach(async () => {
    mockFetcher0 = new MockFetcher();
    mockFetcher1 = new MockFetcher();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataVisualizationService,
        CacheService,
        {
          provide: "FETCHERS",
          useValue: [mockFetcher0, mockFetcher1],
        },
      ],
    }).compile();

    service = module.get<DataVisualizationService>(DataVisualizationService);
    cacheService = module.get<CacheService>(CacheService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should throw an error if fetcher is not found", async () => {
    await expect(service.getDatasetById(-1)).rejects.toThrow(
      "Invalid fetcher ID",
    );
    // Controllo con un ID uguale al numero di fetcher
    await expect(service.getDatasetById(2)).rejects.toThrow(
      "Invalid fetcher ID",
    );
  });

  it("should get the dataset if cached", async () => {
    cacheService.getDatasetFromCache = jest.fn(() => mockDataset);
    const id = 0;
    const dataset = await service.getDatasetById(id);
    expect(dataset).toEqual(mockDataset);
  });

  it("should fetch data from the correct fetcher if not cached", async () => {
    cacheService.getDatasetFromCache = jest.fn(() => null);
    const dataset = await service.getDatasetById(0);
    expect(dataset).toEqual(mockDataset);
    expect(mockFetcher0.fetchData).toHaveBeenCalled();
  });

  it("should save the dataset to cache", async () => {
    cacheService.getDatasetFromCache = jest.fn(() => null);
    const spy = jest.spyOn(cacheService, "saveDatasetToCache");
    const id = 0;
    await service.getDatasetById(id);
    expect(spy).toHaveBeenCalledWith(id, mockDataset);
  });
});
