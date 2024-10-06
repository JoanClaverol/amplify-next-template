import React from "react";
import { Select, Box } from "@cloudscape-design/components";

interface AdvertisingCampaignFilterProps {
  selectedStartDate: string | null;
  startDateOptions: { label: string; value: string }[];
  handleStartDateSelect: (startDate: string) => void;
}

const AdvertisingCampaignFilter: React.FC<AdvertisingCampaignFilterProps> = ({
  selectedStartDate,
  startDateOptions,
  handleStartDateSelect,
}) => {
  return (
    <Select
      selectedOption={
        selectedStartDate
          ? { label: selectedStartDate, value: selectedStartDate }
          : null
      }
      onChange={({ detail }) =>
        handleStartDateSelect(detail.selectedOption.value || "")
      }
      options={startDateOptions}
      placeholder="Choose a campaign start date"
    />
  );
};

export default AdvertisingCampaignFilter;
