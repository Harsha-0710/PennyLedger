import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import ChartLayout from "./ChartLayout";

export default function VendorChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("https://pennylegder.onrender.com/analytics/vendors", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const result = await res.json();

    let formatted = Object.keys(result).map(key => ({
      name: key,
      amount: result[key]
    }));

    formatted = formatted
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    setData(formatted);
  };

  const top = data[0];

  return (
    <ChartLayout
      title="Top Vendors"
      insights={
        <>
          <p><strong>Top Vendor:</strong> {top?.name}</p>
          <p><strong>Top Spend:</strong> ₹{top?.amount}</p>
        </>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data}>
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="amount" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </ChartLayout>
  );
}