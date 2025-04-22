import { Test, TestingModule } from "@nestjs/testing";
import { DataVisualizationService } from "./data-visualization.service";
import { DatasetDto } from "../dto/dataset.dto";
import { BaseFetcher } from "../../../modules/fetchers/interfaces/base-fetcher.interface";
import { CacheRepository } from "../../cache/repository/cache.repository";

// Creazione di una classe mock per BaseFetcher
const mockDatasetDto: DatasetDto = {
  data: [{ id: 0, x: 0, y: 0, z: 0 }],
  legend: { x: "X", y: "Y", z: "Z" },
  xLabels: ["Label 1"],
  zLabels: ["Label 1"],
};
class MockFetcher implements BaseFetcher {
  getName = jest.fn(() => "Mock Name");
  getSize = jest.fn(() => [10, 5] as [number, number]);
  getDescription = jest.fn(() => "Mock Description");
  getLegend = jest.fn(() => ({
    x: "X",
    y: "Y",
    z: "Z",
  }));
  getDataset = jest.fn(() => Promise.resolve(mockDatasetDto));

  fetchData = jest.fn(() => Promise.resolve(mockDatasetDto));
  transformData = jest.fn(() => mockDatasetDto);
}

describe("DataVisualizationService", () => {
  let service: DataVisualizationService;
  let cacheRepository: CacheRepository;
  let mockFetcher0: MockFetcher;
  let mockFetcher1: MockFetcher;

  beforeEach(async () => {
    mockFetcher0 = new MockFetcher();
    mockFetcher1 = new MockFetcher();

    const mockCacheRepository = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataVisualizationService,
        {
          provide: "CACHE_REPOSITORY",
          useValue: mockCacheRepository,
        },
        {
          provide: "FETCHERS",
          useValue: [mockFetcher0, mockFetcher1],
        },
      ],
    }).compile();

    service = module.get<DataVisualizationService>(DataVisualizationService);
    cacheRepository = module.get<CacheRepository>("CACHE_REPOSITORY");
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
    cacheRepository.get = jest.fn().mockResolvedValue(mockDatasetDto);
    const id = 0;
    const dataset = await service.getDatasetById(id);
    expect(dataset).toEqual(mockDatasetDto);
    expect(cacheRepository.get).toHaveBeenCalledWith(id.toString());
  });

  it("should fetch data from the correct fetcher if not cached", async () => {
    cacheRepository.get = jest.fn().mockResolvedValue(null);
    cacheRepository.set = jest.fn();
    const dataset = await service.getDatasetById(0);
    expect(dataset).toEqual(mockDatasetDto);
    expect(mockFetcher0.getDataset).toHaveBeenCalled();
  });

  it("should save the dataset to cache", async () => {
    cacheRepository.get = jest.fn().mockResolvedValue(null);
    const spy = jest.spyOn(cacheRepository, "set").mockImplementation(() => {
      return Promise.resolve();
    });
    const id = 0;
    await service.getDatasetById(id);
    expect(spy).toHaveBeenCalledWith(id.toString(), mockDatasetDto);
  });
});
