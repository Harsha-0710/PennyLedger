import { useState } from 'react'
import { toast } from 'react-toastify'
import '../styles/AddExpensePage.css'
import Loader from './Loader'


export default function AddExpensePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [expense, setExpense] = useState({
        title: '',
        category: 'Business',
        otherCategory: '',
        amount: '',
        date: '',
        notes: ''
    })

    const categories = ['Business', 'Food', 'Travel', 'Utilities', 'Entertainment', 'Other']

    const displayCategory =
        expense.category === 'Other' && expense.otherCategory
            ? expense.otherCategory
            : expense.category

    const handleExpenseChange = (field) => (event) => {
        setExpense((prev) => ({
            ...prev,
            [field]: event.target.value
        }))
    }

    const handleSaveExpense = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login first");
                return;
            }

            // Optional: basic validation
            if (!expense.title || !expense.amount || !expense.date) {
                toast.error("Please fill all required fields");
                return;
            }

            const res = await fetch("https://pennylegder.onrender.com/add-expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: expense.title,
                    category: expense.category === "Other"
                        ? expense.otherCategory
                        : expense.category,
                    amount: Number(expense.amount),
                    date: expense.date,
                    notes: expense.notes
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save expense");
            }

            toast.success("Expense added successfully 💸");

            // Reset form
            setExpense({
                title: "",
                category: "Business",
                otherCategory: "",
                amount: "",
                date: "",
                notes: ""
            });

        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="dashboard-main">
            <header className="dashboard-header">
                <div>
                    <h1>Add Expense</h1>
                    <p className="dashboard-subtitle">Log a new purchase or bill.</p>
                </div>
                <div className="dashboard-status">
                    <span>Today</span>
                    <strong>April 20, 2026</strong>
                </div>
            </header>

            <section className="dashboard-panel dashboard-expense-page">
                <div className="expense-layout">
                    <div className="expense-form-panel">
                        <div className="expense-section-heading">
                            <h2>Log a new expense</h2>
                            <p>Capture details for every transaction and keep your records organized.</p>
                        </div>

                        <div className="expense-grid">
                            <label className="form-field">
                                <span>Expense Title</span>
                                <input
                                    type="text"
                                    value={expense.title}
                                    onChange={handleExpenseChange('title')}
                                    placeholder="e.g. Office supplies"
                                />
                            </label>

                            <label className="form-field">
                                <span>Category</span>
                                <select value={expense.category} onChange={handleExpenseChange('category')}>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {expense.category === 'Other' && (
                                <label className="form-field full-width">
                                    <span>Specify category</span>
                                    <input
                                        type="text"
                                        className="other-category-input"
                                        value={expense.otherCategory}
                                        onChange={handleExpenseChange('otherCategory')}
                                        placeholder="Enter category name"
                                    />
                                </label>
                            )}

                            <label className="form-field">
                                <span>Amount</span>
                                <div className="input-with-symbol">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={expense.amount}
                                        onChange={handleExpenseChange('amount')}
                                        placeholder="0.00"
                                    />
                                </div>
                            </label>

                            <label className="form-field">
                                <span>Date</span>
                                <input
                                    type="date"
                                    value={expense.date}
                                    onChange={handleExpenseChange('date')}
                                />
                            </label>

                            <label className="form-field full-width">
                                <span>Notes</span>
                                <textarea
                                    rows="5"
                                    value={expense.notes}
                                    onChange={handleExpenseChange('notes')}
                                    placeholder="Add vendor, receipt details, or reminder"
                                />
                            </label>
                        </div>

                        <div className="expense-actions">
                            <button type="button" className="btn btn-primary" onClick={handleSaveExpense}>
                                Save Expense
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setExpense({
                                        title: '',
                                        category: 'Business',
                                        otherCategory: '',
                                        amount: '',
                                        date: '',
                                        notes: ''
                                    })
                                }
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <aside className="expense-summary-panel">
                        <div className="summary-card">
                            <h3>Expense summary</h3>
                            <div className="summary-list">
                                <div>
                                    <span>Title</span>
                                    <strong>{expense.title || 'Not provided'}</strong>
                                </div>
                                <div>
                                    <span>Category</span>
                                    <strong>{displayCategory}</strong>
                                </div>
                                <div>
                                    <span>Amount</span>
                                    <strong>{expense.amount ? `₹${expense.amount}` : '₹0.00'}</strong>
                                </div>
                                <div>
                                    <span>Date</span>
                                    <strong>{expense.date || 'Choose a date'}</strong>
                                </div>
                                <div>
                                    <span>Notes</span>
                                    <strong>{expense.notes || 'No notes added'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="summary-card summary-tip">
                            <h3>Smart tips</h3>
                            <ul>
                                <li>Use categories to make monthly reviews easier.</li>
                                <li>Add notes for fast receipt matching.</li>
                                <li>Log expenses immediately after purchase.</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>

            {isLoading && <Loader fullScreen={true} />}
        </main>
    )
}