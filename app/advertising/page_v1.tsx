"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import CompanySearchBar from "../components/filters/CompanySearchBar";
import { Spinner, Alert, Select } from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import BarChart from "@cloudscape-design/components/bar-chart";
import { formatCurrency } from "../utils/formatCurrency";
import { CurrencyCode } from "../types/currency";

interface StoreData {
  store_name_scraped: string;
  start_date: string;
  date: number;
  gross_sales: number;
  orders: number;
  clicks: number;
  impressions: number;
  total_spend: number;
  orders_diff: number;
}

const API_URL =
  "https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/get-advertising-info";

const useStoreData = (
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
        // `${API_URL}?company_name=${encodeURIComponent(company)}`
        "http://localhost:8000/results"
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

const AdvertisingPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [selectedMetric, setSelectedMetric] = useState("gross_sales");
  const { storesData, loading, error } = useStoreData(
    selectedCompany,
    selectedStore,
    selectedStartDate
  );

  const handleStoreSelect = (store: string | null) => {
    setSelectedStore(store);
    if (!store) {
      setSelectedStartDate(null); // Reset start date when clearing store selection
    }
  };

  const handleStartDateSelect = (startDate: string) => {
    setSelectedStartDate(startDate);
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
  };

  const metricOptions = [
    // average daily budget
    { label: "Average Daily Budget", value: "average_daily_budget" },
    { label: "Orders Difference", value: "orders_diff" },
    // impressions diff
    { label: "Impressions Difference", value: "impressions_diff" },
    // clicks diff
    { label: "Clicks Difference", value: "clicks_diff" },
    // orders diff
    { label: "Orders Difference", value: "orders_diff" },
    // gross sales diff
    { label: "Gross Sales Difference", value: "gross_sales_diff" },
    // total spend diff
    { label: "Total Spend Difference", value: "total_spend_diff" },
    // cr gmo
    { label: "CR GMO", value: "CR_GMO" },
    // faacturacion_gmo
    // { label: "Facturación GMO", value: "facturacion_gmo" },
    // roas
    { label: "ROAS", value: "ROAS" },
    // cpo
    { label: "CPO", value: "CPO" },
    // cpc
    { label: "CPC", value: "CPC" },
    // cpm
    { label: "CPM", value: "CPM" },
    // pedidos gmo
    { label: "Pedidos GMO", value: "pedidos_gmo" },
    // impressions pct change
    { label: "Impressions % Change", value: "impressions_pct_change" },
    // clicks pct change
    { label: "Clicks % Change", value: "clicks_pct_change" },
    // orders pct change
    { label: "Orders % Change", value: "orders_pct_change" },
    // gross sales pct change
    { label: "Gross Sales % Change", value: "gross_sales_pct_change" },
    // total spend pct change
    { label: "Total Spend % Change", value: "total_spend_pct_change" },
    // cr gmo pct change
    { label: "CR GMO % Change", value: "CR_GMO_pct_change" },
    // facturacion gmo pct change
    { label: "Facturación GMO % Change", value: "facturacion_gmo_pct_change" },
    // roas pct change
    { label: "ROAS % Change", value: "ROAS_pct_change" },
    // cpo pct change
    { label: "CPO % Change", value: "CPO_pct_change" },
    // cpc pct change
    { label: "CPC % Change", value: "CPC_pct_change" },
    // cpm pct change
    { label: "CPM % Change", value: "CPM_pct_change" },
    // pedidos gmo pct change
    { label: "Pedidos GMO % Change", value: "pedidos_gmo_pct_change" },
  ];

  const chartData = useMemo(() => {
    return [
      {
        title:
          metricOptions.find((option) => option.value === selectedMetric)
            ?.label || selectedMetric,
        type: "bar" as const,
        data: storesData
          .map((store) => ({
            x: new Date(store.date).toISOString().split("T")[0],
            y: store[selectedMetric as keyof StoreData] as number,
          }))
          .filter((item) => item.y !== null && item.y !== undefined),
        valueFormatter: (e: number) => {
          if (e === null || e === undefined) return "N/A";
          if (
            selectedMetric === "gross_sales" ||
            selectedMetric === "total_spend"
          ) {
            return formatCurrency(e, "EUR");
          }
          return e.toLocaleString("en-US");
        },
      },
    ];
  }, [storesData, selectedMetric]);

  const storeOptions = useMemo(() => {
    const uniqueStores = Array.from(
      new Set(storesData.map((store) => store.store_name_scraped))
    );
    return uniqueStores.map((store) => ({ label: store, value: store }));
  }, [storesData]);

  const startDateOptions = useMemo(() => {
    const uniqueStartDates = Array.from(
      new Set(storesData.map((store) => store.start_date))
    );
    return uniqueStartDates.map((date) => ({ label: date, value: date }));
  }, [storesData]);

  const renderContent = () => {
    if (!selectedCompany) {
      return <h2>Please select a company to view the advertising data</h2>;
    }

    if (loading) {
      return <Spinner size="large" />;
    }

    if (error) {
      return (
        <Alert type="error" header="Error fetching data">
          {error.message}
        </Alert>
      );
    }

    if (storesData.length === 0) {
      return <h2>No data available for the selected filters</h2>;
    }

    return (
      <>
        <Box padding="l">
          <Select
            selectedOption={
              selectedStore
                ? { label: selectedStore, value: selectedStore }
                : null
            }
            onChange={({ detail }) =>
              handleStoreSelect(detail.selectedOption.value || null)
            }
            options={storeOptions}
            placeholder="Choose a store"
          />
          <Button
            onClick={() => handleStoreSelect(null)}
            disabled={!selectedStore}
          >
            Clear Store Selection
          </Button>
        </Box>
        {selectedStore && (
          <Box padding="l">
            <Select
              selectedOption={
                selectedStartDate
                  ? { label: selectedStartDate, value: selectedStartDate }
                  : null
              }
              onChange={({ detail }) =>
                handleStartDateSelect(detail.selectedOption.value || "")
              }
              options={startDateOptions}
              placeholder="Choose a start date"
            />
          </Box>
        )}
        <Box padding="l">
          <Select
            selectedOption={{
              label:
                metricOptions.find((option) => option.value === selectedMetric)
                  ?.label || "",
              value: selectedMetric,
            }}
            onChange={({ detail }) =>
              setSelectedMetric(detail.selectedOption.value || "")
            }
            options={metricOptions}
            placeholder="Choose a metric"
          />
        </Box>
        <BarChart
          series={chartData}
          // xDomain={storesData.map(
          //   (store) => new Date(store.date).toISOString().split("T")[0]
          // )}
          // ariaLabel="Store performance bar chart"
          // height={500}
          // xTitle="Date"
          // yTitle={
          //   metricOptions.find((option) => option.value === selectedMetric)
          //     ?.label || selectedMetric
          // }
          // empty={
          //   <Box textAlign="center" color="inherit">
          //     <b>No data available</b>
          //     <Box variant="p" color="inherit">
          //       There is no data available
          //     </Box>
          //   </Box>
          // }
          // noMatch={
          //   <Box textAlign="center" color="inherit">
          //     <b>No matching data</b>
          //     <Box variant="p" color="inherit">
          //       There is no matching data to display
          //     </Box>
          //     <Button>Clear filter</Button>
          //   </Box>
          // }
        />
      </>
    );
  };

  return (
    <Box>
      <Box padding="l">
        <CompanySearchBar
          selectedCompany={selectedCompany}
          isLoading={loading}
          onSelect={handleCompanySelect}
        />
      </Box>
      <Box padding="l" textAlign="center">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdvertisingPage;
