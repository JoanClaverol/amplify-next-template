import React, { useState, useEffect } from "react";
import Autosuggest from "@cloudscape-design/components/autosuggest";

interface Company {
  value: string;
}

interface CompanySearchBarProps {
  selectedCompany: string | null;
  isLoading: boolean;
  onSelect: (company: string) => void;
}

export default function CompanySearchBar({ selectedCompany, isLoading, onSelect }: CompanySearchBarProps) {
  const [value, setValue] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch('https://y3fglnw1n3.execute-api.eu-west-3.amazonaws.com/Prod/fetch-companies/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedCompanies = data.companies.map((company: string) => ({ value: company }));
        setCompanies(formattedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    }

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      setValue(selectedCompany);
    }
  }, [selectedCompany]);

  const handleChange = ({ detail }: { detail: { value: string } }) => {
    setValue(detail.value);
    onSelect(detail.value);
  };

  return (
    <Autosuggest
      onChange={handleChange}
      value={value}
      options={companies}
      ariaLabel="Company search"
      placeholder="Search for a company"
      empty="No matches found"
      disabled={isLoading}
      statusType={isLoading ? "loading" : "finished"}
    />
  );
}