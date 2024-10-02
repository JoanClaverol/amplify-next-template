import { ColumnLayout } from "@cloudscape-design/components";
import { OrderSummary } from "../types/orderTypes";
import { CardContent } from "./CardContent";

interface SummaryCardsProps {
  summary: OrderSummary | null;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <ColumnLayout columns={3} variant="text-grid">
      <CardContent
        title="Total after refund"
        value={summary["Total after refund"]}
        currency="EUR"
      />
      <CardContent
        title="Total Refund Amount"
        value={summary["Total Refund Amount"]}
        currency="EUR"
      />
      <CardContent title="Unique Orders" value={summary["Unique Orders"]} />
    </ColumnLayout>
  );
};
