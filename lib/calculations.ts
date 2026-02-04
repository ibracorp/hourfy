export const DEFAULT_HOURS_PER_DAY = 7.6;
export const WORK_DAYS_PER_YEAR = 260;

export type IncomeMode = "hourly" | "salary";

export interface CalculationInput {
  mode: IncomeMode;
  hourlyRate: number;
  annualSalary: number;
  itemPrice: number;
  includeTax: boolean;
  taxRate: number; // 0-0.4
}

export interface CalculationResult {
  hourlyRate: number;
  hoursRequired: number;
  minutesRequired: number;
  workdaysRequired: number;
}

export function computeHourlyRate({
  mode,
  hourlyRate,
  annualSalary,
}: Pick<CalculationInput, "mode" | "hourlyRate" | "annualSalary">) {
  if (mode === "hourly") {
    return hourlyRate;
  }

  const annualHours = WORK_DAYS_PER_YEAR * DEFAULT_HOURS_PER_DAY;
  return annualSalary / annualHours;
}

export function calculateWorkTime(input: CalculationInput): CalculationResult {
  const baseRate = computeHourlyRate(input);
  const effectiveRate = input.includeTax
    ? baseRate * (1 - input.taxRate)
    : baseRate;
  const safeRate = effectiveRate > 0 ? effectiveRate : 0;
  const hoursRequired = safeRate > 0 ? input.itemPrice / safeRate : 0;
  const minutesRequired = Math.round(hoursRequired * 60);
  const workdaysRequired = hoursRequired / DEFAULT_HOURS_PER_DAY;

  return {
    hourlyRate: safeRate,
    hoursRequired,
    minutesRequired,
    workdaysRequired,
  };
}

export function formatHoursMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}
