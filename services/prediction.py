import sqlite3
from datetime import datetime, timedelta
import numpy as np

try:
    from sklearn.linear_model import LinearRegression
except ImportError:
    LinearRegression = None


DB_NAME = "business.db"


def predict_sales():
    """
    Predict the next day's sales using historical sales data.
    Returns the predicted sales amount.
    """

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT sale_date, SUM(total_amount)
            FROM sales
            GROUP BY sale_date
            ORDER BY sale_date
        """)

        rows = cursor.fetchall()

    finally:
        conn.close()

    # No sales data
    if not rows:
        return 0

    # Only one day of sales
    if len(rows) == 1:
        return round(float(rows[0][1]), 2)

    # Prepare data for ML
    X = np.array(
        [[i] for i in range(len(rows))],
        dtype=float
    )

    y = np.array(
        [float(row[1]) for row in rows],
        dtype=float
    )

    # If sklearn is available, use Linear Regression
    if LinearRegression is not None:

        model = LinearRegression()

        model.fit(X, y)

        next_day = np.array([[len(rows)]], dtype=float)

        prediction = model.predict(next_day)[0]

    else:
        # Simple fallback prediction
        prediction = np.mean(y[-3:])

    # Sales cannot be negative
    prediction = max(0, prediction)

    return round(float(prediction), 2)