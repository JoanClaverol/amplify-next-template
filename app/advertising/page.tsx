"use client";

import React, { useState } from "react";
import { Spinner, Alert, Grid, Button } from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import { useStoreData } from "../hooks/useAdvertisingData";
import CompanySearchBar from "../components/filters/CompanySearchBar";
import StoreFilter from "../components/filters/StoreFilter";
import AdvertisingCampaignFilter from "../components/filters/AdvertisingCampaignFilter";
import AdvertisingSummary from "./AdvertisingSummary";

const AdvertisingPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );

  // Use custom hook to fetch data based on selected filters
  const { storesData, loading, error } = useStoreData(
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
    new Set(storesData.map((store) => store.store_name_scraped))
  ).map((storeName) => ({
    label: storeName,
    value: storeName,
  }));

  const startDateOptions = Array.from(
    new Set(storesData.map((store) => store.start_date))
  ).map((startDate) => ({
    label: startDate,
    value: startDate,
  }));

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
        {!selectedCompany && (
          <h2>Please select a company to view the advertising data</h2>
        )}
        {loading && <Spinner size="large" />}
        {error && (
          <Alert type="error" header="Error fetching data">
            {error.message}
          </Alert>
        )}
        {selectedCompany && !loading && !error && storesData.length === 0 && (
          <h2>No data available for the selected filters</h2>
        )}
        {selectedCompany && !loading && !error && storesData.length > 0 && (
          <Grid
            gridDefinition={[
              { colspan: { default: 12, xxs: 4 } }, // Store filter
              { colspan: { default: 12, xxs: 4 } }, // Campaign filter
              { colspan: { default: 12, xxs: 4 } }, // Clear Store Selection button
            ]}
          >
            <StoreFilter
              selectedStore={selectedStore}
              storeOptions={storeOptions}
              handleStoreSelect={handleStoreSelect}
            />
            <AdvertisingCampaignFilter
              selectedStartDate={selectedStartDate}
              startDateOptions={startDateOptions}
              handleStartDateSelect={handleStartDateSelect}
            />
            <Button
              onClick={handleClearStoreSelection}
              disabled={!selectedStore}
            >
              Clear Store Selection
            </Button>
          </Grid>
        )}
      </Box>

      {selectedStore && selectedStartDate && (
        <Box padding="l" textAlign="center">
          <AdvertisingSummary
            storesData={storesData}
            selectedStore={selectedStore}
          />
        </Box>
      )}
    </Box>
  );
};

export default AdvertisingPage;
