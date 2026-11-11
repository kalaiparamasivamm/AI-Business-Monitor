def generate_diagnosis(
    total_sales,
    total_expenses,
    profit,
    low_stock,
    out_of_stock
):

    # Make sure values are valid
    total_sales = float(total_sales or 0)
    total_expenses = float(total_expenses or 0)
    profit = float(profit or 0)

    low_stock = int(low_stock or 0)
    out_of_stock = int(out_of_stock or 0)

    diagnosis = []
    prescriptions = []

    # =========================================================
    # 1. PROFITABILITY ANALYSIS
    # =========================================================

    if total_sales == 0:

        diagnosis.append(
            "No sales activity has been recorded for the business."
        )

        prescriptions.append(
            "Focus on generating sales and attracting more customers."
        )

    elif profit < 0:

        diagnosis.append(
            "The business is currently operating at a loss."
        )

        prescriptions.append(
            "Reduce unnecessary expenses and focus on increasing profitable sales."
        )

    elif profit == 0:

        diagnosis.append(
            "The business is currently operating at break-even."
        )

        prescriptions.append(
            "Increase sales and control operating expenses to improve profitability."
        )

    else:

        profit_margin = (profit / total_sales) * 100

        diagnosis.append(
            f"The business is currently profitable with a "
            f"profit margin of {profit_margin:.1f}%."
        )

        prescriptions.append(
            "Maintain profitable sales growth while carefully controlling expenses."
        )

    # =========================================================
    # 2. EXPENSE ANALYSIS
    # =========================================================

    if total_sales > 0:

        expense_ratio = (
            total_expenses / total_sales
        ) * 100

        if expense_ratio >= 100:

            diagnosis.append(
                "Expenses are higher than total sales."
            )

            prescriptions.append(
                "Immediately review major operating expenses and "
                "reduce avoidable costs."
            )

        elif expense_ratio >= 80:

            diagnosis.append(
                "Expenses are very high compared to sales."
            )

            prescriptions.append(
                "Review major expenses and reduce unnecessary operating costs."
            )

        elif expense_ratio >= 60:

            diagnosis.append(
                "Expenses are relatively high compared to sales."
            )

            prescriptions.append(
                "Monitor expenses closely and identify opportunities for cost reduction."
            )

        elif expense_ratio <= 40:

            diagnosis.append(
                "Expense levels are well controlled compared to sales."
            )

            prescriptions.append(
                "Continue monitoring expenses to maintain healthy cost control."
            )

    # =========================================================
    # 3. INVENTORY ANALYSIS
    # =========================================================

    if out_of_stock > 0:

        diagnosis.append(
            f"{out_of_stock} product(s) are currently out of stock."
        )

        prescriptions.append(
            "Restock unavailable products quickly to avoid missed sales opportunities."
        )

    if low_stock > 0:

        diagnosis.append(
            f"{low_stock} product(s) have low stock levels."
        )

        prescriptions.append(
            "Consider restocking low-stock products before they run out."
        )

    # =========================================================
    # 4. OVERALL BUSINESS STATUS
    # =========================================================

    if total_sales == 0:

        overall_status = "Critical"

    elif profit < 0 and total_expenses > total_sales:

        overall_status = "Critical"

    elif profit < 0:

        overall_status = "Needs Attention"

    elif profit == 0:

        overall_status = "Needs Attention"

    elif out_of_stock > 0:

        overall_status = "Needs Attention"

    elif low_stock >= 3:

        overall_status = "Needs Attention"

    else:

        overall_status = "Healthy"

    # =========================================================
    # 5. REMOVE DUPLICATE RECOMMENDATIONS
    # =========================================================

    prescriptions = list(dict.fromkeys(prescriptions))

    diagnosis = list(dict.fromkeys(diagnosis))

    # =========================================================
    # 6. RETURN AI DIAGNOSIS
    # =========================================================

    return {
        "overall_status": overall_status,
        "diagnosis": diagnosis,
        "prescriptions": prescriptions
    }