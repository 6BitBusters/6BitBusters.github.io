import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { DataSourceModule } from "../src/modules/data-source/data-source.module";
import { DataSourceService } from "../src/modules/data-source/services/data-source.service";
import { DataSourceDto } from "src/modules/data-source/dto/data-source.dto";

describe("DataSourceController (e2e)", () => {
  let app: INestApplication<App>;
  const dataSourceService = {
    getSources: jest.fn().mockReturnValue([
      {
        id: 1,
        name: "Source 1",
        size: [100, 20],
        description: "A data source",
      },
    ]),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataSourceModule],
    })
      .overrideProvider(DataSourceService)
      .useValue(dataSourceService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/data-source (GET)", () => {
    return request(app.getHttpServer())
      .get("/data-source")
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
        expect((res.body as Array<DataSourceDto>)[0]).toEqual({
          id: 1,
          name: "Source 1",
          size: [100, 20],
          description: "A data source",
        });
      });
  });
});
