// components/filters/StoreFilter.tsx

import React from "react";
import { Select, Box } from "@cloudscape-design/components";

interface StoreFilterProps {
  selectedStore: string | null;
  storeOptions: { label: string; value: string }[];
  handleStoreSelect: (store: string | null) => void;
}

const StoreFilter: React.FC<StoreFilterProps> = ({
  selectedStore,
  storeOptions,
  handleStoreSelect,
}) => {
  return (
    <Select
      selectedOption={
        selectedStore ? { label: selectedStore, value: selectedStore } : null
      }
      onChange={({ detail }) =>
        handleStoreSelect(detail.selectedOption.value || null)
      }
      options={storeOptions}
      placeholder="Choose a store"
    />
  );
};

export default StoreFilter;
