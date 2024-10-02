"use client";

import { useState } from "react";
import AdvertisingComponent from "./backend/AdvertisingComponent";
import CompanySearchBar from "./backend/CompanySearchBar";
import { ContentLayout, Container, Header } from "@cloudscape-design/components";

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Search for a company to view advertising data">
          Company Advertising Dashboard
        </Header>
      }
    >
      <Container>
        <CompanySearchBar
          selectedCompany={selectedCompany}
          isLoading={isLoading}
          onSelect={setSelectedCompany}
        />
        {selectedCompany && (
          <AdvertisingComponent 
            selectedCompany={selectedCompany} 
            isLoading={isLoading} 
          />
        )}
      </Container>
    </ContentLayout>
  );
}
