"use client";

import { useState } from "react";
import AdvertisingComponent from "./backend/AdvertisingComponent";
import CompanySearchBar from "./backend/CompanySearchBar";
import AppLayout from "@cloudscape-design/components/app-layout";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { ContentLayout } from "@cloudscape-design/components";

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppLayout
      content={
        <ContentLayout> 
          <SpaceBetween size="l">
            {selectedCompany && (
              <AdvertisingComponent selectedCompany={selectedCompany} isLoading={isLoading} />
            )}
          </SpaceBetween>
        </ContentLayout>
      }
      navigationOpen={false}
      notifications={
        <CompanySearchBar
          selectedCompany={selectedCompany}
          isLoading={isLoading}
          onSelect={setSelectedCompany}
        />
      }
    />
  );
}
