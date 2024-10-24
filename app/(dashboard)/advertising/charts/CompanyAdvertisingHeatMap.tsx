"use client";

import WeeklyHourHeatMap from "app/components/WeeklyHourHeatMap";
import { Box, Spinner } from "@cloudscape-design/components";
import React, { useEffect, useState } from "react";
import { WeeklyHourHeatMapDataPoint } from "app/types/heatMapDataPoint";
import { TotalSpentDataPoint } from "app/types/totalSpentDataPoint";
import { API_URL } from "app/constants/apiConfig";

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
  store: string,
  startDate: string,
  endDate: string,
  metric: string
): Promise<WeeklyHourHeatMapDataPoint[]> => {
  const url = `${API_URL}get-advertising-total-spent-hours?company_name=${encodeURIComponent(
    companyName
  )}&store=${encodeURIComponent(store)}&start_date=${encodeURIComponent(
    startDate
  )}&end_date=${encodeURIComponent(endDate)}&metric=${encodeURIComponent(
    metric
  )}`;
  console.log(url);

  const response = await fetch(url);
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
  store: string;
  startDate: string;
  endDate: string;
  metric: string;
}

const CompanyAdvertisingHeatMap: React.FC<CompanyAdvertisingHeatMapProps> = ({
  companyName,
  store,
  startDate,
  endDate,
  metric,
}) => {
  const [data, setData] = useState<WeeklyHourHeatMapDataPoint[]>([]);

  if (!companyName) {
    return;
  }
  useEffect(() => {
    fetchAndProcessData(companyName, store, startDate, endDate, metric).then(
      setData
    );
  }, [companyName]);

  return (
    <Box padding="l" textAlign="center" variant="h2">
      Evolución del gasto por hora de {companyName}
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
