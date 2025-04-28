import { formatDate, formatTime } from "./date-utils";

describe("date-utils", () => {
  it("formats date correctly", () => {
    const result = formatDate(new Date("2024-02-24T12:40:00"));
    expect(result).toBe("24/02/2024");
  });

  it("formats time correctly", () => {
    const result = formatTime(new Date("2024-02-24T12:40:00"));
    expect(result).toBe("12:40");
  });
});
