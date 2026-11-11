from flask import Blueprint, jsonify
import sqlite3

from services.report import generate_business_report

report = Blueprint("report", __name__)

DB_NAME = "business.db"


@report.route("/report", methods=["GET"])
def get_business_report():

    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        # Total sales
        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0)
            FROM sales
        """)
        total_sales = cursor.fetchone()[0]

        # Total expenses
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
        """)
        total_expenses = cursor.fetchone()[0]

        # Total products
        cursor.execute("""
            SELECT COUNT(*)
            FROM products
        """)
        total_products = cursor.fetchone()[0]

        # Low-stock products
        cursor.execute("""
            SELECT COUNT(*)
            FROM products
            WHERE stock > 0 AND stock <= 10
        """)
        low_stock = cursor.fetchone()[0]

        # Out-of-stock products
        cursor.execute("""
            SELECT COUNT(*)
            FROM products
            WHERE stock <= 0
        """)
        out_of_stock = cursor.fetchone()[0]

        conn.close()

        profit = total_sales - total_expenses

        result = generate_business_report(
            total_sales,
            total_expenses,
            profit,
            total_products,
            low_stock,
            out_of_stock
        )

        return jsonify(result), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500