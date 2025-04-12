import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { DataSourceModule } from "../src/modules/data-source/data-source.module";
import { DataSourceService } from "../src/modules/data-source/services/data-source.service";
import { DataSourceDto } from "../src/modules/data-source/dto/data-source.dto";
import { ConfigService } from "@nestjs/config";
import { fetchersFactory } from "../src/modules/fetchers/factories/fetchers.factory";

describe("DataSourceController (e2e)", () => {
  let app: INestApplication<App>;
  let service: DataSourceService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataSourceModule],
      providers: [
        DataSourceService,
        {
          provide: "FETCHERS",
          useFactory: fetchersFactory,
          inject: [ConfigService],
        },
        ConfigService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<DataSourceService>(DataSourceService);
    await app.init();
  });

  it("should return the array of data sources", () => {
    return request(app.getHttpServer())
      .get("/data-source")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(4);
        expect((res.body as Array<DataSourceDto>)[0]).toEqual(
          service.getSources()[0],
        );
      });
  });
});
