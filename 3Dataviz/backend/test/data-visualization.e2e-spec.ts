import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { DataVisualizationModule } from "../src/modules/data-visualization/data-visualization.module";
import { DataVisualizationService } from "../src/modules/data-visualization/services/data-visualization.service";

const mockDataset = [
  {
    id: 1,
    name: "Source 1",
    size: [100, 20],
    description: "A data source",
  },
];

describe("DataVisualizationController (e2e)", () => {
  let app: INestApplication<App>;
  const dataVisualizationService = {
    getSources: jest.fn().mockReturnValue(mockDataset),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataVisualizationModule],
    })
      .overrideProvider(DataVisualizationService)
      .useValue(dataVisualizationService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/data-visualization (GET)", () => {
    return request(app.getHttpServer())
      .get("/data-visualization")
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(mockDataset[0]);
      });
  });
});
