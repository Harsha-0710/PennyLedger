import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import ChartLayout from "./ChartLayout";

export default function MonthlyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("https://pennylegder.onrender.com/analytics/monthly", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const result = await res.json();

    const formatted = Object.keys(result).map(key => ({
      month: key,
      amount: result[key]
    }));

    setData(formatted);
  };

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <ChartLayout
      title="Monthly Spending"
      insights={
        <>
          <p><strong>Total:</strong> ₹{total}</p>
          <p><strong>Months tracked:</strong> {data.length}</p>
        </>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartLayout>
  );
}