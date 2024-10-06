import { useState, useEffect, useCallback, useMemo } from "react";
import { StoreData } from "../types/advertisingTypes";

const API_URL =
  "https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/get-advertising-info";

export const useStoreData = (
  selectedCompany: string | null,
  selectedStore: string | null,
  selectedStartDate: string | null
) => {
  const [storesData, setStoresData] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (company: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}?company_name=${encodeURIComponent(company)}`
        // "http://localhost:8000/results"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setStoresData(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchData(selectedCompany);
    }
  }, [selectedCompany, fetchData]);

  const filteredData = useMemo(() => {
    if (!selectedStore && !selectedStartDate) {
      return storesData; // Return all data when no store or start date is selected
    }
    return storesData.filter((store) => {
      if (selectedStore && store.store_name_scraped !== selectedStore) {
        return false;
      }
      if (selectedStartDate && store.start_date !== selectedStartDate) {
        return false;
      }
      return true;
    });
  }, [storesData, selectedStore, selectedStartDate]);

  return { storesData: filteredData, loading, error };
};
