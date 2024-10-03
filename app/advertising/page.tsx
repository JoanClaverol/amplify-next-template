"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { CardContent } from "../components/CardContent";
import Grid from "@cloudscape-design/components/grid";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Box from "@cloudscape-design/components/box";
import CompanySearchBar from "../components/filters/CompanySearchBar";
import { Spinner } from "@cloudscape-design/components";

interface StoreData {
  date_current: number;
  store_name_scraped: string;
  start_date: string;
  status_current: string;
  company: string;
  gross_sales_current: number;
  orders_current: number;
  clicks_current: number;
  impressions_current: number;
  remaining_budget_current: number;
  average_daily_budget_current: number;
  total_spend_current: number;
  CR_GMO_current: number;
  factuacion_gmo_current: number;
  ROAS_current: number;
  CPO_current: number;
  CPC_current: number;
  CPM_current: number;
  daily_budget_current: number;
  gross_sales_pct_change: number;
  orders_pct_change: number;
  clicks_pct_change: number;
  impressions_pct_change: number;
  remaining_budget_pct_change: number;
  total_spend_pct_change: number;
  CR_GMO_pct_change: number;
  factuacion_gmo_pct_change: number;
  ROAS_pct_change: number;
  CPC_pct_change: number;
  CPM_pct_change: number;
}

const API_URL =
  "https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/get-advertising-info";

const useStoreData = (selectedCompany: string | null) => {
  const [storesData, setStoresData] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (company: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}?company_name=${encodeURIComponent(company)}`
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

  return { storesData, loading, error };
};

const MemoizedCardContent = React.memo(CardContent);

const AdvertisingPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const { storesData, loading, error } = useStoreData(selectedCompany);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
  };

  const renderContent = () => {
    if (!selectedCompany) {
      return <h2>Please select a company to view the advertising data</h2>;
    }

    if (loading) {
      return <Spinner size="large" />;
    }

    if (storesData.length === 0) {
      return <h2>No data available for the selected company</h2>;
    }

    return (
      <>
        {storesData.map((store, index) => (
          <Container key={index} fitHeight={true}>
            <Box padding="l" variant="awsui-key-label">
              <Header
                variant="h2"
                description={new Date(store.date_current).toLocaleDateString()}
              >
                {store.store_name_scraped}
              </Header>

              <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
                <Box padding="s">
                  <Header variant="h3">Store Information</Header>
                  <CardContent
                    title="Company"
                    value={store.company}
                    size="small"
                  />
                  <CardContent
                    title="Start Date"
                    value={store.start_date}
                    size="small"
                  />
                  <CardContent
                    title="Status"
                    value={store.status_current}
                    size="small"
                  />

                  <Box padding={{ top: "l" }}>
                    <Header variant="h3">Budget</Header>
                    <CardContent
                      title="Remaining Budget"
                      value={store.remaining_budget_current}
                      currency="EUR"
                      size="small"
                    />
                    <CardContent
                      title="Average Daily Budget"
                      value={store.average_daily_budget_current}
                      currency="EUR"
                      size="small"
                    />
                    <CardContent
                      title="Total Spend"
                      value={store.total_spend_current}
                      currency="EUR"
                      size="small"
                    />
                  </Box>
                </Box>

                <Box padding="s">
                  <Header variant="h3">Performance Metrics</Header>
                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    <Box>
                      <Header variant="h3">Current Values</Header>
                      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                        <Box>
                          <CardContent
                            title="Gross Sales"
                            value={store.gross_sales_current}
                            currency="EUR"
                            size="small"
                          />
                          <CardContent
                            title="Orders"
                            value={store.orders_current}
                            size="small"
                          />
                          <CardContent
                            title="Clicks"
                            value={store.clicks_current}
                            size="small"
                          />
                          <CardContent
                            title="Impressions"
                            value={store.impressions_current}
                            size="small"
                          />
                          <CardContent
                            title="CR GMO"
                            value={store.CR_GMO_current}
                            formatAsPercentage
                            size="small"
                          />
                        </Box>
                        <Box>
                          <CardContent
                            title="ROAS"
                            value={store.ROAS_current}
                            size="small"
                          />
                          <CardContent
                            title="CPO"
                            value={store.CPO_current}
                            currency="EUR"
                            size="small"
                          />
                          <CardContent
                            title="CPC"
                            value={store.CPC_current}
                            currency="EUR"
                            size="small"
                          />
                          <CardContent
                            title="CPM"
                            value={store.CPM_current}
                            currency="EUR"
                            size="small"
                          />
                        </Box>
                      </Grid>
                    </Box>

                    <Box>
                      <Header variant="h3">7-Day Changes</Header>
                      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                        <Box>
                          <CardContent
                            title="Gross Sales"
                            value={store.gross_sales_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                          <CardContent
                            title="Orders"
                            value={store.orders_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                          <CardContent
                            title="Clicks"
                            value={store.clicks_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                          <CardContent
                            title="Impressions"
                            value={store.impressions_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                          <CardContent
                            title="CR GMO"
                            value={store.CR_GMO_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                        </Box>
                        <Box>
                          <CardContent
                            title="ROAS"
                            value={store.ROAS_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                          <CardContent
                            title="Total Spend"
                            value={store.total_spend_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                          <CardContent
                            title="CPC"
                            value={store.CPC_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                          <CardContent
                            title="CPM"
                            value={store.CPM_pct_change}
                            formatAsPercentage
                            changeIndicator
                            size="small"
                          />
                        </Box>
                      </Grid>
                    </Box>
                  </Grid>
                </Box>
              </Grid>
            </Box>
          </Container>
        ))}
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
