import { Test, TestingModule } from "@nestjs/testing";
import { DataSourceService } from "./data-source.service";
import { BaseFetcher } from "./base-fetcher";
import { Dataset } from "../../../interfaces/dataset.interface";
import { Legend } from "../../../interfaces/legend.interface";

// Creazione di una classe mock per BaseFetcher
class MockFetcher extends BaseFetcher {
  getName(): string {
    return "Mock Name";
  }

  getSize(): [number, number] {
    return [10, 5];
  }

  getDescription(): string {
    return "Mock Description";
  }

  fetchData(): Promise<Dataset> {
    return Promise.resolve({
      data: [],
      legend: {
        x: "",
        y: "",
        z: "",
      } as Legend,
      xLabels: [],
      zLabels: [],
    });
  }

  transformData(): Dataset {
    return {
      data: [],
      legend: {
        x: "",
        y: "",
        z: "",
      } as Legend,
      xLabels: [],
      zLabels: [],
    };
  }
}

describe("DataSourceService", () => {
  let service: DataSourceService;
  let mockFetcher1: MockFetcher;
  let mockFetcher2: MockFetcher;

  beforeEach(async () => {
    mockFetcher1 = new MockFetcher();
    mockFetcher2 = new MockFetcher();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataSourceService,
        {
          provide: "FETCHERS",
          useValue: [mockFetcher1, mockFetcher2],
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
    expect(sources[0].name).toBe(mockFetcher1.getName());
    expect(sources[1].name).toBe(mockFetcher2.getName());
    expect(sources[0].size).toEqual(mockFetcher1.getSize());
    expect(sources[1].size).toEqual(mockFetcher2.getSize());
    expect(sources[0].description).toBe(mockFetcher1.getDescription());
    expect(sources[1].description).toBe(mockFetcher2.getDescription());
  });
});
