from flask import Blueprint, jsonify
import sqlite3

from services.profit_leakage import calculate_profit_leakage


# Create Blueprint
profit_leakage_bp = Blueprint(
    "profit_leakage",
    __name__
)

DB_NAME = "business.db"


@profit_leakage_bp.route("/profit-leakage", methods=["GET"])
def profit_leakage():

    try:

        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # ==========================================
        # TOTAL SALES
        # ==========================================

        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0)
            FROM sales
        """)

        total_sales = float(
            cursor.fetchone()[0] or 0
        )

        # ==========================================
        # TOTAL EXPENSES
        # ==========================================

        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
        """)

        total_expenses = float(
            cursor.fetchone()[0] or 0
        )

        # ==========================================
        # INVENTORY
        # ==========================================

        cursor.execute("""
            SELECT stock
            FROM products
        """)

        products = cursor.fetchall()

        low_stock = 0
        out_of_stock = 0

        for product in products:

            stock = int(
                product["stock"] or 0
            )

            if stock == 0:

                out_of_stock += 1

            elif stock <= 10:

                low_stock += 1

        # ==========================================
        # TOP 5 EXPENSES
        # ==========================================

        cursor.execute("""
            SELECT
                expense_name,
                amount
            FROM expenses
            ORDER BY amount DESC
            LIMIT 5
        """)

        expense_rows = cursor.fetchall()

        top_expenses = []

        for row in expense_rows:

            top_expenses.append({
                "expense_name": row["expense_name"],
                "amount": float(
                    row["amount"] or 0
                )
            })

        conn.close()

        # ==========================================
        # AI PROFIT LEAKAGE ANALYSIS
        # ==========================================

        result = calculate_profit_leakage(
            total_sales,
            total_expenses,
            low_stock,
            out_of_stock,
            top_expenses
        )

        return jsonify(result), 200

    except Exception as e:

        print(
            "Profit Leakage Error:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500