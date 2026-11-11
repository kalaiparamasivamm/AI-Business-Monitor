import { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaPlus,
  FaTrash,
  FaSyncAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import API from "../services/api";
import "../styles/Expense.css";

function Expense() {
  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    expense_name: "",
    amount: "",
    expense_date: new Date()
      .toISOString()
      .split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
  // LOAD EXPENSES
  // =========================================================
  const loadExpenses = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await API.get("/expenses");

      let expenseData = [];

      // Backend returns array
      if (Array.isArray(response.data)) {
        expenseData = response.data;
      }

      // Backend returns { expenses: [...] }
      else if (
        response.data &&
        Array.isArray(response.data.expenses)
      ) {
        expenseData = response.data.expenses;
      }

      // Normalize data
      expenseData = expenseData.map((expense) => ({
        id: expense.id,

        expense_name:
          expense.expense_name ||
          expense.name ||
          "Unnamed Expense",

        amount: Number(
          expense.amount || 0
        ),

        expense_date:
          expense.expense_date ||
          "-",
      }));

      setExpenses(expenseData);

      console.log(
        "Expenses API:",
        response.data
      );

      console.table(expenseData);
    } catch (error) {
      console.error(
        "Load expenses error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load expenses. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    loadExpenses();
  }, []);

  // =========================================================
  // HANDLE FORM CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // =========================================================
  // ADD EXPENSE
  // =========================================================
  const addExpense = async (e) => {
    e.preventDefault();

    setMessage("");

    // Expense name validation
    if (!form.expense_name.trim()) {
      setMessage("Please enter an expense name.");
      return;
    }

    // Amount validation
    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      setMessage(
        "Please enter a valid expense amount."
      );
      return;
    }

    // Date validation
    if (!form.expense_date) {
      setMessage(
        "Please select an expense date."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/expenses",
        {
          expense_name:
            form.expense_name.trim(),

          amount: Number(form.amount),

          expense_date:
            form.expense_date,
        }
      );

      console.log(
        "EXPENSE SUCCESS:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Expense added successfully."
      );

      // Reset form
      setForm({
        expense_name: "",
        amount: "",
        expense_date: new Date()
          .toISOString()
          .split("T")[0],
      });

      // Reload expense list
      await loadExpenses();

    } catch (error) {
      console.error(
        "Add expense error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to add expense. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE EXPENSE
  // =========================================================
  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await API.delete(
        `/expenses/${id}`
      );

      setMessage(
        "Expense deleted successfully."
      );

      await loadExpenses();

    } catch (error) {
      console.error(
        "Delete expense error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to delete expense."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // TOTAL EXPENSES
  // =========================================================
  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum +
      Number(expense.amount || 0),
    0
  );

  // =========================================================
  // TRANSACTION COUNT
  // =========================================================
  const transactionCount =
    expenses.length;

  // =========================================================
  // FORMAT AMOUNT
  // =========================================================
  const formatAmount = (amount) => {
    return Number(amount || 0).toFixed(2);
  };

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="expense-page">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="expense-header">

        <div className="expense-title-row">

          <div className="expense-icon">
            <FaMoneyBillWave />
          </div>

          <div>
            <h1>
              Expense Management
            </h1>

            <p>
              Record and monitor your business expenses
            </p>
          </div>

        </div>

        <button
          className="expense-refresh-btn"
          onClick={loadExpenses}
          disabled={loading}
        >
          <FaSyncAlt />

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}
      {message && (
        <div className="expense-message">
          {message}
        </div>
      )}

      {/* =====================================================
          SUMMARY
      ===================================================== */}
      <div className="expense-summary">

        {/* TOTAL EXPENSE */}
        <div className="expense-summary-card">

          <div className="expense-summary-icon">
            <FaRupeeSign />
          </div>

          <div>

            <span>
              Total Expenses
            </span>

            <h2>
              ₹{formatAmount(totalExpenses)}
            </h2>

          </div>

        </div>

        {/* TRANSACTIONS */}
        <div className="expense-summary-card">

          <div className="expense-summary-icon">
            <FaFileInvoiceDollar />
          </div>

          <div>

            <span>
              Total Transactions
            </span>

            <h2>
              {transactionCount}
            </h2>

          </div>

        </div>

      </div>

      {/* =====================================================
          ADD EXPENSE
      ===================================================== */}
      <div className="expense-card">

        <div className="expense-card-heading">

          <div>

            <h2>
              Add New Expense
            </h2>

            <p>
              Enter the details of your business expense
            </p>

          </div>

        </div>

        <form
          className="expense-form"
          onSubmit={addExpense}
        >

          {/* EXPENSE NAME */}
          <div className="expense-form-group">

            <label>
              <FaFileInvoiceDollar />
              Expense Name
            </label>

            <input
              type="text"
              name="expense_name"
              placeholder="Example: Electricity Bill"
              value={form.expense_name}
              onChange={handleChange}
              required
            />

          </div>

          {/* AMOUNT */}
          <div className="expense-form-group">

            <label>
              <FaRupeeSign />
              Amount
            </label>

            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
            />

          </div>

          {/* DATE */}
          <div className="expense-form-group">

            <label>
              <FaCalendarAlt />
              Expense Date
            </label>

            <input
              type="date"
              name="expense_date"
              value={form.expense_date}
              onChange={handleChange}
              required
            />

          </div>

          {/* ADD BUTTON */}
          <button
            type="submit"
            className="add-expense-btn"
            disabled={loading}
          >

            <FaPlus />

            {loading
              ? "Adding..."
              : "Add Expense"}

          </button>

        </form>

      </div>

      {/* =====================================================
          EXPENSE HISTORY
      ===================================================== */}
      <div className="expense-card">

        <div className="expense-card-heading expense-table-heading">

          <div>

            <h2>
              Expense History
            </h2>

            <p>
              View all recorded business expenses
            </p>

          </div>

          <span className="expense-count">
            {transactionCount} Transactions
          </span>

        </div>

        {/* LOADING */}
        {loading &&
        expenses.length === 0 ? (

          <div className="empty-expenses">
            Loading expenses...
          </div>

        ) : expenses.length === 0 ? (

          /* EMPTY */
          <div className="empty-expenses">

            <FaMoneyBillWave />

            <h3>
              No expenses recorded yet
            </h3>

            <p>
              Add your first expense using the form above.
            </p>

          </div>

        ) : (

          /* TABLE */
          <div className="expense-table-container">

            <table className="expense-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Expense</th>
                  <th>Amount</th>
                  <th>Expense Date</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {expenses.map(
                  (expense) => (

                    <tr
                      key={expense.id}
                    >

                      {/* ID */}
                      <td>
                        #{expense.id}
                      </td>

                      {/* EXPENSE NAME */}
                      <td>

                        <div className="expense-name">

                          <span className="expense-table-icon">
                            <FaFileInvoiceDollar />
                          </span>

                          <span>
                            {expense.expense_name}
                          </span>

                        </div>

                      </td>

                      {/* AMOUNT */}
                      <td className="expense-amount">

                        ₹
                        {formatAmount(
                          expense.amount
                        )}

                      </td>

                      {/* DATE */}
                      <td>
                        {expense.expense_date}
                      </td>

                      {/* DELETE */}
                      <td>

                        <button
                          type="button"
                          className="expense-delete-btn"
                          onClick={() =>
                            deleteExpense(
                              expense.id
                            )
                          }
                          title="Delete expense"
                        >

                          <FaTrash />

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Expense;