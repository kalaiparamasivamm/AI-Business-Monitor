from flask import Blueprint, request, jsonify
import sqlite3


auth = Blueprint("auth", __name__)


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_connection():
    connection = sqlite3.connect("business.db")
    connection.row_factory = sqlite3.Row
    return connection


# =========================================================
# REGISTER API
# =========================================================

@auth.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    business_name = data.get("business_name")
    email = data.get("email")
    password = data.get("password")

    # -----------------------------------------------------
    # Check required fields
    # -----------------------------------------------------

    if not name or not business_name or not email or not password:

        return jsonify({
            "message": "All fields are required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    # -----------------------------------------------------
    # Check if email already exists
    # -----------------------------------------------------

    cursor.execute(
        "SELECT * FROM users WHERE email=?",
        (email,)
    )

    user = cursor.fetchone()

    if user:

        connection.close()

        return jsonify({
            "message": "Email already exists"
        }), 400

    # -----------------------------------------------------
    # Insert new user
    # -----------------------------------------------------

    cursor.execute(
        """
        INSERT INTO users
        (name, business_name, email, password)
        VALUES (?, ?, ?, ?)
        """,
        (
            name,
            business_name,
            email,
            password
        )
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Registration successful"
    }), 201


# =========================================================
# LOGIN API
# =========================================================

@auth.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    # -----------------------------------------------------
    # Check required fields
    # -----------------------------------------------------

    if not email or not password:

        return jsonify({
            "message": "Email and password required"
        }), 400

    connection = get_connection()
    cursor = connection.cursor()

    # -----------------------------------------------------
    # Check login credentials
    # -----------------------------------------------------

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email=? AND password=?
        """,
        (
            email,
            password
        )
    )

    user = cursor.fetchone()

    connection.close()

    # -----------------------------------------------------
    # Login successful
    # -----------------------------------------------------

    if user:

        return jsonify({

            "message": "Login successful",

            "user": {

                "id": user["id"],

                "name": user["name"],

                "business_name": user["business_name"],

                "email": user["email"]

            }

        }), 200

    # -----------------------------------------------------
    # Login failed
    # -----------------------------------------------------

    else:

        return jsonify({

            "message": "Invalid email or password"

        }), 401