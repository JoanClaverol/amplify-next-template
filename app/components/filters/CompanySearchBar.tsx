import React, { useState, useEffect } from "react";
import Autosuggest from "@cloudscape-design/components/autosuggest";
import { API_URL } from "app/constants/apiConfig";

interface Company {
  value: string;
  stores: string[];
}

export interface CompanySearchBarProps {
  selectedCompany: string | null;
  onSelect: (company: string) => void;
}

const CompanySearchBar: React.FC<CompanySearchBarProps> = ({
  selectedCompany,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}get-companies-and-stores`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCompanies(
          Object.entries(data.data).map(([company, stores]) => ({
            value: company,
            stores: stores as string[],
          }))
        );
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) setInputValue(selectedCompany);
  }, [selectedCompany]);

  return (
    <Autosuggest
      onChange={({ detail }) => setInputValue(detail.value)}
      onSelect={({ detail }) => onSelect(detail.value)}
      value={inputValue}
      options={companies}
      ariaLabel="Company search"
      placeholder="Search for a company"
      empty="No matches found"
      disabled={isLoading}
      statusType={isLoading ? "loading" : "finished"}
      enteredTextLabel={(value) => `Use: "${value}"`}
    />
  );
};

export default CompanySearchBar;
