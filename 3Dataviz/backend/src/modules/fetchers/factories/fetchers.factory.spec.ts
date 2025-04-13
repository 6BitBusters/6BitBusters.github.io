import { fetchersFactory } from "./fetchers.factory";

describe("fetchersFactory", () => {
  it("should return an array of fetchers", () => {
    const fetchers = fetchersFactory();

    expect(fetchers).toHaveLength(4);
    expect(fetchers[0].constructor.name).toBe("CurrencyApiFetcher");
    expect(fetchers[3].constructor.name).toBe("WeatherApiFetcher");
  });
});
