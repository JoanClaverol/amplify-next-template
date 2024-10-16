"use client";

import WeeklyHourHeatMap from "@/app/components/WeeklyHourHeatMap";
import { Box, Spinner } from "@cloudscape-design/components";
import React, { useEffect, useState } from "react";
import { WeeklyHourHeatMapDataPoint } from "@/app/types/heatMapDataPoint";
import { TotalSpentDataPoint } from "@/app/types/totalSpentDataPoint";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const hours = Array.from({ length: 24 }, (_, i) => i);

const fetchAndProcessData = async (
  companyName: string,
  startDate: string,
  endDate: string,
  store: string,
  campaignName: string,
  metric: string
): Promise<WeeklyHourHeatMapDataPoint[]> => {
  const API_URL = `https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/get-advertising-total-spent-hours?company_name=${encodeURIComponent(
    companyName
  )}&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(
    endDate
  )}&store=${encodeURIComponent(store)}&campaign_start=${encodeURIComponent(
    campaignName
  )}&metric=${encodeURIComponent(metric)}`;

  const response = await fetch(API_URL);
  const data: TotalSpentDataPoint[] = await response.json();

  const dataMap = new Map(
    data.map((d) => [`${d.weekday}-${d.hour}`, d.difference_from_total_spend])
  );

  return weekdays.flatMap((weekday) =>
    hours.map((hour) => ({
      weekday,
      hour,
      value: dataMap.get(`${weekday}-${hour}`) || 0,
    }))
  );
};

interface CompanyAdvertisingHeatMapProps {
  companyName: string;
  startDate: string;
  endDate: string;
  store: string;
  campaignName: string;
  metric: string;
}

const CompanyAdvertisingHeatMap: React.FC<CompanyAdvertisingHeatMapProps> = ({
  companyName,
  startDate,
  endDate,
  store,
  campaignName,
  metric,
}) => {
  const [data, setData] = useState<WeeklyHourHeatMapDataPoint[]>([]);

  if (!companyName) {
    return;
  }
  useEffect(() => {
    fetchAndProcessData(
      companyName,
      startDate,
      endDate,
      store,
      campaignName,
      metric
    ).then(setData);
  }, [companyName]);

  return (
    <Box padding="l" textAlign="center" variant="h2">
      Evolución de la métrica por hora de {companyName}
      {data.length > 0 ? (
        <WeeklyHourHeatMap data={data} />
      ) : (
        <Box padding="l" textAlign="center">
          <Spinner size="large" />
        </Box>
      )}
    </Box>
  );
};

export default CompanyAdvertisingHeatMap;
