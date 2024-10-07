// AdvertisingSummary.tsx
import React, { useMemo } from "react";
import { CardContent } from "../components/CardContent";
import Box from "@cloudscape-design/components/box";
import { StoreData } from "../types/advertisingTypes";
import { Header } from "@cloudscape-design/components";
import CardMetric from "./CardMetric"; // Import the CardMetric

interface AdvertisingSummaryProps {
  storesData: StoreData[];
  selectedStore: string | null;
}

const AdvertisingSummary: React.FC<AdvertisingSummaryProps> = ({
  storesData,
  selectedStore,
}) => {
  const closestDateStoreData: StoreData | null = useMemo(() => {
    if (!selectedStore || storesData.length === 0) return null;

    const filteredStores = storesData.filter(
      (store) => store.store_name_scraped === selectedStore
    );

    if (filteredStores.length === 0) return null;

    const closestStore = filteredStores.reduce((prev, curr) => {
      return Math.abs(curr.date - Date.now()) < Math.abs(prev.date - Date.now())
        ? curr
        : prev;
    });

    return closestStore;
  }, [storesData, selectedStore]);

  if (!closestDateStoreData) {
    return <p>No data available for the selected store</p>;
  }
  const metrics = [
    {
      title: "Average daily budget",
      value: closestDateStoreData.average_daily_budget || "N/A",
      type: "currency",
    },
    {
      title: "Remaining Budget",
      value: closestDateStoreData.remaining_budget,
      pctChange: closestDateStoreData.remaining_budget_pct_change,
    },
    {
      title: "Gross Sales",
      value: closestDateStoreData.gross_sales_diff,
      pctChange: closestDateStoreData.gross_sales_pct_change,
    },
    {
      title: "Orders",
      value: closestDateStoreData.orders_diff,
      pctChange: closestDateStoreData.orders_pct_change,
    },
    {
      title: "Impressions",
      value: closestDateStoreData.impressions_diff,
      pctChange: closestDateStoreData.impressions_pct_change,
    },
    {
      title: "Clicks",
      value: closestDateStoreData.clicks_diff,
      pctChange: closestDateStoreData.clicks_pct_change,
    },
    {
      title: "Total Spend",
      value: closestDateStoreData.total_spend_diff,
      pctChange: closestDateStoreData.total_spend_pct_change,
    },
    {
      title: "CR GMO",
      value: closestDateStoreData.CR_GMO?.toFixed(1),
      pctChange: closestDateStoreData.CR_GMO_pct_change,
    },
    {
      title: "Facturacion GMO",
      value: closestDateStoreData.facturacion_gmo?.toFixed(1),
      pctChange: closestDateStoreData.facturacion_gmo_pct_change,
    },
    {
      title: "ROAS",
      value: closestDateStoreData.ROAS?.toFixed(1),
      pctChange: closestDateStoreData.ROAS_pct_change,
    },
    {
      title: "CPC",
      value: closestDateStoreData.CPC?.toFixed(1),
      pctChange: closestDateStoreData.CPC_pct_change,
    },
    {
      title: "CPM",
      value: closestDateStoreData.CPM?.toFixed(1),
      pctChange: closestDateStoreData.CPM_pct_change,
    },
    {
      title: "CPO",
      value: closestDateStoreData.CPO?.toFixed(1),
      pctChange: closestDateStoreData.CPO_pct_change,
    },
  ];

  return (
    <Box margin={{ bottom: "l" }}>
      <Header
        variant="h1"
        info={
          <Box fontSize="heading-m">
            Status:{" "}
            {closestDateStoreData.status
              ? closestDateStoreData.status.join(", ")
              : "N/A"}
            <br />
            {`Campaign: ${closestDateStoreData.start_date || "N/A"}`}
          </Box>
        }
      >
        {closestDateStoreData.store_name_scraped || "Unknown Store"}
      </Header>
      <Box
        fontSize="heading-m"
        fontWeight="bold"
        padding={{ top: "xs", bottom: "s" }}
      >
        Analyzed Data from {new Date(closestDateStoreData.date).toDateString()}
      </Box>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "1rem",
          justifyContent: "start",
        }}
      >
        {metrics.map((metric, index) => (
          <div key={index}>
            {metric.type === "currency" ? (
              <CardMetric
                title={metric.title}
                value={metric.value}
                pctChange={null}
              />
            ) : (
              <CardMetric
                title={metric.title}
                value={metric.value}
                pctChange={metric.pctChange}
              />
            )}
          </div>
        ))}
      </div>
    </Box>
  );
};
export default AdvertisingSummary;