export default function ChartLayout({ title, children, insights }) {
  return (
    <main className="dashboard-main">
      <header className="dashboard-header">
        <h1>{title}</h1>
      </header>

      <section className="analytics-panel">
        <div className="analytics-content">
          <div className="chart-box">{children}</div>

          <div className="insight-box">
            <h3>Insights</h3>
            {insights}
          </div>
        </div>
      </section>
    </main>
  );
}