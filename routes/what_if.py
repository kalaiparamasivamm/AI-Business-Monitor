from flask import Blueprint, request, jsonify
import sqlite3

from services.what_if import calculate_what_if

what_if = Blueprint("what_if", __name__)

DB_NAME = "business.db"


@what_if.route("/what-if", methods=["POST"])
def what_if_simulation():

    try:
        data = request.get_json() or {}

        sales_change_percent = float(
            data.get("sales_change_percent", 0)
        )

        expense_change_percent = float(
            data.get("expense_change_percent", 0)
        )

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0)
            FROM sales
        """)

        total_sales = cursor.fetchone()[0]

        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
        """)

        total_expenses = cursor.fetchone()[0]

        conn.close()

        result = calculate_what_if(
            total_sales,
            total_expenses,
            sales_change_percent,
            expense_change_percent
        )

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500