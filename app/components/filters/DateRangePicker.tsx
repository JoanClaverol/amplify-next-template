import React, { useState, useEffect } from "react";
import DateRangePicker from "@cloudscape-design/components/date-range-picker";

interface DateRangeSelectorProps {
  startDate?: string | null; // Expected format: 'YYYY-MM-DD'
  endDate?: string | null; // Expected format: 'YYYY-MM-DD'
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onDateRangeChange,
}) => {
  const [dateRange, setDateRange] = useState<any>(undefined);

  const formatDateToYYYYMMDD = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const parseYYYYMMDD = (dateString: string): Date => {
    return new Date(dateString);
  };

  useEffect(() => {
    if (startDate && endDate) {
      setDateRange({
        type: "absolute",
        startDate: startDate,
        endDate: endDate,
      });
    }
  }, [startDate, endDate]);

  const handleChange = ({ detail }: any) => {
    setDateRange(detail.value);
    if (detail.value.type === "absolute") {
      const newStartDate = formatDateToYYYYMMDD(
        new Date(detail.value.startDate)
      );
      const newEndDate = formatDateToYYYYMMDD(new Date(detail.value.endDate));

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
      placeholder="Select date range (YYYY-MM-DD)"
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
