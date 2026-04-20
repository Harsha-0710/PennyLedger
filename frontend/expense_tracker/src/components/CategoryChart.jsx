import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { useEffect, useState } from "react";
import ChartLayout from "./ChartLayout";

export default function CategoryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("https://pennylegder.onrender.com/analytics/category", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const result = await res.json();

    const formatted = Object.keys(result).map(key => ({
      name: key,
      value: result[key]
    }));

    setData(formatted);
  };

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const top = data.sort((a, b) => b.value - a.value)[0];

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444"];

  return (
    <ChartLayout
      title="Spending by Category"
      insights={
        <>
          <p><strong>Total:</strong> ₹{total}</p>
          <p><strong>Top Category:</strong> {top?.name}</p>
        </>
      }
    >
      <PieChart width={350} height={300}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={70}
          outerRadius={110}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ChartLayout>
  );
}