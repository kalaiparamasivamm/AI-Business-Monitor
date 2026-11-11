def calculate_what_if(
    total_sales,
    total_expenses,
    sales_change_percent,
    expense_change_percent
):
    # Convert inputs safely
    total_sales = float(total_sales or 0)
    total_expenses = float(total_expenses or 0)

    sales_change_percent = float(sales_change_percent or 0)
    expense_change_percent = float(expense_change_percent or 0)

    # Current profit
    current_profit = total_sales - total_expenses

    # Calculate simulated values
    simulated_sales = total_sales * (1 + sales_change_percent / 100)
    simulated_expenses = total_expenses * (1 + expense_change_percent / 100)

    # Simulated profit
    simulated_profit = simulated_sales - simulated_expenses

    # Profit change
    profit_change = simulated_profit - current_profit

    # Determine result
    if simulated_profit > current_profit:
        result = "Improved"
        recommendation = (
            "This scenario can improve business profitability. "
            "Consider increasing sales while controlling expenses."
        )
    elif simulated_profit < current_profit:
        result = "Worsened"
        recommendation = (
            "This scenario may reduce profitability. "
            "Review the sales and expense changes before implementing them."
        )
    else:
        result = "No Change"
        recommendation = (
            "This scenario does not significantly change the business profit."
        )

    return {
        "current_sales": round(total_sales, 2),
        "current_expenses": round(total_expenses, 2),
        "current_profit": round(current_profit, 2),

        "sales_change_percent": round(sales_change_percent, 2),
        "expense_change_percent": round(expense_change_percent, 2),

        "simulated_sales": round(simulated_sales, 2),
        "simulated_expenses": round(simulated_expenses, 2),
        "simulated_profit": round(simulated_profit, 2),

        "profit_change": round(profit_change, 2),

        "result": result,
        "recommendation": recommendation
    }