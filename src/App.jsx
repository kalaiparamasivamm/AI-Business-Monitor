import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Expense from "./pages/Expense";
import Products from "./pages/Products";
import ProfitLeakage from "./pages/ProfitLeakage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import WhatIf from "./pages/WhatIf";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            DEFAULT ROUTE
            ===================================================== */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />


        {/* =====================================================
            LOGIN
            ===================================================== */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* =====================================================
            DASHBOARD
            ===================================================== */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =====================================================
            SALES
            ===================================================== */}
        <Route
          path="/sales"
          element={<Sales />}
        />


        {/* =====================================================
            EXPENSES
            ===================================================== */}
        <Route
          path="/expenses"
          element={<Expense />}
        />


        {/* =====================================================
            PRODUCTS
            ===================================================== */}
        <Route
          path="/products"
          element={<Products />}
        />


        {/* =====================================================
            PROFIT LEAKAGE DETECTOR
            ===================================================== */}
        <Route
          path="/profit-leakage"
          element={<ProfitLeakage />}
        />


        {/* =====================================================
            REPORTS
            ===================================================== */}
        <Route
          path="/reports"
          element={<Reports />}
        />


        {/* =====================================================
            SETTINGS
            ===================================================== */}
        <Route
          path="/settings"
          element={<Settings />}
        />


        {/* =====================================================
            WHAT-IF SIMULATOR
            ===================================================== */}
        <Route
          path="/what-if"
          element={<WhatIf />}
        />


        {/* =====================================================
            UNKNOWN ROUTE
            ===================================================== */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;