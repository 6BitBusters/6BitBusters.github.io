import { Test, TestingModule } from "@nestjs/testing";
import { DataVisualizationController } from "./data-visualization.controller";
import { DataVisualizationService } from "../services/data-visualization.service";

describe("DataVisualizationController", () => {
  let controller: DataVisualizationController;
  let service: DataVisualizationService;
  const mockDataset = {
    data: [{ id: 1, x: 0, y: 0, z: 0 }],
    legend: { x: "X", y: "Y", z: "Z" },
    xLabels: ["Label 1"],
    zLabels: ["Label 1"],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataVisualizationController],
      providers: [
        {
          provide: DataVisualizationService,
          useValue: {
            getDatasetById: jest.fn().mockResolvedValue(mockDataset), // Mock del servizio
          },
        },
      ],
    }).compile();

    controller = module.get<DataVisualizationController>(
      DataVisualizationController,
    );
    service = module.get<DataVisualizationService>(DataVisualizationService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return a dataset", async () => {
    const dataset = await controller.getDataset(0);
    expect(dataset).toEqual(mockDataset);
  });

  it("should call getDatasetById with the correct id", async () => {
    const id = 0;
    const spy = jest.spyOn(service, "getDatasetById");
    await controller.getDataset(id);
    expect(spy).toHaveBeenCalledWith(id);
  });
});
