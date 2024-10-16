export interface TotalSpentDataPoint {
  weekday: string;
  hour: string;
  value: number;
  [key: string]: any; // Allow additional dynamic fields
}
