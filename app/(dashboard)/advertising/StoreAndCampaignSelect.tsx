import React from "react";
import { Grid, Spinner, Alert, Button } from "@cloudscape-design/components";
import Box from "@cloudscape-design/components/box";
import StoreFilter from "../../components/filters/StoreFilter";
import AdvertisingCampaignFilter from "../../components/filters/AdvertisingCampaignFilter";

interface StoreAndCampaignSelectProps {
  selectedCompany: string | null;
  loading: boolean;
  error: any;
  dailyData: any[];
  selectedStore: string | null;
  selectedStartDate: string | null;
  handleStoreSelect: (store: string | null) => void;
  handleStartDateSelect: (startDate: string) => void;
  handleClearStoreSelection: () => void;
}

const StoreAndCampaignSelect: React.FC<StoreAndCampaignSelectProps> = ({
  selectedCompany,
  loading,
  error,
  dailyData,
  selectedStore,
  selectedStartDate,
  handleStoreSelect,
  handleStartDateSelect,
  handleClearStoreSelection,
}) => {
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
      {selectedCompany && !loading && !error && dailyData.length === 0 && (
        <h2>No data available for the selected filters</h2>
      )}
      {selectedCompany && !loading && !error && dailyData.length > 0 && (
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 4 } },
            { colspan: { default: 12, xxs: 4 } },
            { colspan: { default: 12, xxs: 4 } },
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
          <Button onClick={handleClearStoreSelection} disabled={!selectedStore}>
            Clear Store Selection
          </Button>
        </Grid>
      )}
    </Box>
  );
};

export default StoreAndCampaignSelect;
