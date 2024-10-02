"use client";

import { useState } from "react";
import AdvertisingComponent from "./backend/AdvertisingComponent";
import { ContentLayout, Header, Box } from "@cloudscape-design/components";
import CompanySearchBar from "./components/filters/CompanySearchBar";

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Search for a company and select date range to view advertising data"
        >
          Company Advertising Dashboard
        </Header>
      }
    >
      <Box>
        <CompanySearchBar
          selectedCompany={selectedCompany}
          onSelect={setSelectedCompany}
          isLoading={isLoading}
        />
        {selectedCompany && (
          <AdvertisingComponent
            selectedCompany={selectedCompany}
            isLoading={isLoading}
          />
        )}
      </Box>
    </ContentLayout>
  );
}
