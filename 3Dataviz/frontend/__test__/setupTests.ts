import { vi } from "vitest";
import { CreateMockRootState } from "./utils/StateMockCreator";

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

export const mockStore = {
    getState: vi.fn(() => (CreateMockRootState(
        {
            data:{
                data: [
                  { id: 0, show: true, x: 1, y: 54, z: 1 },
                  { id: 1, show: true, x: 1, y: 24, z: 2 },
                  { id: 2, show: true, x: 2, y: 32, z: 4 },
                  { id: 3, show: true, x: 3, y: 14, z: 1 },
                  { id: 4, show: true, x: 2, y: 21, z: 3 },
                  { id: 5, show: true, x: 6, y: 43, z: 3 },
                ],
                legend: { x: "Citta", z: "Ora", y: "Temperatura" },
                average: 0,
                x: [
                  "Madrid",
                  "Parigi",
                  "Milano",
                  "Guanabo",
                  "Londra",
                  "Venezia",
                  "Roma",
                  "Tokyo",
                ],
                z: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
              }
        }
    ))),
    dispatch: vi.fn(),
    subscribe: vi.fn(),
    replaceReducer: vi.fn(),
    [Symbol.observable]: vi.fn(),
  };