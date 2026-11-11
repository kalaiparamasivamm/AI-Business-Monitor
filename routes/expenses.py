from flask import Blueprint, request, jsonify
import sqlite3

expenses = Blueprint("expenses", __name__)

DB_NAME = "business.db"


# =========================================================
# ADD EXPENSE
# =========================================================

@expenses.route("/expenses", methods=["POST"])
def add_expense():

    data = request.get_json()

    expense_name = data.get("expense_name")
    amount = data.get("amount")
    expense_date = data.get("expense_date")

    # Validation
    if not expense_name:
        return jsonify({
            "message": "Expense name is required"
        }), 400

    if amount is None:
        return jsonify({
            "message": "Expense amount is required"
        }), 400

    try:
        amount = float(amount)
    except (ValueError, TypeError):
        return jsonify({
            "message": "Invalid expense amount"
        }), 400

    if amount <= 0:
        return jsonify({
            "message": "Expense amount must be greater than zero"
        }), 400

    if not expense_date:
        return jsonify({
            "message": "Expense date is required"
        }), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO expenses
            (
                expense_name,
                amount,
                expense_date
            )
            VALUES (?, ?, ?)
            """,
            (
                expense_name.strip(),
                amount,
                expense_date
            )
        )

        conn.commit()

        new_id = cursor.lastrowid

        return jsonify({
            "message": "Expense added successfully",
            "expense": {
                "id": new_id,
                "expense_name": expense_name.strip(),
                "amount": amount,
                "expense_date": expense_date
            }
        }), 201

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": str(e)
        }), 500

    finally:
        conn.close()


# =========================================================
# GET ALL EXPENSES
# =========================================================

@expenses.route("/expenses", methods=["GET"])
def get_expenses():

    conn = sqlite3.connect(DB_NAME)

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT
                id,
                expense_name,
                amount,
                expense_date
            FROM expenses
            ORDER BY id DESC
            """
        )

        rows = cursor.fetchall()

        expense_list = []

        for row in rows:

            expense_list.append({
                "id": row["id"],
                "expense_name": row["expense_name"],
                "amount": row["amount"],
                "expense_date": row["expense_date"]
            })

        return jsonify(expense_list)

    except Exception as e:

        return jsonify({
            "message": str(e)
        }), 500

    finally:
        conn.close()


# =========================================================
# DELETE EXPENSE
# =========================================================

@expenses.route("/expenses/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):

    conn = sqlite3.connect(DB_NAME)

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT id
            FROM expenses
            WHERE id = ?
            """,
            (expense_id,)
        )

        expense = cursor.fetchone()

        if not expense:

            return jsonify({
                "message": "Expense not found"
            }), 404

        cursor.execute(
            """
            DELETE FROM expenses
            WHERE id = ?
            """,
            (expense_id,)
        )

        conn.commit()

        return jsonify({
            "message": "Expense deleted successfully"
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": str(e)
        }), 500

    finally:
        conn.close()