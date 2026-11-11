from flask import Blueprint, request, jsonify
import sqlite3

products = Blueprint("products", __name__)

DB_NAME = "business.db"


# =========================
# GET ALL PRODUCTS
# =========================

@products.route("/products", methods=["GET"])
def get_products():

    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT id, product_name, category, price, stock
            FROM products
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()

        product_list = []

        for row in rows:

            product_list.append({
                "id": row["id"],
                "product_name": row["product_name"],
                "category": row["category"],
                "price": row["price"],
                "stock": row["stock"]
            })

        return jsonify(product_list)

    except Exception as e:

        return jsonify({
            "message": str(e)
        }), 500

    finally:

        conn.close()


# =========================
# ADD PRODUCT
# =========================

@products.route("/products", methods=["POST"])
def add_product():

    data = request.get_json()

    product_name = data.get("product_name")
    category = data.get("category")
    price = data.get("price")
    stock = data.get("stock")

    if not product_name or not category:
        return jsonify({
            "message": "Product name and category are required"
        }), 400

    if price is None or stock is None:
        return jsonify({
            "message": "Price and stock are required"
        }), 400

    try:

        price = float(price)
        stock = int(stock)

    except ValueError:

        return jsonify({
            "message": "Price and stock must be valid numbers"
        }), 400

    if price <= 0:
        return jsonify({
            "message": "Price must be greater than 0"
        }), 400

    if stock < 0:
        return jsonify({
            "message": "Stock cannot be negative"
        }), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:

        # Prevent duplicate product names
        cursor.execute("""
            SELECT id
            FROM products
            WHERE LOWER(product_name) = LOWER(?)
        """, (product_name.strip(),))

        existing = cursor.fetchone()

        if existing:

            return jsonify({
                "message": "Product already exists"
            }), 400

        cursor.execute("""
            INSERT INTO products
            (product_name, category, price, stock)
            VALUES (?, ?, ?, ?)
        """, (
            product_name.strip(),
            category.strip(),
            price,
            stock
        ))

        conn.commit()

        return jsonify({
            "message": "Product added successfully"
        }), 201

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": str(e)
        }), 500

    finally:

        conn.close()


# =========================
# UPDATE PRODUCT
# =========================

@products.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):

    data = request.get_json()

    price = data.get("price")
    stock = data.get("stock")

    if price is None or stock is None:

        return jsonify({
            "message": "Price and stock are required"
        }), 400

    try:

        price = float(price)
        stock = int(stock)

    except ValueError:

        return jsonify({
            "message": "Invalid price or stock"
        }), 400

    if price <= 0:

        return jsonify({
            "message": "Price must be greater than 0"
        }), 400

    if stock < 0:

        return jsonify({
            "message": "Stock cannot be negative"
        }), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT id
            FROM products
            WHERE id = ?
        """, (product_id,))

        product = cursor.fetchone()

        if not product:

            return jsonify({
                "message": "Product not found"
            }), 404

        cursor.execute("""
            UPDATE products
            SET price = ?, stock = ?
            WHERE id = ?
        """, (
            price,
            stock,
            product_id
        ))

        conn.commit()

        return jsonify({
            "message": "Product updated successfully"
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": str(e)
        }), 500

    finally:

        conn.close()


# =========================
# RESTOCK
# =========================

@products.route(
    "/products/<int:product_id>/restock",
    methods=["PUT"]
)
def restock_product(product_id):

    data = request.get_json()

    quantity = data.get("quantity")

    if quantity is None:

        return jsonify({
            "message": "Restock quantity is required"
        }), 400

    try:

        quantity = int(quantity)

    except ValueError:

        return jsonify({
            "message": "Quantity must be a number"
        }), 400

    if quantity <= 0:

        return jsonify({
            "message": "Restock quantity must be greater than 0"
        }), 400

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT stock
            FROM products
            WHERE id = ?
        """, (product_id,))

        product = cursor.fetchone()

        if not product:

            return jsonify({
                "message": "Product not found"
            }), 404

        new_stock = product[0] + quantity

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
            "message": "Product restocked successfully",
            "new_stock": new_stock
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": str(e)
        }), 500

    finally:

        conn.close()


# =========================
# DELETE PRODUCT
# =========================

@products.route(
    "/products/<int:product_id>",
    methods=["DELETE"]
)
def delete_product(product_id):

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:

        cursor.execute("""
            SELECT id
            FROM products
            WHERE id = ?
        """, (product_id,))

        product = cursor.fetchone()

        if not product:

            return jsonify({
                "message": "Product not found"
            }), 404

        cursor.execute("""
            DELETE FROM products
            WHERE id = ?
        """, (product_id,))

        conn.commit()

        return jsonify({
            "message": "Product deleted successfully"
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "message": str(e)
        }), 500

    finally:

        conn.close()