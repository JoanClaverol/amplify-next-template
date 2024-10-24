import React from "react";
import {
  ColumnLayout,
  Box,
  Container,
  Grid,
} from "@cloudscape-design/components";

interface SummaryCardsProps {
  summary: OrderData;
}
// Update the OrderData interface
interface OrderData {
  "Unique Orders": number;
  "Average Ticket": number;
  "Total Refund Amount": number;
  Reimbursements: number;
  "Number of Orders with Promotions": number;
  "Spending in Promotions": number;
  "Sells in Promotions": number;
  "Effort Rate": number;
  "ROAS in Promotions": number;
}

const SummaryCard: React.FC<{
  header: string;
  label: string;
  value: string | number;
}> = ({ header, label, value }) => (
  <Container header={<h2>{header}</h2>}>
    <Box variant="awsui-key-label">{label}</Box>
    <Box variant="awsui-value-large">{value}</Box>
  </Container>
);

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 12, xxs: 6, m: 4 } },
        { colspan: { default: 12, xxs: 6, m: 4 } },
        { colspan: { default: 12, xxs: 6, m: 4 } },
        { colspan: { default: 12, xxs: 6, m: 4 } },
        { colspan: { default: 12, xxs: 6, m: 4 } },
        { colspan: { default: 12, xxs: 6, m: 4 } },
      ]}
    >
      <SummaryCard
        header="Orders"
        label="Unique Orders"
        value={summary["Unique Orders"]}
      />
      <SummaryCard
        header="Average Ticket"
        label="Amount"
        value={summary["Average Ticket"].toFixed(2)}
      />
      <SummaryCard
        header="Refunds"
        label="Total Refund Amount"
        value={summary["Total Refund Amount"].toFixed(2)}
      />
      <SummaryCard
        header="Reimbursements"
        label="Amount"
        value={summary["Reimbursements"].toFixed(2)}
      />
      <SummaryCard
        header="Promotions"
        label="Orders with Promotions"
        value={summary["Number of Orders with Promotions"]}
      />
      <Container header={<h2>Promotion Details</h2>}>
        <ColumnLayout columns={2} variant="text-grid">
          <Box>
            <Box variant="awsui-key-label">Spending</Box>
            <Box variant="awsui-value-large">
              {summary["Spending in Promotions"].toFixed(2)}
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Sales</Box>
            <Box variant="awsui-value-large">
              {summary["Sells in Promotions"].toFixed(2)}
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Effort Rate</Box>
            <Box variant="awsui-value-large">
              {(summary["Effort Rate"] * 100).toFixed(2)}%
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">ROAS</Box>
            <Box variant="awsui-value-large">
              {summary["ROAS in Promotions"].toFixed(2)}
            </Box>
          </Box>
        </ColumnLayout>
      </Container>
    </Grid>
  );
};
