def generate_alerts(
    total_sales,
    total_expenses,
    profit,
    low_stock,
    out_of_stock
):
    alerts = []

    total_sales = float(total_sales or 0)
    total_expenses = float(total_expenses or 0)
    profit = float(profit or 0)
    low_stock = int(low_stock or 0)
    out_of_stock = int(out_of_stock or 0)

    # ------------------------------------------
    # FINANCIAL ALERTS
    # ------------------------------------------

    if profit < 0:
        alerts.append({
            "type": "Critical",
            "title": "Business Operating at a Loss",
            "message": f"Current loss is ₹{abs(profit):,.2f}. Review expenses and improve profitable sales."
        })

    if total_sales > 0:
        expense_ratio = (total_expenses / total_sales) * 100

        if expense_ratio >= 100:
            alerts.append({
                "type": "Critical",
                "title": "Expenses Exceed Sales",
                "message": "Business expenses are higher than total sales revenue."
            })

        elif expense_ratio >= 70:
            alerts.append({
                "type": "Warning",
                "title": "High Expense-to-Sales Ratio",
                "message": "A large portion of sales revenue is being consumed by expenses."
            })

    # ------------------------------------------
    # INVENTORY ALERTS
    # ------------------------------------------

    if out_of_stock > 0:
        alerts.append({
            "type": "Critical",
            "title": "Products Out of Stock",
            "message": f"{out_of_stock} product(s) are out of stock and may cause missed sales."
        })

    if low_stock > 0:
        alerts.append({
            "type": "Warning",
            "title": "Low Stock Products",
            "message": f"{low_stock} product(s) have low stock and may need restocking."
        })

    # ------------------------------------------
    # SALES ALERT
    # ------------------------------------------

    if total_sales == 0:
        alerts.append({
            "type": "Warning",
            "title": "No Sales Recorded",
            "message": "No sales have been recorded. Start recording sales to monitor business performance."
        })

    # ------------------------------------------
    # POSITIVE ALERT
    # ------------------------------------------

    if profit > 0 and low_stock == 0 and out_of_stock == 0:
        alerts.append({
            "type": "Info",
            "title": "Business Performance is Stable",
            "message": "The business is profitable and inventory levels currently show no major stock alerts."
        })

    return {
        "alert_count": len(alerts),
        "alerts": alerts
    }