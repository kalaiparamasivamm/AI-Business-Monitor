import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBrain,
  FaRobot,
  FaArrowRight,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";

import API from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post("/login", {
        email: email,
        password: password,
      });

      console.log("LOGIN SUCCESS:", response.data);

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else {
        setMessage(
          "Cannot connect to backend. Make sure Flask is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Decorative background shapes */}
      <div className="login-bg-shape shape-one"></div>
      <div className="login-bg-shape shape-two"></div>
      <div className="login-bg-shape shape-three"></div>


      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <section className="login-left">

        <div className="left-content">

          {/* Brand */}
          <div className="login-brand">

            <div className="brand-logo">
              <FaBrain />
            </div>

            <div className="brand-text">
              <h2>AI</h2>
              <span>Business Monitor</span>
            </div>

          </div>


          {/* Main content */}
          <div className="hero-content">

            <div className="hero-label">
              <span></span>
              INTELLIGENT BUSINESS MANAGEMENT
            </div>

            <h1>
              Make smarter
              <br />
              <span>business decisions.</span>
            </h1>

            <p>
              AI Business Monitor helps you understand your
              business performance, identify risks and make
              better decisions using intelligent insights.
            </p>

          </div>


          {/* Colorful AI visual */}
          <div className="ai-visual">

            <div className="visual-orb orb-one"></div>
            <div className="visual-orb orb-two"></div>
            <div className="visual-orb orb-three"></div>


            <div className="ai-visual-content">

              <div className="ai-icon">
                <FaRobot />
              </div>

              <div className="ai-visual-text">

                <span>POWERED BY AI</span>

                <h3>
                  Intelligent
                  <br />
                  Business Insights
                </h3>

                <p>
                  Turn your business data into meaningful
                  insights and actionable decisions.
                </p>

              </div>

            </div>


            {/* Floating icons */}
            <div className="floating-icon icon-chart">
              <FaChartLine />
            </div>

            <div className="floating-icon icon-brain">
              <FaBrain />
            </div>

            <div className="floating-icon icon-light">
              <FaLightbulb />
            </div>

          </div>


          {/* Security information */}
          <div className="security-info">

            <div className="security-icon">
              <FaShieldAlt />
            </div>

            <div>
              <strong>Smart & Secure</strong>

              <span>
                Intelligent tools for modern businesses
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <section className="login-right">

        <div className="login-card">

          {/* Mobile brand */}
          <div className="mobile-brand">

            <div className="brand-logo">
              <FaBrain />
            </div>

            <div className="brand-text">
              <h2>AI</h2>
              <span>Business Monitor</span>
            </div>

          </div>


          {/* Heading */}
          <div className="login-heading">

            <span className="welcome-text">
              WELCOME BACK
            </span>

            <h1>
              Sign in to your
              <br />
              <span>Business Monitor</span>
            </h1>

            <p>
              Access your business dashboard and
              intelligent insights.
            </p>

          </div>


          {/* Login form */}
          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="form-group">

              <label>Email Address</label>

              <div className="input-box">

                <div className="input-symbol">
                  @
                </div>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>


            {/* Password */}
            <div className="form-group">

              <label>Password</label>

              <div className="input-box">

                <div className="input-symbol password-symbol">
                  •
                </div>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>


            {/* Login button */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </span>

              {!loading && (
                <FaArrowRight />
              )}

            </button>

          </form>


          {/* Message */}
          {message && (
            <div
              className={`login-message ${
                message
                  .toLowerCase()
                  .includes("successful")
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}


          {/* Register */}
          <div className="register-section">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>


          {/* Bottom */}
          <div className="login-footer">

            <span>
              AI Business Monitor
            </span>

            <span>
              Business Intelligence Platform
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;