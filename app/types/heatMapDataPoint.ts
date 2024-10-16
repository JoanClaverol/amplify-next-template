export interface WeeklyHourHeatMapDataPoint {
  weekday: string;
  hour: number;
  value: number; // This is now a generic "value" field instead of "total_spent"
}
