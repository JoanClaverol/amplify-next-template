import React from "react";
import Select from "@cloudscape-design/components/select";
import { API_URL } from "app/constants/apiConfig";

interface StoreSelectorProps {
  company: string;
  selectedStore: string | null;
  onSelect: (store: string | null) => void;
}

export default function StoreSelector({
  company,
  selectedStore,
  onSelect,
}: StoreSelectorProps) {
  const [stores, setStores] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchStores() {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}get-companies-and-stores`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const companyStores = data.data[company] || [];
        setStores(companyStores);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (company) {
      fetchStores();
    }
  }, [company]);

  const options = stores.map((store) => ({
    label: store,
    value: store,
  }));

  return (
    <Select
      selectedOption={
        selectedStore ? { label: selectedStore, value: selectedStore } : null
      }
      onChange={({ detail }) => onSelect(detail.selectedOption?.value || null)}
      options={options}
      placeholder="Select a store"
      loadingText="Loading stores"
      statusType={isLoading ? "loading" : "finished"}
      empty="No stores available for this company"
    />
  );
}
