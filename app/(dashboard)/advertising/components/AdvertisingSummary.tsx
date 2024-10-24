import React, { useEffect, useState, useMemo } from "react";
import Box from "@cloudscape-design/components/box";
import { StoreData } from "app/types/advertisingTypes";
import { Header } from "@cloudscape-design/components";
import CardMetric from "./CardMetric";
import { API_URL } from "app/constants/apiConfig";

interface AdvertisingSummaryProps {
  selectedCompany: string | null;
  selectedStore: string | null;
  selectedEndDate: string | null;
  currency?: string;
}

const AdvertisingSummary: React.FC<AdvertisingSummaryProps> = ({
  selectedCompany,
  selectedStore,
  selectedEndDate,
}) => {
  const [advertisingData, setAdvertisingData] = useState<StoreData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvertisingData = async () => {
      if (!selectedCompany || !selectedStore || !selectedEndDate) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const encodedCompanyName = encodeURIComponent(selectedCompany);
        const encodedStoreName = encodeURIComponent(selectedStore);
        const url = `${API_URL}get-advertising-info?company_name=${encodedCompanyName}&store_name=${encodedStoreName}&target_date=${selectedEndDate}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch advertising data");
        }

        const data = await response.json();
        setAdvertisingData(data || []); // Assuming the API returns an array of store data
      } catch (err) {
        setError("Error fetching advertising data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisingData();
  }, [selectedCompany, selectedStore, selectedEndDate]);

  const closestDateStoreData = useMemo(() => {
    if (!selectedEndDate || !advertisingData || advertisingData.length === 0)
      return null;

    const targetDate = new Date(selectedEndDate).setHours(0, 0, 0, 0);
    const filteredData = advertisingData.filter(
      (data) => new Date(data.date).setHours(0, 0, 0, 0) === targetDate
    );

    if (filteredData.length === 0) return null;

    return filteredData.reduce((prev, curr) => {
      return Math.abs(new Date(curr.date).getTime() - Date.now()) <
        Math.abs(new Date(prev.date).getTime() - Date.now())
        ? curr
        : prev;
    });
  }, [advertisingData, selectedEndDate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!closestDateStoreData) {
    return <p>No data available for the selected store and date</p>;
  }

  const metrics = [
    {
      title: "Presupuesto diario promedio",
      value: closestDateStoreData.average_daily_budget,
      pctChange: closestDateStoreData.average_daily_budget_pct_change,
    },
    {
      title: "Presupuesto restante",
      value: closestDateStoreData.remaining_budget,
      pctChange: closestDateStoreData.remaining_budget_pct_change,
    },
    {
      title: "Ventas brutas",
      value: closestDateStoreData.gross_sales_diff?.toFixed(2),
      pctChange: closestDateStoreData.gross_sales_pct_change,
    },
    {
      title: "Pedidos",
      value: closestDateStoreData.orders_diff,
      pctChange: closestDateStoreData.orders_pct_change,
    },
    {
      title: "Impresiones",
      value: closestDateStoreData.impressions_diff,
      pctChange: closestDateStoreData.impressions_pct_change,
    },
    {
      title: "Clics",
      value: closestDateStoreData.clicks_diff,
      pctChange: closestDateStoreData.clicks_pct_change,
    },
    {
      title: "Gasto total",
      value: closestDateStoreData.total_spend_diff?.toFixed(1),
      pctChange: closestDateStoreData.total_spend_pct_change,
    },
    {
      title: "CR GMO",
      value: closestDateStoreData.CR_GMO
        ? (closestDateStoreData.CR_GMO * 100).toFixed(2) + "%"
        : "N/A",
      pctChange: closestDateStoreData.CR_GMO_pct_change,
    },
    {
      title: "Facturación GMO",
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
            Estado:{" "}
            {closestDateStoreData.status
              ? closestDateStoreData.status.join(", ")
              : "N/A"}
            <br />
          </Box>
        }
      >
        {closestDateStoreData.store_name_scraped || "Tienda Desconocida"}
      </Header>
      <Box
        fontSize="heading-m"
        fontWeight="bold"
        padding={{ top: "xs", bottom: "s" }}
      >
        Comparación a 7 días anteriores del{" "}
        {new Date(closestDateStoreData.date).toLocaleDateString("es-ES")}
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
            <CardMetric
              title={metric.title}
              value={metric.value}
              pctChange={metric.pctChange}
            />
          </div>
        ))}
      </div>
    </Box>
  );
};

export default AdvertisingSummary;
