import sqlite3


def create_database():

    connection = sqlite3.connect("business.db")

    cursor = connection.cursor()


    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)


    # Products Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT,
        category TEXT,
        price REAL,
        stock INTEGER
    )
    """)


    # Sales Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sales(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        quantity INTEGER,
        total_amount REAL,
        sale_date TEXT
    )
    """)


    # Expenses Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expenses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expense_name TEXT,
        amount REAL,
        expense_date TEXT
    )
    """)


    # Inventory Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inventory(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        stock_quantity INTEGER,
        expiry_date TEXT
    )
    """)


    connection.commit()
    connection.close()


if __name__ == "__main__":
    create_database()
    print("Database created successfully!")