def calculate_health(total_sales, total_expenses):

    # Make sure values are valid numbers
    total_sales = float(total_sales or 0)
    total_expenses = float(total_expenses or 0)

    # =========================================================
    # 1. PROFIT
    # =========================================================

    profit = total_sales - total_expenses

    # =========================================================
    # 2. PROFIT MARGIN
    # =========================================================

    if total_sales > 0:
        profit_margin = (profit / total_sales) * 100
    else:
        profit_margin = 0

    # =========================================================
    # 3. HEALTH SCORE
    # =========================================================
    # Score is calculated from:
    # - Profitability
    # - Expense control
    # - Sales performance
    #
    # Maximum score = 100
    # =========================================================

    if total_sales == 0:

        # No business activity yet
        health_score = 20

    else:

        # -----------------------------------------------------
        # Profitability Score - 60%
        # -----------------------------------------------------

        if profit_margin >= 30:
            profitability_score = 60

        elif profit_margin >= 20:
            profitability_score = 50

        elif profit_margin >= 10:
            profitability_score = 40

        elif profit_margin >= 0:
            profitability_score = 30

        elif profit_margin >= -10:
            profitability_score = 15

        else:
            profitability_score = 5

        # -----------------------------------------------------
        # Expense Control Score - 25%
        # -----------------------------------------------------

        expense_ratio = (
            total_expenses / total_sales
        ) * 100

        if expense_ratio <= 30:
            expense_score = 25

        elif expense_ratio <= 50:
            expense_score = 20

        elif expense_ratio <= 70:
            expense_score = 15

        elif expense_ratio <= 90:
            expense_score = 8

        else:
            expense_score = 3

        # -----------------------------------------------------
        # Sales Activity Score - 15%
        # -----------------------------------------------------

        if total_sales >= 100000:
            sales_score = 15

        elif total_sales >= 50000:
            sales_score = 13

        elif total_sales >= 25000:
            sales_score = 11

        elif total_sales >= 10000:
            sales_score = 8

        elif total_sales > 0:
            sales_score = 5

        else:
            sales_score = 0

        # -----------------------------------------------------
        # Final Health Score
        # -----------------------------------------------------

        health_score = (
            profitability_score
            + expense_score
            + sales_score
        )

    # Keep score between 0 and 100
    health_score = max(
        0,
        min(100, round(health_score))
    )

    # =========================================================
    # 4. BUSINESS STATUS
    # =========================================================

    if health_score >= 80:

        status = "Excellent"

    elif health_score >= 60:

        status = "Good"

    elif health_score >= 40:

        status = "Needs Attention"

    else:

        status = "Critical"

    # =========================================================
    # 5. AI RECOMMENDATION
    # =========================================================

    if total_sales == 0:

        recommendation = (
            "No sales activity has been recorded yet. "
            "Start recording sales to generate meaningful "
            "business insights."
        )

    elif profit < 0:

        recommendation = (
            "Business is running at a loss. "
            "Reduce unnecessary expenses and improve sales "
            "to restore profitability."
        )

    elif profit_margin < 10:

        recommendation = (
            "Business is profitable but the profit margin "
            "is low. Focus on controlling expenses and "
            "improving sales margins."
        )

    elif expense_ratio > 70:

        recommendation = (
            "Expenses are relatively high compared with sales. "
            "Review operating costs and reduce unnecessary spending."
        )

    elif profit_margin >= 30:

        recommendation = (
            "Business performance is strong with a healthy "
            "profit margin. Continue monitoring expenses and "
            "maintain consistent sales growth."
        )

    else:

        recommendation = (
            "Business is performing reasonably well. "
            "Continue improving sales while maintaining "
            "effective expense control."
        )

    # =========================================================
    # 6. RETURN AI ANALYSIS
    # =========================================================

    return {

        "profit": round(profit, 2),

        "profit_margin": round(
            profit_margin,
            2
        ),

        "health_score": health_score,

        "status": status,

        "recommendation": recommendation

    }