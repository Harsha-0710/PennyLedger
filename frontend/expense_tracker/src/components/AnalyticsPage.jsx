import { useNavigate } from "react-router-dom";
import '../styles/AnalyticsPage.css';

export default function AnalyticsPage() {
  const navigate = useNavigate();

  const charts = [
    { name: "Spending by Category", path: "/analytics/category" },
    { name: "Monthly Comparison", path: "/analytics/monthly" },
    { name: "Top Vendors", path: "/analytics/vendors" }
  ];

  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p className="dashboard-subtitle">Track your spending trends</p>
        </div>
      </header>

      <section className="dashboard-panel">
        <div className="analytics-list">
          {charts.map((chart) => (
            <div
              key={chart.name}
              className="analytics-card"
              onClick={() => navigate(chart.path)}
            >
              <h3>{chart.name}</h3>
              <p>Click to view detailed chart</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}