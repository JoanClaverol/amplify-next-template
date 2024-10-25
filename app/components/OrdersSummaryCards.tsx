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
        header="Facturación"
        label="Total Facturado"
        value={`${summary["Total Refund Amount"].toFixed(2)}€`}
      />
      <SummaryCard
        header="Pedidos"
        label="Pedidos Únicos"
        value={summary["Unique Orders"]}
      />
      <SummaryCard
        header="Ticket Promedio"
        label=""
        value={`${summary["Average Ticket"].toFixed(2)}€`}
      />

      <SummaryCard
        header="Reembolsos"
        label=""
        value={`${summary["Reimbursements"].toFixed(2)}€`}
      />
      <Container header={<h2>Detalles de Promociones</h2>}>
        <ColumnLayout columns={2} variant="text-grid">
          <Box>
            <Box variant="awsui-key-label">Pedidos con promociones</Box>
            <Box variant="awsui-value-large">
              {summary["Number of Orders with Promotions"]}
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Gastos</Box>
            <Box variant="awsui-value-large">
              {summary["Spending in Promotions"].toFixed(2)}€
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Ventas</Box>
            <Box variant="awsui-value-large">
              {summary["Sells in Promotions"].toFixed(2)}€
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">Tasa de Esfuerzo</Box>
            <Box variant="awsui-value-large">
              {(summary["Effort Rate"] * 100).toFixed(2)}%
            </Box>
          </Box>
          <Box>
            <Box variant="awsui-key-label">ROAS</Box>
            <Box variant="awsui-value-large">
              {summary["ROAS in Promotions"].toFixed(2)}€
            </Box>
          </Box>
        </ColumnLayout>
      </Container>
    </Grid>
  );
};
