"use client";

import React, { useState } from "react";
import { Header } from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import { useAdvertisingData } from "../hooks/useAdvertisingData";
import CompanySearchBar from "../components/filters/CompanySearchBar";
import AdvertisingSummary from "./AdvertisingSummary";
import StoreAndCampaignSelect from "./StoreAndCampaignSelect";
import LineChartWithMetrics from "./LineChartMetrics";
// import HeatMapAdvertising from "./HeatMapAdvertising";
import DataTransformer from "./HeatMapAdvertising";

const AdvertisingPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );

  // Use custom hook to fetch data based on selected filters
  const { dailyData, hourlyData, loading, error } = useAdvertisingData(
    selectedCompany,
    selectedStore,
    selectedStartDate
  );
  // Handlers for store and date selection
  const handleStoreSelect = (store: string | null) => {
    setSelectedStore(store);
    if (!store) {
      setSelectedStartDate(null);
    }
  };

  const handleStartDateSelect = (startDate: string) => {
    setSelectedStartDate(startDate);
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setSelectedStore(null);
    setSelectedStartDate(null);
  };

  const handleClearStoreSelection = () => {
    setSelectedStore(null);
    setSelectedStartDate(null);
  };

  const storeOptions = Array.from(
    new Set(dailyData.map((store) => store.store_name_scraped))
  ).map((storeName) => ({
    label: storeName,
    value: storeName,
  }));

  const startDateOptions = Array.from(
    new Set(dailyData.map((store) => store.start_date))
  ).map((startDate) => ({
    label: startDate,
    value: startDate,
  }));

  return (
    <Box>
      <Box padding="l">
        <Header variant="h1">Advertising</Header>
        <CompanySearchBar
          selectedCompany={selectedCompany}
          isLoading={loading}
          onSelect={handleCompanySelect}
        />
      </Box>
      <StoreAndCampaignSelect
        selectedCompany={selectedCompany}
        loading={loading}
        error={error}
        dailyData={dailyData}
        selectedStore={selectedStore}
        selectedStartDate={selectedStartDate}
        handleStoreSelect={handleStoreSelect}
        handleStartDateSelect={handleStartDateSelect}
        handleClearStoreSelection={handleClearStoreSelection}
      />

      {selectedStore && selectedStartDate && (
        <Box padding="l" textAlign="center">
          <AdvertisingSummary
            dailyData={dailyData}
            selectedStore={selectedStore}
            selectedStartDate={selectedStartDate}
          />
          <LineChartWithMetrics
            dailyData={dailyData}
            selectedStore={selectedStore}
            selectedStartDate={selectedStartDate}
          />
          <DataTransformer
            hourlyData={hourlyData}
            selectedStore={selectedStore}
            selectedStartDate={selectedStartDate}
          />
        </Box>
      )}
    </Box>
  );
};

export default AdvertisingPage;
