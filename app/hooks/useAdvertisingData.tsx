import { useState, useEffect } from "react";
import { StoreData } from "../types/advertisingTypes";

const API_URL = "/api/storeData";

export const useAdvertisingData = (
  selectedCompany: string | null,
  selectedStore: string | null,
  selectedStartDate: string | null
) => {
  const [dailyData, setDailyData] = useState<StoreData[]>([]);
  const [hourlyData, setHourlyData] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCompany) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}?company_name=${encodeURIComponent(selectedCompany)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const responseData = await response.json();

        if (responseData.statusCode === 200) {
          const dailyAnalysisData = responseData.data.daily_analysis || [];
          const hourlyAnalysisData = responseData.data.hourly_analysis || [];

          setDailyData(dailyAnalysisData);
          setHourlyData(hourlyAnalysisData);
        } else {
          setDailyData([]);
          setHourlyData([]);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany]);

  // Filter daily and hourly data based on selected store and start date
  const filterData = (data: StoreData[]) => {
    return data.filter((store) => {
      if (selectedStore && store.store_name_scraped !== selectedStore) {
        return false;
      }
      if (selectedStartDate && store.start_date !== selectedStartDate) {
        return false;
      }
      return true;
    });
  };

  const filteredDailyData = filterData(dailyData);
  const filteredHourlyData = filterData(hourlyData);

  return {
    dailyData: filteredDailyData,
    hourlyData: filteredHourlyData,
    loading,
    error,
  };
};
