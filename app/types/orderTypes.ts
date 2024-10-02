export interface OrderSummary {
  "Total after refund": number;
  "Total Refund Amount": number;
  "Unique Orders": number;
}

export interface OrderDailyData {
  order_date: string;
  total_unique_orders: number;
  total_after_refund: number;
}

export interface HourlyOrderData {
  order_weekday: string;
  order_hour: number;
  total_unique_orders: number;
  total_after_refund: number;
}

export interface OrderData {
  summary: OrderSummary | null;
  daily: OrderDailyData[] | null;
  hourly: HourlyOrderData[] | null;
}
