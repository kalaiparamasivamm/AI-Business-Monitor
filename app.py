from flask import Flask
from flask_cors import CORS
from database import create_database

from routes.auth import auth
from routes.products import products
from routes.sales import sales
from routes.expenses import expenses
from routes.dashboard import dashboard
from routes.prediction import prediction
from routes.what_if import what_if
from routes.profit_leakage import profit_leakage_bp
from routes.report import report

app = Flask(__name__)

# Enable CORS
CORS(app)

# Create Database
create_database()

# Register Blueprints
app.register_blueprint(auth)
app.register_blueprint(products)
app.register_blueprint(sales)
app.register_blueprint(expenses)
app.register_blueprint(dashboard)
app.register_blueprint(prediction)
app.register_blueprint(what_if)
app.register_blueprint(profit_leakage_bp)
app.register_blueprint(report)


@app.route("/")
def home():
    return "Welcome to AI Business Monitor"


# Show all routes
print(app.url_map)


if __name__ == "__main__":
    app.run(debug=True)