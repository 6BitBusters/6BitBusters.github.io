import { Test, TestingModule } from "@nestjs/testing";
import { DataSourceController } from "./data-source.controller";
import { DataSourceService } from "../services/data-source.service";

describe("DataSourceController", () => {
  let controller: DataSourceController;
  let service: DataSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataSourceController],
      providers: [
        {
          provide: DataSourceService,
          useValue: {
            getSources: jest.fn().mockReturnValue([
              {
                id: 1,
                name: "Source 1",
                size: [100, 20],
                description: "A data source",
              },
            ]), // Mock del servizio
          },
        },
      ],
    }).compile();

    controller = module.get<DataSourceController>(DataSourceController);
    service = module.get<DataSourceService>(DataSourceService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return an array of data sources", () => {
    const result = [
      {
        id: 1,
        name: "Source 1",
        size: [100, 20] as [number, number],
        description: "A data source",
      },
    ];
    const spy = jest.spyOn(service, "getSources").mockReturnValue(result);
    const sources = controller.getSources();
    expect(spy).toHaveBeenCalled();
    expect(sources).toEqual(result);
  });
});
