import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { DataVisualizationModule } from "../src/modules/data-visualization/data-visualization.module";
import { DataVisualizationService } from "../src/modules/data-visualization/services/data-visualization.service";
import { fetchersFactory } from "../src/modules/fetchers/factories/fetchers.factory";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "../src/modules/cache/services/cache.service";

describe("DataVisualizationController (e2e)", () => {
  let app: INestApplication<App>;
  let service: DataVisualizationService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataVisualizationModule],
      providers: [
        DataVisualizationService,
        CacheService,
        {
          provide: "FETCHERS",
          useFactory: fetchersFactory,
        },
        ConfigService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<DataVisualizationService>(
      DataVisualizationService,
    );
    await app.init();
  });

  it("should fetch the correct dataset", () => {
    const id = 3;
    return request(app.getHttpServer())
      .get(`/data-visualization/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(service.getDatasetById(id));
      });
  });
});
