from datetime import date

from sqlalchemy import text
from sqlalchemy.orm import Session

def get_summary(db: Session):
    today = date.today()
    month_start = date(today.year, today.month, 1)

    total_balance = db.execute(
        text("""
            SELECT COALESCE(SUM(balance), 0)
            FROM accounts
        """)
    ).scalar()

    monthly_income = db.execute(
        text("""
            SELECT COALESCE(SUM(amount), 0)
            FROM transactions
            WHERE transaction_type = 'INCOME'
              AND transaction_date >= :month_start
        """),
        {"month_start": month_start},
    ).scalar()

    monthly_expense = db.execute(
        text("""
            SELECT COALESCE(SUM(amount), 0)
            FROM transactions
            WHERE transaction_type = 'EXPENSE'
              AND transaction_date >= :month_start
        """),
        {"month_start": month_start},
    ).scalar()

    return {
        "total_balance": int(total_balance),
        "monthly_income": int(monthly_income),
        "monthly_expense": int(monthly_expense),
    }


def get_monthly_statistics(db: Session):
    rows = db.execute(
    text("""
        SELECT
            DATE_FORMAT(transaction_date, '%Y-%m') AS month,
            COALESCE(SUM(CASE WHEN transaction_type = 'INCOME' THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN transaction_type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expense
        FROM transactions
        GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
        ORDER BY month
        """)
    ).fetchall()
    return [
    {
        "month": row.month,
        "income": int(row.income),
        "expense": int(row.expense),
    }
    for row in rows
    ]


def get_category_statistics(db: Session):
    rows = db.execute(
    text("""
        SELECT
            c.name AS category,
            COALESCE(SUM(t.amount), 0) AS amount
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.transaction_type = 'EXPENSE'
        GROUP BY c.id, c.name
        ORDER BY amount DESC
        """)
    ).fetchall()
    return [
    {
        "category": row.category,
        "amount": int(row.amount),
    }
    for row in rows
    ]
