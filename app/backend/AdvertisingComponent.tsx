import React, { useState, useEffect } from "react";
import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";
import Grid from "@cloudscape-design/components/grid";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import Container from "@cloudscape-design/components/container";
import Spinner from "@cloudscape-design/components/spinner";

interface AdvertisingData {
  store_name_scraped: string;
  status: string;
  start_date: string;
  gross_sales: number;
  orders: number;
  clicks: number;
  impressions: number;
  remaining_budget: number;
  average_daily_budget: number;
  total_spend: number;
  company: string;
  datetime: number;
  status_raw: string;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  roi: number;
}

interface ApiResponse {
  data: AdvertisingData[];
}

export default function AdvertisingComponent({ selectedCompany, isLoading }: { selectedCompany: string | null, isLoading: boolean }) {
  const [advertisingData, setAdvertisingData] = useState<AdvertisingData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAdvertisingData() {
      setLoading(true);
      try {
        const response = await fetch(
          "https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/fetch-orderlines?company=" + selectedCompany
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        setAdvertisingData(data.data);
      } catch (error) {
        console.error("Error fetching advertising data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdvertisingData();
  }, [selectedCompany]);

  if (loading || isLoading) {
    return (
      <Container>
        <Spinner size="large" />
      </Container>
    );
  }

  return (
    <Container
      header={
        <Header variant="h1" description="Overview of all advertising campaigns">
          Advertising Campaigns
        </Header>
      }
    >
      <div style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Cards
          cardDefinition={{
            header: (item) => (
              <Header variant="h2">
                {item.company} - {item.store_name_scraped} - {item.start_date} - Updated time: {new Date(item.datetime).toLocaleString()}
              </Header>
            ),
            sections: [
              {
                id: "allInfo",
                content: (item) => (
                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, xxs: 6, m: 3 } },
                      { colspan: { default: 12, xxs: 6, m: 3 } },
                      { colspan: { default: 12, xxs: 6, m: 3 } },
                      { colspan: { default: 12, xxs: 6, m: 3 } },
                    ]}
                  >
                    <Container header={<Header variant="h3">Status</Header>}>
                      <SpaceBetween size="s">
                        <div>{item.status}</div>
                        <div>{item.start_date}</div>
                      </SpaceBetween>
                    </Container>
                    <Container header={<Header variant="h3">Performance</Header>}>
                      <SpaceBetween size="s">
                        <div>Gross Sales: €{item.gross_sales.toFixed(2)}</div>
                        <div>Orders: {item.orders}</div>
                        <div>Clicks: {item.clicks}</div>
                        <div>Impressions: {item.impressions}</div>
                      </SpaceBetween>
                    </Container>
                    <Container header={<Header variant="h3">Budget</Header>}>
                      <SpaceBetween size="s">
                        <div>Remaining: €{item.remaining_budget.toFixed(2)}</div>
                        <div>Daily Avg: €{item.average_daily_budget.toFixed(2)}</div>
                        <div>Total Spend: €{item.total_spend.toFixed(2)}</div>
                      </SpaceBetween>
                    </Container>
                    <Container header={<Header variant="h3">Metrics</Header>}>
                      <SpaceBetween size="s">
                        <div>CTR: {(item.ctr * 100).toFixed(2)}%</div>
                        <div>CPC: €{item.cpc.toFixed(2)}</div>
                        <div>CPM: €{item.cpm.toFixed(2)}</div>
                        <div>ROAS: {item.roas.toFixed(2)}</div>
                        <div>ROI: {(item.roi * 100).toFixed(2)}%</div>
                      </SpaceBetween>
                    </Container>
                  </Grid>
                ),
              },
            ],
          }}
          cardsPerRow={[{ cards: 1 }]}
          items={advertisingData}
          loadingText="Loading advertising data"
          trackBy="company"
          visibleSections={["allInfo"]}
        />
      </div>
    </Container>
  );
}