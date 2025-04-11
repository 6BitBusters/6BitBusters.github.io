import { Test, TestingModule } from "@nestjs/testing";
import { DataSourceService } from "./data-source.service";
import { BaseFetcher } from "../../fetchers/services/base-fetcher";

// Creazione di una classe mock per BaseFetcher
const mockDataset = {
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

describe("DataSourceService", () => {
  let service: DataSourceService;
  let mockFetcher0: MockFetcher;
  let mockFetcher1: MockFetcher;

  beforeEach(async () => {
    mockFetcher0 = new MockFetcher();
    mockFetcher1 = new MockFetcher();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataSourceService,
        {
          provide: "FETCHERS",
          useValue: [mockFetcher0, mockFetcher1],
        },
      ],
    }).compile();

    service = module.get<DataSourceService>(DataSourceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return an array of data sources", () => {
    const sources = service.getSources();
    expect(sources).toHaveLength(2);
    expect(sources[0].id).toEqual(0);
    expect(sources[1].id).toEqual(1);
    expect(sources[0].name).toBe(mockFetcher0.getName());
    expect(sources[1].name).toBe(mockFetcher1.getName());
    expect(sources[0].size).toEqual(mockFetcher0.getSize());
    expect(sources[1].size).toEqual(mockFetcher1.getSize());
    expect(sources[0].description).toBe(mockFetcher0.getDescription());
    expect(sources[1].description).toBe(mockFetcher1.getDescription());
  });
});
