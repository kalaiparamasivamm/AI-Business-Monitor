def generate_business_report(
    total_sales,
    total_expenses,
    profit,
    total_products,
    low_stock,
    out_of_stock
):

    total_sales = float(total_sales or 0)
    total_expenses = float(total_expenses or 0)
    profit = float(profit or 0)

    if total_sales > 0:
        profit_margin = (profit / total_sales) * 100
    else:
        profit_margin = 0

    if profit > 0:
        financial_status = "Profitable"
    elif profit < 0:
        financial_status = "Loss Making"
    else:
        financial_status = "Break-even"

    if low_stock > 0 or out_of_stock > 0:
        inventory_status = "Needs Attention"
    else:
        inventory_status = "Healthy"

    if profit_margin >= 20:
        performance = "Strong"
    elif profit_margin >= 10:
        performance = "Moderate"
    elif profit_margin >= 0:
        performance = "Weak"
    else:
        performance = "Critical"

    recommendations = []

    if profit < 0:
        recommendations.append(
            "Reduce unnecessary expenses and improve sales performance."
        )

    if low_stock > 0:
        recommendations.append(
            "Restock low-stock products to avoid missed sales."
        )

    if out_of_stock > 0:
        recommendations.append(
            "Review out-of-stock products and replenish important items."
        )

    if total_sales == 0:
        recommendations.append(
            "Start recording sales regularly to improve business analysis."
        )

    if not recommendations:
        recommendations.append(
            "Business performance is stable. Continue monitoring sales, "
            "expenses and inventory."
        )

    return {
        "financial_status": financial_status,
        "inventory_status": inventory_status,
        "performance": performance,
        "total_sales": round(total_sales, 2),
        "total_expenses": round(total_expenses, 2),
        "profit": round(profit, 2),
        "profit_margin": round(profit_margin, 2),
        "total_products": total_products,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock,
        "recommendations": recommendations
    }