import { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaRupeeSign,
  FaChartLine,
  FaMoneyBillWave,
  FaBoxOpen,
  FaLightbulb,
  FaSyncAlt,
  FaArrowDown,
  FaCheckCircle,
} from "react-icons/fa";

import API from "../services/api";
import "./ProfitLeakage.css";

function ProfitLeakage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProfitLeakage = async () => {
    try {
      setError("");

      const response = await API.get("/profit-leakage");

      console.log("Profit Leakage API:", response.data);

      setData(response.data);
    } catch (err) {
      console.error("Profit Leakage Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load profit leakage information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfitLeakage();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProfitLeakage();
  };

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  if (loading) {
    return (
      <div className="profit-leakage-page">
        <div className="profit-loading">
          <FaSyncAlt className="loading-icon" />
          <p>Analyzing business data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profit-leakage-page">
        <div className="profit-error">
          <FaExclamationTriangle />

          <h3>Unable to Load Profit Leakage</h3>

          <p>{error}</p>

          <button onClick={handleRefresh}>
            <FaSyncAlt />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const leakageScore = Number(data.leakage_score || 0);

  return (
    <div className="profit-leakage-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="profit-header">

        <div className="profit-header-content">

          <span className="profit-label">
            AI BUSINESS ANALYTICS
          </span>

          <h1>Profit Leakage Detector</h1>

          <p>
            Identify areas where your business may be losing
            potential profit.
          </p>

        </div>

        <button
          className="refresh-profit-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FaSyncAlt className={refreshing ? "spin" : ""} />

          {refreshing
            ? "Analyzing..."
            : "Refresh Analysis"}
        </button>

      </div>


      {/* =====================================================
          MAIN SCORE SECTION
      ====================================================== */}

      <div className="leakage-main-card">

        <div className="score-section">

          <div className="score-circle">

            <div className="score-number">
              {leakageScore}
            </div>

            <div className="score-total">
              /100
            </div>

          </div>

          <div className="score-details">

            <span className="section-small-title">
              PROFIT LEAKAGE SCORE
            </span>

            <h2>
              {data.leakage_level}
            </h2>

            <p>
              {data.summary}
            </p>

          </div>

        </div>


        <div className="score-status">

          {leakageScore >= 70 ? (
            <>
              <FaExclamationTriangle />
              <span>
                Immediate Attention Required
              </span>
            </>
          ) : leakageScore >= 40 ? (
            <>
              <FaExclamationTriangle />
              <span>
                Monitor Business Costs
              </span>
            </>
          ) : (
            <>
              <FaCheckCircle />
              <span>
                Business Looks Healthy
              </span>
            </>
          )}

        </div>

      </div>


      {/* =====================================================
          FINANCIAL SUMMARY
      ====================================================== */}

      <div className="financial-grid">

        {/* SALES */}

        <div className="financial-card">

          <div className="financial-icon sales-icon">
            <FaChartLine />
          </div>

          <div className="financial-content">

            <span>Total Sales</span>

            <h3>
              {money(data.total_sales)}
            </h3>

          </div>

        </div>


        {/* EXPENSES */}

        <div className="financial-card">

          <div className="financial-icon expense-icon">
            <FaMoneyBillWave />
          </div>

          <div className="financial-content">

            <span>Total Expenses</span>

            <h3>
              {money(data.total_expenses)}
            </h3>

          </div>

        </div>


        {/* PROFIT / LOSS */}

        <div className="financial-card">

          <div className="financial-icon loss-icon">
            <FaArrowDown />
          </div>

          <div className="financial-content">

            <span>Profit / Loss</span>

            <h3
              className={
                data.profit < 0
                  ? "loss-text"
                  : "profit-text"
              }
            >
              {money(data.profit)}
            </h3>

          </div>

        </div>


        {/* EXPENSE RATIO */}

        <div className="financial-card">

          <div className="financial-icon ratio-icon">
            <FaRupeeSign />
          </div>

          <div className="financial-content">

            <span>Expense Ratio</span>

            <h3>
              {Number(
                data.expense_ratio || 0
              ).toFixed(2)}
              %
            </h3>

          </div>

        </div>

      </div>


      {/* =====================================================
          LEAKAGE AREAS
      ====================================================== */}

      <div className="content-card">

        <div className="card-heading">

          <div>

            <span className="section-small-title">
              AI DETECTION
            </span>

            <h2>
              Detected Leakage Areas
            </h2>

          </div>

          <FaExclamationTriangle />

        </div>


        {data.leakage_areas?.length > 0 ? (

          <div className="leakage-list">

            {data.leakage_areas.map(
              (area, index) => (

                <div
                  className={`leakage-item ${
                    area.severity?.toLowerCase() || ""
                  }`}
                  key={index}
                >

                  <div className="leakage-item-icon">
                    <FaExclamationTriangle />
                  </div>

                  <div className="leakage-item-content">

                    <div className="leakage-title-row">

                      <h3>
                        {area.title}
                      </h3>

                      <span
                        className={`severity-badge ${
                          area.severity?.toLowerCase() || ""
                        }`}
                      >
                        {area.severity}
                      </span>

                    </div>

                    <p>
                      {area.description}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="no-leakage">

            <FaCheckCircle />

            <h3>
              No Major Leakage Detected
            </h3>

            <p>
              Your current business data does not show
              significant profit leakage.
            </p>

          </div>

        )}

      </div>


      {/* =====================================================
          TOP EXPENSES
      ====================================================== */}

      <div className="content-card">

        <div className="card-heading">

          <div>

            <span className="section-small-title">
              COST ANALYSIS
            </span>

            <h2>
              Top Expense Areas
            </h2>

          </div>

          <FaMoneyBillWave />

        </div>


        {data.top_expenses?.length > 0 ? (

          <div className="expense-list">

            {data.top_expenses.map(
              (expense, index) => (

                <div
                  className="expense-row"
                  key={index}
                >

                  <div className="expense-rank">
                    #{index + 1}
                  </div>

                  <div className="expense-info">

                    <div className="expense-name">
                      {expense.expense_name}
                    </div>

                    <div className="expense-progress">

                      <div
                        className="expense-progress-fill"
                        style={{
                          width: `${Math.min(
                            Number(
                              expense.percentage || 0
                            ),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="expense-value">

                    <strong>
                      {money(expense.amount)}
                    </strong>

                    <span>
                      {Number(
                        expense.percentage || 0
                      ).toFixed(2)}
                      %
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-expenses">
            No expense records available.
          </div>

        )}

      </div>


      {/* =====================================================
          AI BUSINESS PRESCRIPTION
      ====================================================== */}

      <div className="recommendation-card">

        <div className="recommendation-icon">
          <FaLightbulb />
        </div>

        <div className="recommendation-content">

          <span className="section-small-title">
            AI BUSINESS PRESCRIPTION
          </span>

          <h2>
            Recommended Action
          </h2>

          <p>
            {data.recommendation}
          </p>

        </div>

      </div>


      {/* =====================================================
          INVENTORY IMPACT
      ====================================================== */}

      <div className="inventory-impact">

        <div className="inventory-icon">
          <FaBoxOpen />
        </div>

        <div className="inventory-content">

          <span className="section-small-title">
            INVENTORY IMPACT
          </span>

          <h3>
            Inventory conditions can affect potential sales
          </h3>

          <p>
            Low-stock and out-of-stock products may cause
            missed sales opportunities. Monitor inventory
            regularly and restock important products on time.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ProfitLeakage;