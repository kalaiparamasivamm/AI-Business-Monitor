from flask import Blueprint, jsonify
from services.prediction import predict_sales


prediction = Blueprint("prediction", __name__)


@prediction.route("/predict-sales", methods=["GET"])
def get_prediction():

    predicted_sale = predict_sales()

    return jsonify({
        "predicted_sales": predicted_sale
    })