def calculate_profit_leakage(
    total_sales,
    total_expenses,
    low_stock,
    out_of_stock,
    top_expenses
):

    # Make sure values are valid
    total_sales = float(total_sales or 0)
    total_expenses = float(total_expenses or 0)

    low_stock = int(low_stock or 0)
    out_of_stock = int(out_of_stock or 0)

    # ---------------------------------------------------------
    # 1. PROFIT
    # ---------------------------------------------------------

    profit = total_sales - total_expenses

    # ---------------------------------------------------------
    # 2. EXPENSE RATIO
    # ---------------------------------------------------------

    if total_sales > 0:
        expense_ratio = (
            total_expenses / total_sales
        ) * 100
    else:
        expense_ratio = 100

    # ---------------------------------------------------------
    # 3. LEAKAGE SCORE
    # ---------------------------------------------------------

    leakage_score = 0

    # High expenses compared with sales
    if total_sales == 0:
        leakage_score += 40

    elif expense_ratio >= 100:
        leakage_score += 40

    elif expense_ratio >= 80:
        leakage_score += 35

    elif expense_ratio >= 60:
        leakage_score += 25

    elif expense_ratio >= 40:
        leakage_score += 15

    # Business operating at loss
    if profit < 0:
        leakage_score += 30

    elif profit == 0:
        leakage_score += 15

    # Inventory-related potential leakage
    if out_of_stock > 0:
        leakage_score += min(
            out_of_stock * 5,
            15
        )

    if low_stock > 0:
        leakage_score += min(
            low_stock * 2,
            10
        )

    # Keep score between 0 and 100
    leakage_score = max(
        0,
        min(100, round(leakage_score))
    )

    # ---------------------------------------------------------
    # 4. LEAKAGE LEVEL
    # ---------------------------------------------------------

    if leakage_score >= 70:

        leakage_level = "High Leakage"

    elif leakage_score >= 40:

        leakage_level = "Medium Leakage"

    else:

        leakage_level = "Low Leakage"

    # ---------------------------------------------------------
    # 5. IDENTIFY LEAKAGE AREAS
    # ---------------------------------------------------------

    leakage_areas = []

    if total_sales == 0:

        leakage_areas.append({
            "title": "No Sales Activity",
            "description": (
                "No sales have been recorded, making it difficult "
                "to cover business operating costs."
            ),
            "severity": "High"
        })

    elif expense_ratio >= 100:

        leakage_areas.append({
            "title": "Expenses Exceed Sales",
            "description": (
                "Business expenses are higher than the revenue "
                "generated from sales."
            ),
            "severity": "High"
        })

    elif expense_ratio >= 70:

        leakage_areas.append({
            "title": "High Expense-to-Sales Ratio",
            "description": (
                "A large portion of sales revenue is being consumed "
                "by business expenses."
            ),
            "severity": "High"
        })

    elif expense_ratio >= 50:

        leakage_areas.append({
            "title": "Expense Pressure",
            "description": (
                "Expenses are taking a significant share of sales revenue."
            ),
            "severity": "Medium"
        })

    # ---------------------------------------------------------
    # 6. LOSS DETECTION
    # ---------------------------------------------------------

    if profit < 0:

        leakage_areas.append({
            "title": "Operating Loss",
            "description": (
                f"The business is currently losing ₹{abs(profit):,.2f} "
                "based on recorded sales and expenses."
            ),
            "severity": "High"
        })

    # ---------------------------------------------------------
    # 7. INVENTORY LEAKAGE
    # ---------------------------------------------------------

    if out_of_stock > 0:

        leakage_areas.append({
            "title": "Out-of-Stock Products",
            "description": (
                f"{out_of_stock} product(s) are out of stock and "
                "may result in missed sales opportunities."
            ),
            "severity": "High"
        })

    if low_stock > 0:

        leakage_areas.append({
            "title": "Low Stock Products",
            "description": (
                f"{low_stock} product(s) have low stock levels "
                "and may require timely restocking."
            ),
            "severity": "Medium"
        })

    # ---------------------------------------------------------
    # 8. TOP EXPENSE ANALYSIS
    # ---------------------------------------------------------

    expense_leakage = []

    for expense in top_expenses:

        expense_name = expense.get(
            "expense_name",
            "Unknown Expense"
        )

        amount = float(
            expense.get("amount", 0) or 0
        )

        if total_expenses > 0:

            percentage = (
                amount / total_expenses
            ) * 100

        else:

            percentage = 0

        expense_leakage.append({
            "expense_name": expense_name,
            "amount": round(amount, 2),
            "percentage": round(
                percentage,
                2
            )
        })

    # ---------------------------------------------------------
    # 9. AI RECOMMENDATION
    # ---------------------------------------------------------

    if total_sales == 0:

        recommendation = (
            "Start recording sales and focus on generating "
            "revenue before increasing business expenses."
        )

    elif profit < 0:

        recommendation = (
            "Reduce unnecessary expenses, review the largest "
            "cost areas and focus on improving profitable sales."
        )

    elif expense_ratio >= 70:

        recommendation = (
            "Review major operating expenses and reduce "
            "avoidable costs to improve profit margins."
        )

    elif low_stock > 0 or out_of_stock > 0:

        recommendation = (
            "Monitor inventory closely and restock important "
            "products to avoid potential lost sales."
        )

    else:

        recommendation = (
            "No major profit leakage detected. Continue "
            "monitoring expenses, sales and inventory."
        )

    # ---------------------------------------------------------
    # 10. SUMMARY
    # ---------------------------------------------------------

    if leakage_score >= 70:

        summary = (
            "Significant potential profit leakage detected. "
            "Immediate attention is recommended."
        )

    elif leakage_score >= 40:

        summary = (
            "Some potential profit leakage areas were detected. "
            "Monitor costs and inventory carefully."
        )

    else:

        summary = (
            "Business operations currently show low potential "
            "profit leakage."
        )

    # ---------------------------------------------------------
    # 11. RETURN RESULT
    # ---------------------------------------------------------

    return {

        "leakage_score": leakage_score,

        "leakage_level": leakage_level,

        "profit": round(
            profit,
            2
        ),

        "total_sales": round(
            total_sales,
            2
        ),

        "total_expenses": round(
            total_expenses,
            2
        ),

        "expense_ratio": round(
            expense_ratio,
            2
        ),

        "leakage_areas": leakage_areas,

        "top_expenses": expense_leakage,

        "summary": summary,

        "recommendation": recommendation

    }