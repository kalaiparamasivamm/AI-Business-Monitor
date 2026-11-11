import { useState } from "react";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaCalculator,
  FaLightbulb,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import API from "../services/api";
import "./WhatIf.css";

function WhatIf() {
  const [salesChange, setSalesChange] = useState(0);
  const [expenseChange, setExpenseChange] = useState(0);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const runSimulation = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.post("/what-if", {
        sales_change_percent: Number(salesChange),
        expense_change_percent: Number(expenseChange),
      });

      console.log("What-If API:", response.data);

      setData(response.data);
    } catch (err) {
      console.error("What-If Error:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to run the business simulation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="what-if-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="what-if-header">

        <div className="what-if-header-content">

          <span className="what-if-label">
            AI BUSINESS ANALYTICS
          </span>

          <h1>What-If Simulator</h1>

          <p>
            Simulate changes in sales and expenses to understand
            their possible impact on business profitability.
          </p>

        </div>

        <div className="simulator-header-icon">
          <FaCalculator />
        </div>

      </div>


      {/* =====================================================
          SIMULATION INPUT CARD
      ====================================================== */}

      <div className="simulation-card">

        <div className="simulation-heading">

          <div>

            <span className="section-small-title">
              BUSINESS SCENARIO
            </span>

            <h2>Adjust Business Variables</h2>

          </div>

          <FaChartLine />

        </div>


        {/* =================================================
            SALES CONTROL
        ================================================= */}

        <div className="simulation-control">

          <div className="control-top">

            <div className="control-title">

              <div className="control-icon sales-control">
                <FaChartLine />
              </div>

              <div>

                <h3>Sales Change</h3>

                <p>
                  Increase or decrease expected sales
                </p>

              </div>

            </div>

            <strong className="control-value">

              {salesChange > 0 ? "+" : ""}
              {salesChange}%

            </strong>

          </div>

          <input
            type="range"
            min="-50"
            max="100"
            step="1"
            value={salesChange}
            onChange={(e) =>
              setSalesChange(Number(e.target.value))
            }
          />

          <div className="range-labels">

            <span>-50%</span>
            <span>0%</span>
            <span>+100%</span>

          </div>

        </div>


        {/* =================================================
            EXPENSE CONTROL
        ================================================= */}

        <div className="simulation-control">

          <div className="control-top">

            <div className="control-title">

              <div className="control-icon expense-control">
                <FaMoneyBillWave />
              </div>

              <div>

                <h3>Expense Change</h3>

                <p>
                  Increase or decrease expected expenses
                </p>

              </div>

            </div>

            <strong className="control-value">

              {expenseChange > 0 ? "+" : ""}
              {expenseChange}%

            </strong>

          </div>

          <input
            type="range"
            min="-50"
            max="100"
            step="1"
            value={expenseChange}
            onChange={(e) =>
              setExpenseChange(Number(e.target.value))
            }
          />

          <div className="range-labels">

            <span>-50%</span>
            <span>0%</span>
            <span>+100%</span>

          </div>

        </div>


        {/* =================================================
            RUN SIMULATION
        ================================================= */}

        <button
          className="simulate-btn"
          onClick={runSimulation}
          disabled={loading}
        >

          {loading ? (
            <>
              <FaSyncAlt className="spin" />
              Running Simulation...
            </>
          ) : (
            <>
              <FaCalculator />
              Run Simulation
            </>
          )}

        </button>

      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (

        <div className="simulation-error">

          <FaExclamationTriangle />

          <div>

            <h3>Simulation Failed</h3>

            <p>{error}</p>

          </div>

        </div>

      )}


      {/* =====================================================
          RESULTS
      ====================================================== */}

      {data && !error && (

        <>

          {/* RESULT STATUS */}

          <div
            className={`simulation-result ${
              data.result?.toLowerCase().replace(" ", "-")
            }`}
          >

            <div className="result-icon">

              {data.result === "Improved" ? (
                <FaCheckCircle />
              ) : data.result === "Worsened" ? (
                <FaExclamationTriangle />
              ) : (
                <FaChartLine />
              )}

            </div>

            <div className="result-content">

              <span className="section-small-title">
                SIMULATION RESULT
              </span>

              <h2>{data.result}</h2>

              <p>{data.recommendation}</p>

            </div>

          </div>


          {/* CURRENT VS SIMULATED */}

          <div className="comparison-grid">

            {/* CURRENT */}

            <div className="comparison-card">

              <div className="comparison-header">

                <span>Current Business</span>

                <FaChartLine />

              </div>

              <div className="comparison-row">

                <span>Sales</span>

                <strong>
                  {money(data.current_sales)}
                </strong>

              </div>

              <div className="comparison-row">

                <span>Expenses</span>

                <strong>
                  {money(data.current_expenses)}
                </strong>

              </div>

              <div className="comparison-row profit-row">

                <span>Profit</span>

                <strong>
                  {money(data.current_profit)}
                </strong>

              </div>

            </div>


            {/* SIMULATED */}

            <div className="comparison-card simulated-card">

              <div className="comparison-header">

                <span>Simulated Business</span>

                <FaCalculator />

              </div>

              <div className="comparison-row">

                <span>Sales</span>

                <strong>
                  {money(data.simulated_sales)}
                </strong>

              </div>

              <div className="comparison-row">

                <span>Expenses</span>

                <strong>
                  {money(data.simulated_expenses)}
                </strong>

              </div>

              <div className="comparison-row profit-row">

                <span>Profit</span>

                <strong>
                  {money(data.simulated_profit)}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              PROFIT IMPACT
          ================================================== */}

          <div className="profit-impact-card">

            <div className="profit-impact-icon">

              {Number(data.profit_change) >= 0 ? (
                <FaArrowUp />
              ) : (
                <FaArrowDown />
              )}

            </div>

            <div>

              <span className="section-small-title">
                PROFIT IMPACT
              </span>

              <h2
                className={
                  Number(data.profit_change) >= 0
                    ? "positive-impact"
                    : "negative-impact"
                }
              >
                {Number(data.profit_change) >= 0 ? "+" : ""}
                {money(data.profit_change)}
              </h2>

              <p>
                Expected change in profit under this scenario.
              </p>

            </div>

          </div>


          {/* =================================================
              SCENARIO SUMMARY
          ================================================== */}

          <div className="scenario-card">

            <div className="scenario-icon">
              <FaLightbulb />
            </div>

            <div>

              <span className="section-small-title">
                SCENARIO SUMMARY
              </span>

              <h2>
                Business Changes Applied
              </h2>

              <p>
                Sales change:
                <strong>
                  {" "}
                  {salesChange > 0 ? "+" : ""}
                  {salesChange}%
                </strong>
              </p>

              <p>
                Expense change:
                <strong>
                  {" "}
                  {expenseChange > 0 ? "+" : ""}
                  {expenseChange}%
                </strong>
              </p>

            </div>

          </div>

        </>

      )}

    </div>
  );
}

export default WhatIf;