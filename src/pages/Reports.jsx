import { useEffect, useState } from "react";

import {
  FaChartBar,
  FaMoneyBillWave,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaRobot,
  FaShieldAlt,
  FaLightbulb,
  FaPrint,
  FaSyncAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBrain,
  FaChartLine,
  FaBoxes,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import API from "../services/api";
import "./Reports.css";

function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [expenseTrend, setExpenseTrend] = useState([]);
  const [risk, setRisk] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [profitLeakage, setProfitLeakage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD ALL REPORT DATA
  // =========================================================

  const loadReports = async () => {
    try {
      setRefreshing(true);
      setError("");

      const [
        dashboardResponse,
        salesResponse,
        expenseResponse,
        riskResponse,
        predictionResponse,
        diagnosisResponse,
        leakageResponse,
      ] = await Promise.all([
        API.get("/dashboard"),
        API.get("/sales-trend"),
        API.get("/expense-trend"),
        API.get("/risk-meter"),
        API.get("/predict-sales"),
        API.get("/diagnosis"),
        API.get("/profit-leakage"),
      ]);

      const dashboardData = dashboardResponse.data || {};

      const salesData = Array.isArray(salesResponse.data)
        ? salesResponse.data
        : Array.isArray(salesResponse.data?.sales)
        ? salesResponse.data.sales
        : [];

      const expenseData = Array.isArray(expenseResponse.data)
        ? expenseResponse.data
        : Array.isArray(expenseResponse.data?.expenses)
        ? expenseResponse.data.expenses
        : [];

      setDashboard(dashboardData);
      setSalesTrend(salesData);
      setExpenseTrend(expenseData);
      setRisk(riskResponse.data || {});
      setPrediction(predictionResponse.data || {});
      setDiagnosis(diagnosisResponse.data || {});
      setProfitLeakage(leakageResponse.data || {});
    } catch (err) {
      console.error("REPORT ERROR:", err);
      setError("Unable to load business report.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // =========================================================
  // MONEY FORMAT
  // =========================================================

  const money = (value) =>
    `₹${Number(value ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="reports-spinner"></div>
        <p>Generating business report...</p>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="reports-error">
        <FaExclamationTriangle />

        <h2>{error}</h2>

        <button onClick={loadReports}>Try Again</button>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD DATA
  // =========================================================

  const totalSales = Number(dashboard?.total_sales ?? 0);

  const totalExpenses = Number(dashboard?.total_expenses ?? 0);

  const profit = Number(dashboard?.profit ?? 0);

  const healthScore = Number(dashboard?.health_score ?? 0);

  const totalProducts = Number(dashboard?.total_products ?? 0);

  const lowStock = Number(dashboard?.low_stock ?? 0);

  const outOfStock = Number(dashboard?.out_of_stock ?? 0);

  // =========================================================
  // RISK DATA
  // =========================================================

  const riskScore = Number(risk?.risk_score ?? 0);

  const riskLevel = risk?.risk_level || "LOW";

  // =========================================================
  // PREDICTION DATA
  // =========================================================

  const predictedSales = Number(prediction?.predicted_sales ?? 0);

  // =========================================================
  // DIAGNOSIS DATA
  // =========================================================

  const diagnoses = Array.isArray(diagnosis?.diagnosis)
    ? diagnosis.diagnosis
    : [];

  const riskFactors = Array.isArray(risk?.risk_factors)
    ? risk.risk_factors
    : [];

  // =========================================================
  // HEALTH CLASS
  // =========================================================

  const healthClass =
    healthScore >= 80
      ? "excellent"
      : healthScore >= 60
      ? "good"
      : healthScore >= 40
      ? "attention"
      : "critical";

  // =========================================================
  // RISK CLASS
  // =========================================================

  const riskClass =
    riskScore >= 70
      ? "high"
      : riskScore >= 40
      ? "medium"
      : "low";

  // =========================================================
  // PROFIT LEAKAGE DATA
  // =========================================================

  const leakageScore = Number(
    profitLeakage?.leakage_score ?? 0
  );

  const leakageLevel =
    profitLeakage?.leakage_level || "Low Leakage";

  const expenseRatio = Number(
    profitLeakage?.expense_ratio ?? 0
  );

  const leakageAreas = Array.isArray(
    profitLeakage?.leakage_areas
  )
    ? profitLeakage.leakage_areas
    : [];

  const topExpenses = Array.isArray(
    profitLeakage?.top_expenses
  )
    ? profitLeakage.top_expenses
    : [];

  const leakageRecommendation =
    profitLeakage?.recommendation ||
    "Continue monitoring expenses, sales and inventory.";

  const leakageSummary =
    profitLeakage?.summary ||
    "No major profit leakage detected.";

  // =========================================================
  // LEAKAGE CLASS
  // =========================================================

  const leakageClass =
    leakageScore >= 70
      ? "high"
      : leakageScore >= 40
      ? "medium"
      : "low";

  return (
    <div className="reports-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="reports-header">

        <div>

          <div className="reports-title-row">

            <FaChartBar />

            <h1>Business Reports</h1>

          </div>

          <p>
            AI-powered analysis of your business performance
          </p>

        </div>

        <div className="reports-actions">

          <button
            className="report-refresh-btn"
            onClick={loadReports}
            disabled={refreshing}
          >

            <FaSyncAlt
              className={
                refreshing
                  ? "refresh-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

          <button
            className="report-print-btn"
            onClick={handlePrint}
          >

            <FaPrint />

            Print Report

          </button>

        </div>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="report-summary-grid">

        {/* SALES */}

        <div className="report-card sales-card">

          <div className="report-card-icon">
            <FaMoneyBillWave />
          </div>

          <div>

            <span>Total Sales</span>

            <h2>
              {money(totalSales)}
            </h2>

            <small>
              <FaArrowUp />
              Business revenue
            </small>

          </div>

        </div>

        {/* EXPENSES */}

        <div className="report-card expense-card">

          <div className="report-card-icon">
            <FaWallet />
          </div>

          <div>

            <span>Total Expenses</span>

            <h2>
              {money(totalExpenses)}
            </h2>

            <small>
              <FaArrowDown />
              Operating expenses
            </small>

          </div>

        </div>

        {/* PROFIT */}

        <div className="report-card profit-card">

          <div className="report-card-icon">

            {profit >= 0 ? (
              <FaArrowUp />
            ) : (
              <FaArrowDown />
            )}

          </div>

          <div>

            <span>Net Profit</span>

            <h2
              className={
                profit >= 0
                  ? "positive"
                  : "negative"
              }
            >
              {money(profit)}
            </h2>

            <small>

              {profit >= 0
                ? "Business is profitable"
                : "Business is running at a loss"}

            </small>

          </div>

        </div>

        {/* HEALTH */}

        <div className="report-card health-card-report">

          <div className="report-card-icon">
            <FaBrain />
          </div>

          <div>

            <span>AI Health Score</span>

            <h2>
              {healthScore}%
            </h2>

            <small className={healthClass}>

              {healthScore >= 80
                ? "Excellent"
                : healthScore >= 60
                ? "Good"
                : healthScore >= 40
                ? "Needs Attention"
                : "Critical"}

            </small>

          </div>

        </div>

      </div>

      {/* =====================================================
          BUSINESS OVERVIEW
      ===================================================== */}

      <div className="report-section">

        <div className="section-heading">

          <FaChartBar />

          <div>

            <h2>
              Business Performance Overview
            </h2>

            <p>
              Current business health and operational summary
            </p>

          </div>

        </div>

        <div className="overview-grid">

          <div className="overview-box">

            <span>Products</span>

            <strong>
              {totalProducts}
            </strong>

          </div>

          <div className="overview-box">

            <span>Low Stock</span>

            <strong className="warning-number">
              {lowStock}
            </strong>

          </div>

          <div className="overview-box">

            <span>Out of Stock</span>

            <strong className="danger-number">
              {outOfStock}
            </strong>

          </div>

          <div className="overview-box">

            <span>Profit Margin</span>

            <strong>

              {totalSales > 0
                ? `${(
                    (profit / totalSales) *
                    100
                  ).toFixed(1)}%`
                : "0%"}

            </strong>

          </div>

        </div>

      </div>

      {/* =====================================================
          SALES + EXPENSE CHARTS
      ===================================================== */}

      <div className="report-chart-grid">

        {/* SALES CHART */}

        <div className="report-chart-card">

          <div className="chart-heading">

            <div>

              <h3>Sales Trend</h3>

              <p>
                Sales performance over time
              </p>

            </div>

            <FaMoneyBillWave />

          </div>

          {salesTrend.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <AreaChart data={salesTrend}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  formatter={(value) =>
                    money(value)
                  }
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />

              </AreaChart>

            </ResponsiveContainer>

          ) : (

            <div className="empty-chart">
              No sales trend data available
            </div>

          )}

        </div>

        {/* EXPENSE CHART */}

        <div className="report-chart-card">

          <div className="chart-heading">

            <div>

              <h3>Expense Trend</h3>

              <p>
                Expense pattern over time
              </p>

            </div>

            <FaWallet />

          </div>

          {expenseTrend.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <AreaChart data={expenseTrend}>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  formatter={(value) =>
                    money(value)
                  }
                />

                <Area
                  type="monotone"
                  dataKey="expenses"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />

              </AreaChart>

            </ResponsiveContainer>

          ) : (

            <div className="empty-chart">
              No expense trend data available
            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          PROFIT LEAKAGE SECTION
      ===================================================== */}

      <div className="report-section profit-leakage-report">

        <div className="section-heading">

          <FaChartLine />

          <div>

            <h2>
              AI Profit Leakage Analysis
            </h2>

            <p>
              Areas where your business may be losing potential profit
            </p>

          </div>

        </div>

        {/* LEAKAGE SUMMARY */}

        <div className="leakage-report-summary">

          <div className="leakage-score-box">

            <div
              className={`leakage-circle ${leakageClass}`}
            >

              <strong>
                {leakageScore}
              </strong>

              <span>
                / 100
              </span>

            </div>

            <div>

              <span>
                Leakage Score
              </span>

              <h3 className={leakageClass}>
                {leakageLevel}
              </h3>

            </div>

          </div>

          <div className="leakage-financial-box">

            <div>

              <span>
                Expense / Sales
              </span>

              <strong>
                {expenseRatio.toFixed(2)}%
              </strong>

            </div>

            <div>

              <span>
                Potential Loss
              </span>

              <strong
                className={
                  profit < 0
                    ? "negative"
                    : "positive"
                }
              >

                {profit < 0
                  ? money(Math.abs(profit))
                  : money(0)}

              </strong>

            </div>

          </div>

        </div>

        {/* LEAKAGE SUMMARY MESSAGE */}

        <div
          className={`leakage-message ${leakageClass}`}
        >

          <FaExclamationTriangle />

          <span>
            {leakageSummary}
          </span>

        </div>

        {/* LEAKAGE AREAS */}

        <div className="leakage-area-section">

          <h3>

            <FaChartLine />

            Detected Leakage Areas

          </h3>

          {leakageAreas.length > 0 ? (

            <div className="leakage-area-grid">

              {leakageAreas.map(
                (area, index) => (

                  <div
                    className={`leakage-area-card ${
                      area.severity
                        ? area.severity.toLowerCase()
                        : "medium"
                    }`}
                    key={index}
                  >

                    <div className="leakage-area-icon">

                      {area.severity ===
                      "High" ? (
                        <FaExclamationTriangle />
                      ) : (
                        <FaLightbulb />
                      )}

                    </div>

                    <div>

                      <h4>
                        {area.title}
                      </h4>

                      <p>
                        {area.description}
                      </p>

                      <span>
                        {area.severity ||
                          "Medium"}{" "}
                        Impact
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="healthy-message">

              <FaCheckCircle />

              <span>
                No major profit leakage areas detected.
              </span>

            </div>

          )}

        </div>

        {/* TOP EXPENSES */}

        <div className="top-expenses-section">

          <h3>

            <FaWallet />

            Major Expense Areas

          </h3>

          {topExpenses.length > 0 ? (

            <div className="expense-leakage-list">

              {topExpenses.map(
                (expense, index) => (

                  <div
                    className="expense-leakage-row"
                    key={index}
                  >

                    <div>

                      <strong>
                        {expense.expense_name}
                      </strong>

                      <span>

                        {Number(
                          expense.percentage ?? 0
                        ).toFixed(2)}

                        % of total expenses

                      </span>

                    </div>

                    <strong>
                      {money(expense.amount)}
                    </strong>

                  </div>

                )
              )}

            </div>

          ) : (

            <p>
              No expense data available.
            </p>

          )}

        </div>

        {/* =================================================
            AI PROFIT LEAKAGE RECOMMENDATION
        ================================================= */}

        <div className="ai-leakage-recommendation">

          <div className="ai-leakage-recommendation-icon">

            <FaLightbulb />

          </div>

          <div className="ai-leakage-recommendation-content">

            <h3>
              AI Profit Leakage Recommendation
            </h3>

            <p>
              {leakageRecommendation}
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          AI BUSINESS DIAGNOSIS
      ===================================================== */}

      <div className="ai-report-grid">

        {/* DIAGNOSIS */}

        <div className="ai-report-card">

          <div className="ai-report-header">

            <div className="ai-icon">

              <FaRobot />

            </div>

            <div>

              <h2>
                AI Business Diagnosis
              </h2>

              <p>
                AI-generated business analysis
              </p>

            </div>

            <span
              className={`status-badge ${healthClass}`}
            >

              {diagnosis?.overall_status ||
                "Healthy"}

            </span>

          </div>

          <div className="diagnosis-list">

            {diagnoses.length > 0 ? (

              diagnoses.map(
                (item, index) => (

                  <div
                    className="diagnosis-item"
                    key={index}
                  >

                    <FaExclamationTriangle />

                    <span>
                      {item}
                    </span>

                  </div>

                )
              )

            ) : (

              <div className="healthy-message">

                <FaCheckCircle />

                <span>
                  No major business problems detected.
                </span>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          RISK + SALES PREDICTION
      ===================================================== */}

      <div className="risk-prediction-grid">

        {/* RISK */}

        <div className="risk-report-card">

          <div className="risk-heading">

            <div>

              <h2>

                <FaShieldAlt />

                Business Risk Meter

              </h2>

              <p>
                Current operational risk level
              </p>

            </div>

            <span
              className={`risk-badge ${riskClass}`}
            >
              {riskLevel}
            </span>

          </div>

          <div className="risk-score-container">

            <div
              className={`risk-circle ${riskClass}`}
            >

              <strong>
                {riskScore}
              </strong>

              <span>
                / 100
              </span>

            </div>

            <div>

              <h3>
                Risk Score
              </h3>

              <p>

                {riskScore >= 70
                  ? "Immediate attention is recommended."
                  : riskScore >= 40
                  ? "Some business areas need monitoring."
                  : "Business risk is currently under control."}

              </p>

            </div>

          </div>

          <div className="risk-factors">

            <h3>
              Risk Factors
            </h3>

            {riskFactors.length > 0 ? (

              riskFactors.map(
                (factor, index) => (

                  <div
                    className="risk-factor"
                    key={index}
                  >

                    <FaExclamationTriangle />

                    <span>
                      {factor}
                    </span>

                  </div>

                )
              )

            ) : (

              <div className="no-risk">

                <FaCheckCircle />

                No major risk factors detected.

              </div>

            )}

          </div>

        </div>

        {/* PREDICTION */}

        <div className="prediction-report-card">

          <div className="prediction-header">

            <div className="prediction-icon">

              <FaChartBar />

            </div>

            <div>

              <h2>
                Sales Prediction
              </h2>

              <p>
                AI-based next-period forecast
              </p>

            </div>

          </div>

          <div className="prediction-value">

            {money(predictedSales)}

          </div>

          <p className="prediction-description">

            Estimated sales based on the available historical
            sales data.

          </p>

          <div className="prediction-status">

            <FaBrain />

            <span>
              AI Prediction Active
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          INVENTORY INSIGHT
      ===================================================== */}

      <div className="inventory-report-insight">

        <div className="inventory-insight-icon">

          <FaBoxes />

        </div>

        <div>

          <h2>
            Inventory Insight
          </h2>

          <p>

            Your inventory currently contains{" "}

            <strong>
              {totalProducts}
            </strong>{" "}

            products.

            {lowStock > 0 && (
              <>
                {" "}

                <strong>
                  {lowStock}
                </strong>{" "}

                product(s) are running low on stock.
              </>
            )}

            {outOfStock > 0 && (
              <>
                {" "}

                <strong>
                  {outOfStock}
                </strong>{" "}

                product(s) are currently out of stock.
              </>
            )}

            {lowStock === 0 &&
              outOfStock === 0 && (
                <>
                  {" "}

                  Inventory levels are currently healthy.
                </>
              )}

          </p>

        </div>

      </div>

      {/* =====================================================
          FINAL AI INSIGHT
      ===================================================== */}

      <div className="final-insight">

        <div className="final-insight-icon">

          <FaRobot />

        </div>

        <div>

          <h2>
            AI Business Insight
          </h2>

          <p>

            {leakageRecommendation ||
              dashboard?.recommendation ||
              "Continue monitoring sales, expenses and inventory to maintain business performance."}

          </p>

        </div>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="report-footer">

        <span>
          AI Business Monitor
        </span>

        <span>
          AI-Powered Business Intelligence Report
        </span>

      </div>

    </div>
  );
}

export default Reports;