from flask import Blueprint, jsonify
import sqlite3

from services.ai import calculate_health
from services.risk import calculate_risk
from services.diagnosis import generate_diagnosis
from services.alerts import generate_alerts


dashboard = Blueprint("dashboard", __name__)

DB_NAME = "business.db"


# ============================================================
# DASHBOARD
# ============================================================

@dashboard.route("/dashboard", methods=["GET"])
def get_dashboard():

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:

        # ----------------------------------------------------
        # TOTAL SALES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0)
            FROM sales
        """)

        total_sales = float(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # TOTAL EXPENSES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
        """)

        total_expenses = float(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # TOTAL PRODUCTS
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COUNT(*)
            FROM products
        """)

        total_products = int(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # STOCK ANALYSIS
        # ----------------------------------------------------

        cursor.execute("""
            SELECT stock
            FROM products
        """)

        products = cursor.fetchall()

        low_stock = 0
        out_of_stock = 0

        for product in products:

            stock = int(product["stock"] or 0)

            if stock == 0:
                out_of_stock += 1

            elif stock <= 10:
                low_stock += 1


        # ----------------------------------------------------
        # PROFIT
        # ----------------------------------------------------

        profit = total_sales - total_expenses


        # ----------------------------------------------------
        # AI HEALTH
        # ----------------------------------------------------

        health = calculate_health(
            total_sales,
            total_expenses
        )


        # ----------------------------------------------------
        # AI RISK
        # ----------------------------------------------------

        risk = calculate_risk(
            total_sales,
            total_expenses,
            low_stock,
            out_of_stock
        )


        return jsonify({

            "health_score": health["health_score"],

            "health_status": health["status"],

            "health_recommendation": health["recommendation"],

            "profit": profit,

            "total_sales": total_sales,

            "total_expenses": total_expenses,

            "total_products": total_products,

            "low_stock": low_stock,

            "out_of_stock": out_of_stock,

            "risk_score": risk["risk_score"],

            "risk_level": risk["risk_level"],

            "risk_factors": risk["risk_factors"]

        }), 200


    except Exception as e:

        print("Dashboard Error:", e)

        return jsonify({
            "message": str(e)
        }), 500


    finally:

        conn.close()


# ============================================================
# SALES TREND
# ============================================================

@dashboard.route("/sales-trend", methods=["GET"])
def sales_trend():

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT
                sale_date,
                SUM(total_amount) AS total_sales
            FROM sales
            GROUP BY sale_date
            ORDER BY sale_date
        """)

        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append({

                "date": row["sale_date"],

                "sales": float(row["total_sales"] or 0)

            })

        return jsonify(result), 200


    except Exception as e:

        print("Sales Trend Error:", e)

        return jsonify({
            "message": str(e)
        }), 500


    finally:

        conn.close()


# ============================================================
# EXPENSE TREND
# ============================================================

@dashboard.route("/expense-trend", methods=["GET"])
def expense_trend():

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT
                expense_date,
                SUM(amount) AS total_expenses
            FROM expenses
            GROUP BY expense_date
            ORDER BY expense_date
        """)

        rows = cursor.fetchall()

        result = []

        for row in rows:

            result.append({

                "date": row["expense_date"],

                "expenses": float(row["total_expenses"] or 0)

            })

        return jsonify(result), 200


    except Exception as e:

        print("Expense Trend Error:", e)

        return jsonify({
            "message": str(e)
        }), 500


    finally:

        conn.close()


# ============================================================
# RISK METER
# ============================================================

@dashboard.route("/risk-meter", methods=["GET"])
def risk_meter():

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:

        # ----------------------------------------------------
        # SALES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0)
            FROM sales
        """)

        total_sales = float(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # EXPENSES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
        """)

        total_expenses = float(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # STOCK
        # ----------------------------------------------------

        cursor.execute("""
            SELECT stock
            FROM products
        """)

        products = cursor.fetchall()

        low_stock = 0
        out_of_stock = 0

        for product in products:

            stock = int(product["stock"] or 0)

            if stock == 0:
                out_of_stock += 1

            elif stock <= 10:
                low_stock += 1


        # ----------------------------------------------------
        # CALCULATE RISK
        # ----------------------------------------------------

        result = calculate_risk(

            total_sales=total_sales,

            total_expenses=total_expenses,

            low_stock=low_stock,

            out_of_stock=out_of_stock

        )

        return jsonify(result), 200


    except Exception as e:

        print("Risk Meter Error:", e)

        return jsonify({
            "message": str(e)
        }), 500


    finally:

        conn.close()


# ============================================================
# AI DIAGNOSIS
# ============================================================

@dashboard.route("/diagnosis", methods=["GET"])
def diagnosis():

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:

        # ----------------------------------------------------
        # SALES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0)
            FROM sales
        """)

        total_sales = float(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # EXPENSES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
        """)

        total_expenses = float(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # STOCK
        # ----------------------------------------------------

        cursor.execute("""
            SELECT stock
            FROM products
        """)

        products = cursor.fetchall()

        low_stock = 0
        out_of_stock = 0

        for product in products:

            stock = int(product["stock"] or 0)

            if stock == 0:
                out_of_stock += 1

            elif stock <= 10:
                low_stock += 1


        # ----------------------------------------------------
        # PROFIT
        # ----------------------------------------------------

        profit = total_sales - total_expenses


        # ----------------------------------------------------
        # AI DIAGNOSIS
        # ----------------------------------------------------

        result = generate_diagnosis(

            total_sales=total_sales,

            total_expenses=total_expenses,

            profit=profit,

            low_stock=low_stock,

            out_of_stock=out_of_stock

        )

        return jsonify(result), 200


    except Exception as e:

        print("Diagnosis Error:", e)

        return jsonify({
            "message": str(e)
        }), 500


    finally:

        conn.close()


# ============================================================
# SMART ALERTS
# ============================================================

@dashboard.route("/smart-alerts", methods=["GET"])
def smart_alerts():

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:

        # ----------------------------------------------------
        # SALES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0)
            FROM sales
        """)

        total_sales = float(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # EXPENSES
        # ----------------------------------------------------

        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
        """)

        total_expenses = float(cursor.fetchone()[0] or 0)


        # ----------------------------------------------------
        # STOCK
        # ----------------------------------------------------

        cursor.execute("""
            SELECT stock
            FROM products
        """)

        products = cursor.fetchall()

        low_stock = 0
        out_of_stock = 0

        for product in products:

            stock = int(product["stock"] or 0)

            if stock == 0:
                out_of_stock += 1

            elif stock <= 10:
                low_stock += 1


        # ----------------------------------------------------
        # PROFIT
        # ----------------------------------------------------

        profit = total_sales - total_expenses


        # ----------------------------------------------------
        # GENERATE ALERTS
        # ----------------------------------------------------

        result = generate_alerts(

            total_sales=total_sales,

            total_expenses=total_expenses,

            profit=profit,

            low_stock=low_stock,

            out_of_stock=out_of_stock

        )

        return jsonify(result), 200


    except Exception as e:

        print("Smart Alerts Error:", e)

        return jsonify({
            "message": str(e)
        }), 500


    finally:

        conn.close()