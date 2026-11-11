import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  FaChartLine,
  FaMoneyBillWave,
  FaWallet,
  FaBoxes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaRobot,
  FaBrain,
  FaArrowUp,
  FaArrowDown,
  FaCube,
  FaShieldAlt,
  FaLightbulb,
  FaHome,
  FaShoppingCart,
  FaFileAlt,
  FaCog,
  FaBars,
  FaTimes,
  FaSyncAlt,
  FaFlask,
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
import "./Dashboard.css";


function Dashboard() {

  /* =====================================================
     STATES
  ===================================================== */

  const [dashboardData, setDashboardData] = useState(null);

  const [salesTrend, setSalesTrend] = useState([]);

  const [expenseTrend, setExpenseTrend] = useState([]);

  const [riskData, setRiskData] = useState(null);

  const [predictionData, setPredictionData] = useState(null);

  const [diagnosisData, setDiagnosisData] = useState(null);

  // SMART ALERTS
  const [alertsData, setAlertsData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadDashboard();
  }, []);


  /* =====================================================
     LOAD DASHBOARD DATA
  ===================================================== */

  const loadDashboard = async () => {

    try {

      setRefreshing(true);

      const [
        dashboardResponse,
        salesResponse,
        expenseResponse,
        riskResponse,
        predictionResponse,
        diagnosisResponse,
        alertsResponse,
      ] = await Promise.all([

        API.get("/dashboard"),

        API.get("/sales-trend"),

        API.get("/expense-trend"),

        API.get("/risk-meter"),

        API.get("/predict-sales"),

        API.get("/diagnosis"),

        API.get("/smart-alerts"),

      ]);


      /* =================================================
         DASHBOARD
      ================================================= */

      setDashboardData(
        dashboardResponse.data
      );


      /* =================================================
         SALES TREND
      ================================================= */

      const salesData =
        Array.isArray(salesResponse.data)
          ? salesResponse.data
          : Array.isArray(
              salesResponse.data?.sales
            )
          ? salesResponse.data.sales
          : [];


      setSalesTrend(salesData);


      /* =================================================
         EXPENSE TREND
      ================================================= */

      const expenseData =
        Array.isArray(expenseResponse.data)
          ? expenseResponse.data
          : Array.isArray(
              expenseResponse.data?.expenses
            )
          ? expenseResponse.data.expenses
          : [];


      setExpenseTrend(expenseData);


      /* =================================================
         RISK
      ================================================= */

      setRiskData(
        riskResponse.data
      );


      /* =================================================
         PREDICTION
      ================================================= */

      setPredictionData(
        predictionResponse.data
      );


      /* =================================================
         DIAGNOSIS
      ================================================= */

      setDiagnosisData(
        diagnosisResponse.data
      );


      /* =================================================
         SMART ALERTS
      ================================================= */

      setAlertsData(
        alertsResponse.data
      );


      /* =================================================
         DEBUG LOGS
      ================================================= */

      console.log(
        "Dashboard:",
        dashboardResponse.data
      );

      console.log(
        "Sales Trend:",
        salesData
      );

      console.log(
        "Expense Trend:",
        expenseData
      );

      console.log(
        "Risk:",
        riskResponse.data
      );

      console.log(
        "Prediction:",
        predictionResponse.data
      );

      console.log(
        "Diagnosis:",
        diagnosisResponse.data
      );

      console.log(
        "Smart Alerts:",
        alertsResponse.data
      );

    }

    catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

    }

    finally {

      setLoading(false);

      setRefreshing(false);

    }

  };


  /* =====================================================
     INITIAL LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="dashboard-loading">

        <div className="loading-spinner"></div>

        <p>
          Loading Business Monitor...
        </p>

      </div>

    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (!dashboardData) {

    return (

      <div className="dashboard-error">

        <FaExclamationTriangle />

        <h2>
          Unable to load dashboard
        </h2>

        <p>
          Please make sure the Flask backend is running.
        </p>

        <button
          onClick={loadDashboard}
        >
          Try Again
        </button>

      </div>

    );

  }


  /* =====================================================
     DASHBOARD VALUES
  ===================================================== */

  const healthScore = Number(
    dashboardData.health_score ?? 0
  );


  const totalSales = Number(
    dashboardData.total_sales ?? 0
  );


  const totalExpenses = Number(
    dashboardData.total_expenses ?? 0
  );


  const profit = Number(
    dashboardData.profit ?? 0
  );


  const totalProducts = Number(
    dashboardData.total_products ?? 0
  );


  const inStock = Number(
    dashboardData.in_stock ?? 0
  );


  const lowStock = Number(
    dashboardData.low_stock ?? 0
  );


  const outOfStock = Number(
    dashboardData.out_of_stock ?? 0
  );


  const predictedSales = Number(
    predictionData?.predicted_sales ?? 0
  );


  const riskScore = Number(
    riskData?.risk_score ?? 0
  );


  const riskLevel =
    riskData?.risk_level ||
    "LOW";


  const businessStatus =
    diagnosisData?.overall_status ||
    dashboardData.status ||
    "Needs Attention";


  const recommendations =
    Array.isArray(
      diagnosisData?.prescriptions
    )
      ? diagnosisData.prescriptions
      : dashboardData.recommendation
      ? [dashboardData.recommendation]
      : [
          "Continue monitoring your business performance."
        ];


  const findings =
    Array.isArray(
      diagnosisData?.diagnosis
    )
      ? diagnosisData.diagnosis
      : [];


  /* =====================================================
     SMART ALERT VALUES
  ===================================================== */

  const smartAlerts =
    Array.isArray(
      alertsData?.alerts
    )
      ? alertsData.alerts
      : [];


  const alertCount =
    Number(
      alertsData?.alert_count ?? 0
    );


  /* =====================================================
     MONEY FORMAT
  ===================================================== */

  const formatMoney = (value) => {

    return `₹${Number(
      value || 0
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;

  };


  /* =====================================================
     HEALTH LABEL
  ===================================================== */

  const getHealthLabel = () => {

    if (healthScore >= 80) {
      return "Excellent";
    }

    if (healthScore >= 60) {
      return "Good";
    }

    if (healthScore >= 40) {
      return "Needs Attention";
    }

    return "Critical";

  };


  /* =====================================================
     HEALTH CLASS
  ===================================================== */

  const getHealthClass = () => {

    if (healthScore >= 80) {
      return "health-excellent";
    }

    if (healthScore >= 60) {
      return "health-good";
    }

    if (healthScore >= 40) {
      return "health-warning";
    }

    return "health-critical";

  };


  /* =====================================================
     RISK CLASS
  ===================================================== */

  const getRiskClass = () => {

    if (
      riskLevel === "HIGH" ||
      riskLevel === "High Risk"
    ) {
      return "risk-high";
    }

    if (
      riskLevel === "MEDIUM" ||
      riskLevel === "Medium Risk"
    ) {
      return "risk-medium";
    }

    return "risk-low";

  };


  /* =====================================================
     DIAGNOSIS CLASS
  ===================================================== */

  const diagnosisClass =
    businessStatus
      .toLowerCase()
      .replace(/\s+/g, "-");


  /* =====================================================
     MAIN UI
  ===================================================== */

  return (

    <div className="dashboard-page">


      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <button
        className="mobile-menu-btn"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
      >

        {sidebarOpen
          ? <FaTimes />
          : <FaBars />
        }

      </button>


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >


        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="logo-icon">

            <FaBrain />

          </div>

          <div>

            <h2>
              AI
            </h2>

            <span>
              Business Monitor
            </span>

          </div>

        </div>


        {/* MAIN MENU */}

        <div className="sidebar-section-title">
          MAIN MENU
        </div>


        <nav className="sidebar-nav">


          {/* DASHBOARD */}

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FaHome />

            <span>
              Dashboard
            </span>

          </NavLink>


          {/* SALES */}

          <NavLink
            to="/sales"
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FaShoppingCart />

            <span>
              Sales
            </span>

          </NavLink>


          {/* EXPENSES */}

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FaMoneyBillWave />

            <span>
              Expenses
            </span>

          </NavLink>


          {/* INVENTORY */}

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FaBoxes />

            <span>
              Inventory
            </span>

          </NavLink>


          {/* PROFIT LEAKAGE */}

          <NavLink
            to="/profit-leakage"
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FaChartLine />

            <span>
              Profit Leakage
            </span>

          </NavLink>


          {/* =================================================
              WHAT-IF SIMULATOR
          ================================================= */}

          <NavLink
            to="/what-if"
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FaFlask />

            <span>
              What-If Simulator
            </span>

          </NavLink>


          {/* REPORTS */}

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FaFileAlt />

            <span>
              Reports
            </span>

          </NavLink>

        </nav>


        {/* SETTINGS */}

        <div className="sidebar-section-title settings-title">
          SETTINGS
        </div>


        <nav className="sidebar-nav">

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
            onClick={() =>
              setSidebarOpen(false)
            }
          >

            <FaCog />

            <span>
              Settings
            </span>

          </NavLink>

        </nav>


        {/* PROFILE */}

        <div className="sidebar-bottom">

          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">

            <strong>
              Admin
            </strong>

            <span>
              Business Owner
            </span>

          </div>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dashboard-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="dashboard-header">

          <div>

            <p className="breadcrumb">
              Overview
            </p>

            <h1>
              Business Dashboard
            </h1>

            <p className="header-description">
              Monitor your business performance
              and AI insights
            </p>

          </div>


          <div className="header-right">


            {/* LIVE DATA */}

            <div className="live-indicator">

              <span className="live-dot"></span>

              Live Data

            </div>


            {/* REFRESH */}

            <button
              className="refresh-btn"
              onClick={loadDashboard}
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
                : "Refresh"
              }

            </button>


            {/* PROFILE */}

            <div className="header-profile">

              <div className="header-avatar">
                A
              </div>

              <div>

                <strong>
                  Admin
                </strong>

                <span>
                  Owner
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            FEATURE GRID
        ================================================= */}

        <section className="feature-grid">


          {/* =================================================
              BUSINESS HEALTH
          ================================================= */}

          <div className="feature-card health-feature">

            <div className="feature-content">

              <div className="small-label">
                BUSINESS HEALTH
              </div>

              <h2>
                {healthScore}%
              </h2>

              <div
                className={`health-status ${getHealthClass()}`}
              >

                <span className="status-dot"></span>

                {getHealthLabel()}

              </div>

              <p>
                Overall health based on your
                sales, expenses and business
                performance.
              </p>


              <div className="mini-stats">

                <div>

                  <span>
                    Sales
                  </span>

                  <strong>
                    {formatMoney(totalSales)}
                  </strong>

                </div>


                <div>

                  <span>
                    Profit
                  </span>

                  <strong
                    className={
                      profit < 0
                        ? "negative"
                        : "positive"
                    }
                  >
                    {formatMoney(profit)}
                  </strong>

                </div>

              </div>

            </div>


            {/* HEALTH CIRCLE */}

            <div className="health-circle">

              <div
                className="health-progress"
                style={{
                  background:
                    `conic-gradient(
                      #1596a8
                      ${healthScore * 3.6}deg,
                      #dceef0
                      ${healthScore * 3.6}deg
                    )`,
                }}
              >

                <div className="health-inner">

                  <FaBrain />

                  <span>
                    AI
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              AI SALES PREDICTION
          ================================================= */}

          <div className="feature-card prediction-feature">

            <div className="prediction-top">

              <div>

                <div className="small-label">
                  AI SALES PREDICTION
                </div>

                <h3>
                  Tomorrow's Sales
                </h3>

              </div>

              <div className="ai-icon">

                <FaRobot />

              </div>

            </div>


            <div className="prediction-value">

              {formatMoney(
                predictedSales
              )}

            </div>


            <div className="prediction-change">

              <FaArrowUp />

              AI predicted sales

            </div>


            <div className="prediction-bars">

              <span
                style={{
                  height: "32%"
                }}
              ></span>

              <span
                style={{
                  height: "48%"
                }}
              ></span>

              <span
                style={{
                  height: "42%"
                }}
              ></span>

              <span
                style={{
                  height: "65%"
                }}
              ></span>

              <span
                style={{
                  height: "58%"
                }}
              ></span>

              <span
                style={{
                  height: "82%"
                }}
              ></span>

              <span
                style={{
                  height: "72%"
                }}
              ></span>

            </div>

          </div>

        </section>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="summary-grid">


          {/* SALES */}

          <div className="summary-card">

            <div className="summary-icon sales-icon">

              <FaChartLine />

            </div>

            <div className="summary-text">

              <span>
                Total Sales
              </span>

              <h3>
                {formatMoney(totalSales)}
              </h3>

              <small className="positive-text">

                <FaArrowUp />

                Business revenue

              </small>

            </div>

          </div>


          {/* EXPENSES */}

          <div className="summary-card">

            <div className="summary-icon expense-icon">

              <FaWallet />

            </div>

            <div className="summary-text">

              <span>
                Total Expenses
              </span>

              <h3>
                {formatMoney(totalExpenses)}
              </h3>

              <small>
                Operating expenses
              </small>

            </div>

          </div>


          {/* PROFIT */}

          <div className="summary-card">

            <div
              className={`summary-icon ${
                profit < 0
                  ? "loss-icon"
                  : "profit-icon"
              }`}
            >

              {profit < 0
                ? <FaArrowDown />
                : <FaArrowUp />
              }

            </div>

            <div className="summary-text">

              <span>
                Net Profit
              </span>

              <h3
                className={
                  profit < 0
                    ? "negative"
                    : "positive"
                }
              >

                {formatMoney(profit)}

              </h3>

              <small>
                Sales − Expenses
              </small>

            </div>

          </div>


          {/* PRODUCTS */}

          <div className="summary-card">

            <div className="summary-icon inventory-icon">

              <FaCube />

            </div>

            <div className="summary-text">

              <span>
                Total Products
              </span>

              <h3>
                {totalProducts}
              </h3>

              <small>
                Products in inventory
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            INVENTORY OVERVIEW
        ================================================= */}

        <section className="inventory-row">

          <div className="inventory-title">

            <FaBoxes />

            <div>

              <h3>
                Inventory Overview
              </h3>

              <span>
                Current stock status
              </span>

            </div>

          </div>


          <div className="inventory-items">

            <div className="inventory-item">

              <span className="inventory-number">
                {inStock}
              </span>

              <span>
                In Stock
              </span>

            </div>


            <div className="inventory-item warning">

              <span className="inventory-number">
                {lowStock}
              </span>

              <span>
                Low Stock
              </span>

            </div>


            <div className="inventory-item danger">

              <span className="inventory-number">
                {outOfStock}
              </span>

              <span>
                Out of Stock
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            SMART ALERTS
        ================================================= */}

        <section className="smart-alerts-section">


          {/* SMART ALERT HEADER */}

          <div className="smart-alerts-header">

            <div className="smart-alerts-title">

              <div className="smart-alerts-icon">

                <FaExclamationTriangle />

              </div>

              <div>

                <h3>
                  Smart Alerts
                </h3>

                <span>
                  AI-powered business warnings and notifications
                </span>

              </div>

            </div>


            <div className="alert-count">

              {alertCount}

              {" "}

              Alert{alertCount !== 1 ? "s" : ""}

            </div>

          </div>


          {/* NO ALERTS */}

          {smartAlerts.length === 0 ? (

            <div className="no-alerts">

              <FaCheckCircle />

              <div>

                <strong>
                  No active alerts
                </strong>

                <span>
                  Your business currently has no major
                  issues requiring attention.
                </span>

              </div>

            </div>

          ) : (


            /* ALERT LIST */

            <div className="alerts-list">

              {smartAlerts.map(
                (alert, index) => {

                  const alertType =
                    String(
                      alert.type || "Info"
                    ).toLowerCase();


                  return (

                    <div
                      className={`smart-alert alert-${alertType}`}
                      key={index}
                    >


                      {/* ALERT ICON */}

                      <div className="alert-icon">

                        {alertType === "critical" ? (

                          <FaExclamationTriangle />

                        ) : alertType === "warning" ? (

                          <FaExclamationTriangle />

                        ) : (

                          <FaLightbulb />

                        )}

                      </div>


                      {/* ALERT CONTENT */}

                      <div className="alert-content">

                        <div className="alert-top">

                          <strong>
                            {alert.title}
                          </strong>

                          <span className="alert-type">
                            {alert.type}
                          </span>

                        </div>

                        <p>
                          {alert.message}
                        </p>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </section>


        {/* =================================================
            CONTENT GRID
        ================================================= */}

        <section className="content-grid">


          {/* =================================================
              SALES CHART
          ================================================= */}

          <div className="content-card chart-card">

            <div className="card-heading">

              <div>

                <h3>
                  Sales Performance
                </h3>

                <span>
                  Recent sales activity
                </span>

              </div>

              <div className="card-icon">

                <FaChartLine />

              </div>

            </div>


            <div className="chart-wrapper">

              {salesTrend.length === 0 ? (

                <div className="no-chart-data">

                  <FaChartLine />

                  <p>
                    No sales data available yet.
                  </p>

                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={salesTrend}
                  >

                    <defs>

                      <linearGradient
                        id="salesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#1596a8"
                          stopOpacity={0.28}
                        />

                        <stop
                          offset="100%"
                          stopColor="#1596a8"
                          stopOpacity={0.02}
                        />

                      </linearGradient>

                    </defs>


                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#edf1f3"
                    />


                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: 11
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <YAxis
                      tick={{
                        fontSize: 11
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <Tooltip
                      formatter={(value) =>
                        formatMoney(value)
                      }
                    />


                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#1596a8"
                      strokeWidth={3}
                      fill="url(#salesGradient)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>


          {/* =================================================
              EXPENSE CHART
          ================================================= */}

          <div className="content-card chart-card">

            <div className="card-heading">

              <div>

                <h3>
                  Expense Performance
                </h3>

                <span>
                  Recent expense activity
                </span>

              </div>

              <div className="card-icon peach">

                <FaWallet />

              </div>

            </div>


            <div className="chart-wrapper">

              {expenseTrend.length === 0 ? (

                <div className="no-chart-data">

                  <FaWallet />

                  <p>
                    No expense data available yet.
                  </p>

                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={expenseTrend}
                  >

                    <defs>

                      <linearGradient
                        id="expenseGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#e99b72"
                          stopOpacity={0.28}
                        />

                        <stop
                          offset="100%"
                          stopColor="#e99b72"
                          stopOpacity={0.02}
                        />

                      </linearGradient>

                    </defs>


                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#edf1f3"
                    />


                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: 11
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <YAxis
                      tick={{
                        fontSize: 11
                      }}
                      axisLine={false}
                      tickLine={false}
                    />


                    <Tooltip
                      formatter={(value) =>
                        formatMoney(value)
                      }
                    />


                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#e99b72"
                      strokeWidth={3}
                      fill="url(#expenseGradient)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>


          {/* =================================================
              AI DIAGNOSIS
          ================================================= */}

          <div className="content-card diagnosis-card">

            <div className="card-heading">

              <div>

                <h3>
                  AI Business Diagnosis
                </h3>

                <span>
                  Intelligent business analysis
                </span>

              </div>

              <div className="ai-small-icon">

                <FaRobot />

              </div>

            </div>


            {/* STATUS */}

            <div
              className={`diagnosis-status ${diagnosisClass}`}
            >

              {businessStatus === "Critical" ||
              businessStatus === "Needs Attention" ? (

                <FaExclamationTriangle />

              ) : (

                <FaCheckCircle />

              )}


              <div>

                <span>
                  Business Status
                </span>

                <strong>
                  {businessStatus}
                </strong>

              </div>

            </div>


            {/* FINDINGS */}

            <div className="diagnosis-section">

              <div className="section-heading">

                <FaBrain />

                <span>
                  Key Findings
                </span>

              </div>


              {findings.length > 0 ? (

                findings.map(
                  (item, index) => (

                    <div
                      className="diagnosis-item"
                      key={index}
                    >

                      <span className="bullet"></span>

                      <p>
                        {item}
                      </p>

                    </div>

                  )
                )

              ) : (

                <div className="diagnosis-item">

                  <span className="bullet"></span>

                  <p>
                    No major issues detected.
                  </p>

                </div>

              )}

            </div>


            {/* RECOMMENDATIONS */}

            <div className="diagnosis-section">

              <div className="section-heading recommendation-heading">

                <FaLightbulb />

                <span>
                  AI Recommendations
                </span>

              </div>


              {recommendations
                .slice(0, 3)
                .map(
                  (item, index) => (

                    <div
                      className="recommendation-item"
                      key={index}
                    >

                      <span>
                        {index + 1}
                      </span>

                      <p>
                        {item}
                      </p>

                    </div>

                  )
                )}

            </div>

          </div>


          {/* =================================================
              BUSINESS RISK
          ================================================= */}

          <div className="content-card risk-card">

            <div className="card-heading">

              <div>

                <h3>
                  Business Risk
                </h3>

                <span>
                  AI risk assessment
                </span>

              </div>

              <div className="card-icon shield">

                <FaShieldAlt />

              </div>

            </div>


            <div className="risk-main">


              {/* RISK CIRCLE */}

              <div className="risk-circle">

                <div
                  className="risk-circle-progress"
                  style={{
                    "--risk-degree":
                      `${riskScore * 3.6}deg`,

                    "--risk-color":
                      riskLevel === "HIGH" ||
                      riskLevel === "High Risk"
                        ? "#dc6b6b"
                        : riskLevel === "MEDIUM" ||
                          riskLevel === "Medium Risk"
                        ? "#e4aa5d"
                        : "#62a98b",
                  }}
                >

                  <span className="risk-ring-highlight"></span>

                  <div className="risk-circle-inner">

                    <strong>
                      {riskScore}
                    </strong>

                    <span>
                      / 100
                    </span>

                  </div>

                </div>

              </div>


              {/* RISK INFORMATION */}

              <div className="risk-info">

                <span>
                  Risk Level
                </span>

                <strong
                  className={getRiskClass()}
                >
                  {riskLevel}
                </strong>

                <p>
                  Current risk based on sales,
                  expenses and inventory.
                </p>

              </div>

            </div>


            {/* RISK FACTORS */}

            <div className="risk-factors">

              <h4>
                Risk Factors
              </h4>


              {riskData?.risk_factors?.length > 0 ? (

                riskData.risk_factors.map(
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

                <div className="risk-factor safe">

                  <FaCheckCircle />

                  <span>
                    No significant risk factors detected.
                  </span>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            BOTTOM AI INSIGHT
        ================================================= */}

        <section className="bottom-ai-card">

          <div className="bottom-ai-icon">

            <FaRobot />

          </div>


          <div className="bottom-ai-content">

            <span>
              AI BUSINESS INSIGHT
            </span>

            <h3>

              {dashboardData.recommendation ||
                recommendations[0] ||
                "Continue monitoring your business performance."
              }

            </h3>

          </div>


          <div className="bottom-ai-score">

            <span>
              Health Score
            </span>

            <strong>
              {healthScore}%
            </strong>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="dashboard-footer">

          <span>
            AI Business Monitor
          </span>

          <span>
            Intelligent Business Health &
            Decision Support System
          </span>

        </footer>


      </main>

    </div>

  );

}


export default Dashboard;