"use client";

import React, { useState } from "react";
import { Header } from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import AdvertisingSummary from "./components/AdvertisingSummary";
import CompanyAdvertisingHeatMap from "./charts/CompanyAdvertisingHeatMap";
import CompanyAdvertisingLineChart from "./charts/PreviousPeriodComparisonLineChart";
import CompanySearchBar from "app/components/filters/CompanySearchBar";
import StoreSelector from "app/components/filters/StoreSelector";
import DateRangeSelector from "app/components/filters/DateRangePicker";

import { CompanySearchBarProps } from "app/components/filters/CompanySearchBar";

const AdvertisingPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setSelectedStore(null);
    setSelectedStartDate(null);
  };

  const handleStoreSelect = (store: string | null) => {
    setSelectedStore(store);
    if (!store) {
      setSelectedStartDate(null);
    }
  };

  return (
    <Box>
      <Box padding="l">
        <Header variant="h1">Advertising</Header>
        <CompanySearchBar
          selectedCompany={selectedCompany}
          onSelect={handleCompanySelect}
        />
        {selectedCompany && (
          <StoreSelector
            company={selectedCompany}
            selectedStore={selectedStore}
            onSelect={handleStoreSelect}
          />
        )}
        {selectedStore && (
          <DateRangeSelector
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            onDateRangeChange={(startDate, endDate) => {
              setSelectedStartDate(startDate);
              setSelectedEndDate(endDate);
            }}
          />
        )}
      </Box>

      {selectedCompany &&
        selectedStore &&
        selectedStartDate &&
        selectedEndDate && (
          <Box padding="l" textAlign="center">
            <AdvertisingSummary
              selectedCompany={selectedCompany}
              selectedStore={selectedStore}
              selectedEndDate={selectedEndDate}
            />
            <CompanyAdvertisingLineChart
              companyName={selectedCompany}
              store={selectedStore}
              startDate={selectedStartDate}
              endDate={selectedEndDate}
              metric="total_spend"
            />
            <CompanyAdvertisingHeatMap
              companyName={selectedCompany}
              store={selectedStore}
              startDate={selectedStartDate}
              endDate={selectedEndDate}
              metric="total_spend"
            />
          </Box>
        )}
    </Box>
  );
};

export default AdvertisingPage;
