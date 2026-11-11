def calculate_risk(
    total_sales,
    total_expenses,
    low_stock,
    out_of_stock
):

    # Convert values safely
    total_sales = float(total_sales or 0)
    total_expenses = float(total_expenses or 0)

    low_stock = int(low_stock or 0)
    out_of_stock = int(out_of_stock or 0)

    # =====================================================
    # 1. CALCULATE PROFIT
    # =====================================================

    profit = total_sales - total_expenses

    # =====================================================
    # 2. INITIAL RISK SCORE
    # =====================================================

    risk_score = 0

    # =====================================================
    # 3. PROFIT / LOSS RISK
    # =====================================================

    if total_sales == 0:

        risk_score += 40

    elif profit < 0:

        risk_score += 40

    elif profit == 0:

        risk_score += 25

    else:

        profit_margin = (
            profit / total_sales
        ) * 100

        if profit_margin < 10:
            risk_score += 20

        elif profit_margin < 20:
            risk_score += 10

        else:
            risk_score += 0

    # =====================================================
    # 4. EXPENSE RISK
    # =====================================================

    if total_sales > 0:

        expense_ratio = (
            total_expenses / total_sales
        ) * 100

        if expense_ratio >= 90:
            risk_score += 30

        elif expense_ratio >= 70:
            risk_score += 20

        elif expense_ratio >= 50:
            risk_score += 10

    else:

        risk_score += 10

    # =====================================================
    # 5. INVENTORY RISK
    # =====================================================

    if out_of_stock > 0:
        risk_score += min(
            out_of_stock * 5,
            15
        )

    if low_stock > 0:
        risk_score += min(
            low_stock * 2,
            10
        )

    # =====================================================
    # 6. LIMIT RISK SCORE
    # =====================================================

    risk_score = max(
        0,
        min(100, round(risk_score))
    )

    # =====================================================
    # 7. DETERMINE RISK LEVEL
    # =====================================================

    if risk_score >= 70:

        risk_level = "High Risk"

    elif risk_score >= 40:

        risk_level = "Medium Risk"

    else:

        risk_level = "Low Risk"

    # =====================================================
    # 8. RISK MESSAGE
    # =====================================================

    if risk_score >= 70:

        message = (
            "Business has significant financial or "
            "inventory risks. Immediate action is "
            "recommended."
        )

    elif risk_score >= 40:

        message = (
            "Business has some areas of concern. "
            "Monitor expenses, profitability and "
            "inventory closely."
        )

    else:

        message = (
            "Business risk is currently low. "
            "Continue monitoring performance "
            "and maintaining healthy operations."
        )

    # =====================================================
    # 9. IDENTIFY RISK FACTORS
    # =====================================================

    risk_factors = []

    if total_sales == 0:
        risk_factors.append(
            "No sales activity recorded"
        )

    elif profit < 0:
        risk_factors.append(
            "Business is operating at a loss"
        )

    if total_sales > 0:

        expense_ratio = (
            total_expenses / total_sales
        ) * 100

        if expense_ratio >= 70:
            risk_factors.append(
                "High expense-to-sales ratio"
            )

    if out_of_stock > 0:
        risk_factors.append(
            f"{out_of_stock} product(s) out of stock"
        )

    if low_stock > 0:
        risk_factors.append(
            f"{low_stock} product(s) have low stock"
        )

    if not risk_factors:
        risk_factors.append(
            "No major risk factors detected"
        )

    # =====================================================
    # 10. RETURN RISK ANALYSIS
    # =====================================================

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "message": message,
        "risk_factors": risk_factors
    }