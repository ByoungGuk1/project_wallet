from datetime import date

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.member import Member
from app.models.enums import TransactionType


def get_summary(db: Session, current_member: Member):
    today = date.today()
    month_start = date(today.year, today.month, 1)

    total_balance = db.execute(
        text("""
            SELECT COALESCE(SUM(balance), 0)
            FROM accounts
            WHERE member_id = :member_id
        """),
        {"member_id": current_member.id},
    ).scalar()

    monthly_income = db.execute(
        text("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM transactions t
            JOIN accounts a ON t.account_id = a.id
            WHERE a.member_id = :member_id
              AND t.transaction_type = 'INCOME'
              AND t.transaction_date >= :month_start
        """),
        {
            "member_id": current_member.id,
            "month_start": month_start,
        },
    ).scalar()

    monthly_expense = db.execute(
        text("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM transactions t
            JOIN accounts a ON t.account_id = a.id
            WHERE a.member_id = :member_id
              AND t.transaction_type = 'EXPENSE'
              AND t.transaction_date >= :month_start
        """),
        {
            "member_id": current_member.id,
            "month_start": month_start,
        },
    ).scalar()
    return {
        "total_balance": int(total_balance),
        "monthly_income": int(monthly_income),
        "monthly_expense": int(monthly_expense),
    }


def get_monthly_statistics(db: Session, current_member: Member):
    rows = db.execute(
        text("""
            SELECT
                DATE_FORMAT(t.transaction_date, '%Y-%m') AS month,
                COALESCE(SUM(CASE WHEN t.transaction_type = 'INCOME' THEN t.amount ELSE 0 END), 0) AS income,
                COALESCE(SUM(CASE WHEN t.transaction_type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS expense
            FROM transactions t
            JOIN accounts a ON t.account_id = a.id
            WHERE a.member_id = :member_id
            GROUP BY DATE_FORMAT(t.transaction_date, '%Y-%m')
            ORDER BY month
        """),
        {"member_id": current_member.id},
    ).fetchall()
    return [
        {
            "month": row.month,
            "income": int(row.income),
            "expense": int(row.expense),
        }
        for row in rows
    ]


def get_category_statistics(
    db: Session,
    current_member: Member,
    transaction_type: TransactionType | None = None,
):
    rows = db.execute(
        text("""
            SELECT
                c.name AS category,
                c.category_type AS category_type,
                COALESCE(SUM(t.amount), 0) AS amount
            FROM transactions t
            JOIN accounts a ON t.account_id = a.id
            JOIN categories c ON t.category_id = c.id
            WHERE a.member_id = :member_id
              AND c.member_id = :member_id
              AND (:transaction_type IS NULL OR t.transaction_type = :transaction_type)
            GROUP BY c.id, c.name, c.category_type
            ORDER BY c.category_type, amount DESC
        """),
        {
            "member_id": current_member.id,
            "transaction_type": transaction_type.value if transaction_type else None,
        },
    ).fetchall()
    return [
        {
            "category": row.category,
            "category_type": row.category_type,
            "amount": int(row.amount),
        }
        for row in rows
    ]
