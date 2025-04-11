import { fetchersFactory } from "./fetchers.factory";
import { ConfigService } from "@nestjs/config";

describe("fetchersFactory", () => {
  it("should return an array of fetchers", () => {
    const mockConfigService = {
      get: jest.fn(),
    } as unknown as ConfigService;

    const fetchers = fetchersFactory(mockConfigService);

    expect(fetchers).toHaveLength(4);
    expect(fetchers[0].constructor.name).toBe("CurrencyApiFetcher");
    expect(fetchers[3].constructor.name).toBe("WeatherApiFetcher");
  });
});
