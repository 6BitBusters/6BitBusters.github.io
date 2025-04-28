import { Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CacheRepository } from "./cache.repository";
import { Client } from "memjs";

jest.mock("memjs", () => {
  const mockClient = {
    get: jest.fn((key: string) => {
      if (key === "testKey") {
        return Promise.resolve({
          value: Buffer.from(JSON.stringify({ test: "testValue" })),
        });
      }
      return Promise.resolve({ value: null });
    }),
    set: jest.fn(() => Promise.resolve(true)),
    quit: jest.fn(),
  };

  return {
    Client: {
      create: jest.fn(() => {
        return mockClient;
      }),
    },
  };
});

describe("CacheRepository", () => {
  let service: CacheRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheRepository],
    }).compile();

    service = module.get<CacheRepository>(CacheRepository);
    service.onModuleInit();

    jest.spyOn(Logger.prototype, "error").mockImplementation(() => {});
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should set and get a value", async () => {
    const key = "testKey";
    const value = { test: "testValue" };
    await service.set(key, value);
    const result = await service.get(key);
    expect(result).toEqual(value);
  });

  it("should return null for a non-existing key", async () => {
    const result = await service.get("nonExistingKey");
    expect(result).toBeNull();
  });

  it("should handle errors in get gracefully", async () => {
    const mockGet = jest.spyOn(Client.create(), "get");
    mockGet.mockImplementation(() => {
      throw new Error("Mock error");
    });
    const result = await service.get("testKey");
    expect(result).toBeNull();
    mockGet.mockRestore();
  });

  it("should handle errors in set gracefully", async () => {
    const mockSet = jest.spyOn(Client.create(), "set");
    mockSet.mockImplementation(() => {
      throw new Error("Mock error");
    });
    await service.set("testKey", { test: "testValue" });
    expect(mockSet).toHaveBeenCalled();
    mockSet.mockRestore();
  });

  it("should call quit on module destroy", () => {
    const spy = jest.spyOn(Client.create(), "quit");
    service.onModuleDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it("should log an error if saving to cache fails", async () => {
    const mockCache = {
      set: jest.fn().mockRejectedValue(new Error("Mock error")),
    };
    service["cache"] = mockCache as Partial<Client> as Client;

    await service.set("key", "value");

    expect(Logger.prototype.error).toHaveBeenCalledWith(
      "Errrore durante il salvataggio in cache",
      expect.any(Error),
    );
  });
});
