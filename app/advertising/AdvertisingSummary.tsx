import React, { useMemo } from "react";
import { CardContent } from "../components/CardContent";
import Box from "@cloudscape-design/components/box";
import { StoreData } from "../types/advertisingTypes";
import { Header } from "@cloudscape-design/components";
import { CurrencyCode } from "../types/currency";

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

  const renderMetric = (
    title: string,
    value: any,
    pctChange: any,
    currency?: string,
    color?: string
  ) => (
    <Box>
      <CardContent
        title={title}
        value={
          value !== undefined
            ? currency
              ? Number(value)
              : value.toString()
            : "N/A"
        }
        currency={currency as CurrencyCode}
        size="large"
        color={color as any}
      />
      <CardContent
        title={`${title} % Change`}
        value={pctChange !== undefined ? pctChange : "N/A"}
        formatAsPercentage
        size="small"
        changeIndicator
      />
    </Box>
  );

  return (
    <>
      <Box>
        <Header
          variant="h1"
          description={`Campaign: ${closestDateStoreData.start_date || "N/A"}`}
          info={
            <Box fontSize="body-s">
              Status:{" "}
              {closestDateStoreData.status
                ? closestDateStoreData.status.join(", ")
                : "N/A"}
            </Box>
          }
        >
          {closestDateStoreData.store_name_scraped || "Unknown Store"}
        </Header>
        <Box fontSize="body-m" fontWeight="bold" padding={{ top: "xs" }}>
          Analyzed Data from{" "}
          {new Date(closestDateStoreData.date).toDateString()}
        </Box>
      </Box>
      <Box display="block">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflowX: "auto",
          }}
        >
          {renderMetric(
            "Impressions",
            closestDateStoreData.impressions_diff,
            closestDateStoreData.impressions_pct_change
          )}
          {renderMetric(
            "Clicks",
            closestDateStoreData.clicks_diff,
            closestDateStoreData.clicks_pct_change
          )}
          {renderMetric(
            "Orders",
            closestDateStoreData.orders_diff,
            closestDateStoreData.orders_pct_change
          )}
          {renderMetric(
            "Gross Sales",
            closestDateStoreData.gross_sales_diff,
            closestDateStoreData.gross_sales_pct_change
          )}
          {renderMetric(
            "Remaining Budget",
            closestDateStoreData.remaining_budget,
            closestDateStoreData.remaining_budget_pct_change
          )}
          <CardContent
            title="Average daily budget"
            value={closestDateStoreData.average_daily_budget || "N/A"}
            size="small"
          />
          {renderMetric(
            "Total Spend",
            closestDateStoreData.total_spend_diff,
            closestDateStoreData.total_spend_pct_change
          )}
          {renderMetric(
            "CR_GMO",
            closestDateStoreData.CR_GMO?.toFixed(1),
            closestDateStoreData.CR_GMO_pct_change
          )}
          {renderMetric(
            "Facturacion_GMO",
            closestDateStoreData.facturacion_gmo,
            closestDateStoreData.facturacion_gmo_pct_change
          )}
          {renderMetric(
            "ROAS",
            closestDateStoreData.ROAS?.toFixed(1),
            closestDateStoreData.ROAS_pct_change
          )}
          {renderMetric(
            "CPC",
            closestDateStoreData.CPC?.toFixed(1),
            closestDateStoreData.CPC_pct_change
          )}
          {renderMetric(
            "CPM",
            closestDateStoreData.CPM?.toFixed(1),
            closestDateStoreData.CPM_pct_change
          )}
          {renderMetric(
            "Pedidos_GMO",
            closestDateStoreData.pedidos_gmo?.toFixed(1),
            closestDateStoreData.pedidos_gmo_pct_change
          )}
        </div>
      </Box>
    </>
  );
};

export default AdvertisingSummary;
