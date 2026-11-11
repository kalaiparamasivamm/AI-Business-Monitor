from flask import Blueprint, request, jsonify
import sqlite3

sales = Blueprint("sales", __name__)

DB_NAME = "business.db"


# =========================
# ADD SALE
# =========================
@sales.route("/sales", methods=["POST"])
def add_sale():

    data = request.get_json()

    product_id = data.get("product_id")
    quantity = data.get("quantity")
    total_amount = data.get("total_amount")
    sale_date = data.get("sale_date")

    if not product_id or not quantity:
        return jsonify({
            "message": "Product and quantity are required"
        }), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:

        # Check product
        cursor.execute("""
            SELECT id, product_name, price, stock
            FROM products
            WHERE id = ?
        """, (product_id,))

        product = cursor.fetchone()

        if not product:
            return jsonify({
                "message": "Product not found"
            }), 404

        product_stock = product[3]

        # Check stock
        if quantity > product_stock:
            return jsonify({
                "message": f"Only {product_stock} items available in stock"
            }), 400

        # Calculate amount from product price
        total_amount = float(product[2]) * int(quantity)

        # Insert sale
        cursor.execute("""
            INSERT INTO sales
            (product_id, quantity, total_amount, sale_date)
            VALUES (?, ?, ?, ?)
        """, (
            product_id,
            quantity,
            total_amount,
            sale_date
        ))

        # Reduce product stock
        new_stock = product_stock - int(quantity)

        cursor.execute("""
            UPDATE products
            SET stock = ?
            WHERE id = ?
        """, (
            new_stock,
            product_id
        ))

        conn.commit()

        return jsonify({
            "message": "Sale added successfully",
            "sale": {
                "product_id": product_id,
                "product_name": product[1],
                "quantity": quantity,
                "total_amount": total_amount,
                "sale_date": sale_date
            }
        }), 201

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": str(e)
        }), 500

    finally:
        conn.close()


# =========================
# GET ALL SALES
# =========================
@sales.route("/sales", methods=["GET"])
def get_sales():

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT
                sales.id,
                sales.product_id,
                products.product_name,
                products.price,
                sales.quantity,
                sales.total_amount,
                sales.sale_date
            FROM sales
            LEFT JOIN products
            ON sales.product_id = products.id
            ORDER BY sales.id DESC
        """)

        rows = cursor.fetchall()

        sales_list = []

        for row in rows:

            sales_list.append({
                "id": row["id"],
                "product_id": row["product_id"],
                "product_name": row["product_name"],
                "price": row["price"],
                "quantity": row["quantity"],
                "total_amount": row["total_amount"],
                "sale_date": row["sale_date"]
            })

        return jsonify(sales_list)

    except Exception as e:

        return jsonify({
            "message": str(e)
        }), 500

    finally:
        conn.close()


# =========================
# DELETE SALE
# =========================
@sales.route("/sales/<int:sale_id>", methods=["DELETE"])
def delete_sale(sale_id):

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:

        # Get sale details first
        cursor.execute("""
            SELECT product_id, quantity
            FROM sales
            WHERE id = ?
        """, (sale_id,))

        sale = cursor.fetchone()

        if not sale:
            return jsonify({
                "message": "Sale not found"
            }), 404

        product_id = sale[0]
        quantity = sale[1]

        # Restore product stock
        cursor.execute("""
            UPDATE products
            SET stock = stock + ?
            WHERE id = ?
        """, (
            quantity,
            product_id
        ))

        # Delete sale
        cursor.execute("""
            DELETE FROM sales
            WHERE id = ?
        """, (sale_id,))

        conn.commit()

        return jsonify({
            "message": "Sale deleted successfully"
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": str(e)
        }), 500

    finally:
        conn.close()