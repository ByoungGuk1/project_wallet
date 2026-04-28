import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartBox } from "./style";

const monthlyChartData = [
  { month: "1월", income: 3000000, expense: 1200000 },
  { month: "2월", income: 3000000, expense: 1450000 },
  { month: "3월", income: 3000000, expense: 1100000 },
];

function MonthlyChart() {
  return (
    <ChartBox>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={monthlyChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="income" name="수입" />
          <Line type="monotone" dataKey="expense" name="지출" />
        </LineChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default MonthlyChart;
