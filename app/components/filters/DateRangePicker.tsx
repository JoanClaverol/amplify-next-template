import React, { useState, useEffect } from "react";
import DateRangePicker from "@cloudscape-design/components/date-range-picker";

interface DateRangeSelectorProps {
  startDate?: string; // Expected format: 'DD/MM/YYYY'
  endDate?: string; // Expected format: 'DD/MM/YYYY'
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
}) => {
  const [dateRange, setDateRange] = useState<any>(undefined);

  useEffect(() => {
    if (startDate && endDate) {
      const formatDateForPicker = (dateString: string) => {
        const [day, month, year] = dateString.split("/");
        return `${year}-${month}-${day}`;
      };

      setDateRange({
        type: "absolute",
        startDate: formatDateForPicker(startDate),
        endDate: formatDateForPicker(endDate),
      });
    }
  }, [startDate, endDate]);

  const handleChange = ({ detail }: any) => {
    setDateRange(detail.value);
    if (detail.value.type === "absolute") {
      const formatDateForOutput = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}/${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
      };
      const newStartDate = formatDateForOutput(detail.value.startDate);
      const newEndDate = formatDateForOutput(detail.value.endDate);

      if (onDateRangeChange) {
        onDateRangeChange(newStartDate, newEndDate);
      }
    }
  };

  const isValidRange = (range: any) => {
    return (
      range.type === "absolute" &&
      range.startDate &&
      range.endDate &&
      new Date(range.startDate) <= new Date(range.endDate)
    );
  };

  return (
    <DateRangePicker
      onChange={handleChange}
      value={dateRange}
      placeholder="Select date range (DD/MM/YYYY)"
      i18nStrings={{
        todayAriaLabel: "Today",
        nextMonthAriaLabel: "Next month",
        previousMonthAriaLabel: "Previous month",
        startDateLabel: "Start date",
        endDateLabel: "End date",
        clearButtonLabel: "Clear",
        cancelButtonLabel: "Cancel",
        applyButtonLabel: "Apply",
      }}
      dateOnly={true}
      rangeSelectorMode="absolute-only"
      showClearButton
      isValidRange={isValidRange}
      relativeOptions={[]}
    />
  );
};

export default DateRangeSelector;
