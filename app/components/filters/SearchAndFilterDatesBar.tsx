// components/SearchAndFilterBar.tsx
"use client";

import React from "react";
import { Grid } from "@cloudscape-design/components";
import CompanySearchBar from "./CompanySearchBar";
import DateRangeSelector from "./DateRangePicker";

interface SearchAndFilterBarProps {
  selectedCompany: string | null;
  isLoading: boolean;
  onSelectCompany: (company: string | null) => void;
  startDate: string | undefined;
  endDate: string | undefined;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  selectedCompany,
  isLoading,
  onSelectCompany,
  startDate,
  endDate,
  onDateRangeChange,
}) => {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 12, xxs: 4 } },
        { colspan: { default: 12, xxs: 8 } },
      ]}
    >
      <div style={{ width: "100%" }}>
        <CompanySearchBar
          selectedCompany={selectedCompany}
          isLoading={isLoading}
          onSelect={onSelectCompany}
        />
      </div>
      <div style={{ width: "100%" }}>
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </Grid>
  );
};

export default SearchAndFilterBar;
