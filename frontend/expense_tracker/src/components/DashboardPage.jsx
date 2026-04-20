import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../styles/DashboardPage.css";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("https://pennylegder.onrender.com/get-expenses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Overall totals (constant) */
  const overallTotal = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const overallCount = expenses.length;

  /* 🔹 Categories */
  const categories = ["All", ...new Set(expenses.map(e => e.category))];

  /* 🔹 Filter + Sort */
  const filteredExpenses = expenses
    .filter(e => categoryFilter === "All" || e.category === categoryFilter)
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  /* 🔹 Filtered total */
  const filteredTotal = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <main className="dashboard-main">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">
            Overview of your spending activity
          </p>
        </div>

        <div className="dashboard-status">
          <span>Total</span>
          <strong>₹{overallTotal}</strong>
        </div>
      </header>

      {/* PANEL */}
      <section className="dashboard-panel">
        {/* SUMMARY CARDS */}
        <div className="dashboard-metrics">
          <div className="dashboard-card gradient">
            <span>Total Expenses</span>
            <strong>{overallCount}</strong>
          </div>

          <div className="dashboard-card gradient">
            <span>Total Spent</span>
            <strong>₹{overallTotal}</strong>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="table-header">
          <h2>Recent Expenses</h2>

          <div className="table-controls">
            {/* Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <p className="status">Loading...</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="status">No expenses found</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id || exp._id}>
                      <td>{exp.title}</td>
                      <td>
                        <span className="badge">{exp.category}</span>
                      </td>
                      <td className="amount">₹{exp.amount}</td>
                      <td>
                        {exp.date
                          ? new Date(exp.date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{exp.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FILTERED TOTAL */}
            <div className="table-footer">
              <span>Filtered Total:</span>
              <strong>₹{filteredTotal}</strong>
            </div>
          </>
        )}
      </section>
    </main>
  );
}