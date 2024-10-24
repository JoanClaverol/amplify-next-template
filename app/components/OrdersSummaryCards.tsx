import React from "react";
import { ColumnLayout, Box, Container } from "@cloudscape-design/components";
import { OrderData } from "../types/orderTypes";

interface SummaryCardsProps {
  summary: OrderData;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <ColumnLayout columns={3} variant="text-grid">
      <Container header={<h2>Unique Orders</h2>}>
        <Box variant="awsui-key-label">Count</Box>
        <Box variant="awsui-value-large">{summary["Unique Orders"]}</Box>
      </Container>
      <Container header={<h2>Average Ticket</h2>}>
        <Box variant="awsui-key-label">Amount</Box>
        <Box variant="awsui-value-large">
          {summary["Average Ticket"].toFixed(2)}
        </Box>
      </Container>
      <Container header={<h2>Promotions</h2>}>
        <Box variant="awsui-key-label">Orders with Promotions</Box>
        <Box variant="awsui-value-large">
          {summary["Number of Orders with Promotions"]}
        </Box>
        <Box variant="awsui-key-label">Spending in Promotions</Box>
        <Box variant="awsui-value-large">
          {summary["Spending in Promotions"].toFixed(2)}
        </Box>
      </Container>
      {/* Add more containers for other metrics as needed */}
    </ColumnLayout>
  );
};
