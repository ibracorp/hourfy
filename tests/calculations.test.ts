import { describe, expect, it } from "vitest";
import {
  calculateWorkTime,
  computeHourlyRate,
  DEFAULT_HOURS_PER_DAY,
} from "@/lib/calculations";

describe("computeHourlyRate", () => {
  it("returns hourly rate for hourly mode", () => {
    const rate = computeHourlyRate({
      mode: "hourly",
      hourlyRate: 40,
      annualSalary: 80000,
    });
    expect(rate).toBe(40);
  });

  it("converts salary into hourly rate", () => {
    const rate = computeHourlyRate({
      mode: "salary",
      hourlyRate: 0,
      annualSalary: 76000,
    });
    const expected = 76000 / (DEFAULT_HOURS_PER_DAY * 260);
    expect(rate).toBeCloseTo(expected, 5);
  });
});

describe("calculateWorkTime", () => {
  it("calculates hours and workdays with tax", () => {
    const result = calculateWorkTime({
      mode: "hourly",
      hourlyRate: 50,
      annualSalary: 0,
      itemPrice: 200,
      includeTax: true,
      taxRate: 0.2,
    });

    expect(result.hourlyRate).toBeCloseTo(40, 2);
    expect(result.hoursRequired).toBeCloseTo(5, 2);
    expect(result.workdaysRequired).toBeCloseTo(5 / DEFAULT_HOURS_PER_DAY, 4);
  });

  it("returns zero when effective rate is zero", () => {
    const result = calculateWorkTime({
      mode: "hourly",
      hourlyRate: 0,
      annualSalary: 0,
      itemPrice: 100,
      includeTax: true,
      taxRate: 1,
    });

    expect(result.hoursRequired).toBe(0);
    expect(result.minutesRequired).toBe(0);
  });
});
