"use client";

import React, { useState, useMemo } from "react";
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
  const { storesData, loading, error } = useStoreData(
    selectedCompany,
    selectedStore,
    selectedStartDate
  );

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
  };

  const handleClearStoreSelection = () => {
    setSelectedStore(null);
    setSelectedStartDate(null);
  };

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
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xxs: selectedStore ? 4 : 0 } }, // Store filter
          { colspan: { default: 12, xxs: selectedStore ? 4 : 0 } }, // Campaign filter (conditionally rendered)
          { colspan: { default: 12, xxs: 4 } }, // Clear Store Selection button
        ]}
      >
        <StoreFilter
          selectedStore={selectedStore}
          storeOptions={storeOptions}
          handleStoreSelect={handleStoreSelect}
        />

        {/* Conditionally render the AdvertisingCampaignFilter only when a store is selected */}
        {selectedStore && (
          <AdvertisingCampaignFilter
            selectedStartDate={selectedStartDate}
            startDateOptions={startDateOptions}
            handleStartDateSelect={handleStartDateSelect}
          />
        )}

        <Button onClick={handleClearStoreSelection} disabled={!selectedStore}>
          Clear Store Selection
        </Button>
      </Grid>
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
