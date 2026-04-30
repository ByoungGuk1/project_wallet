import { useState } from "react";
import S from "./style";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarContainer = ({ groupName, calendar = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const movePrevMonth = () => {
    setCurrentMonth((prevMonth) => {
      return new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1);
    });
  };

  const moveNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      return new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);
    });
  };

  const moveToday = () => {
    setCurrentMonth(new Date());
  };

  const formatDateKey = (day) => {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0",
    )}`;
  };

  const normalizeAmount = (amount) => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") {
      return Number(amount.replaceAll(",", ""));
    }
    return 0;
  };

  const formatAmount = (amount) => {
    return normalizeAmount(amount).toLocaleString();
  };

  const getMonthCells = () => {
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);

    const firstDayOfWeek = firstDate.getDay();
    const lastDateNumber = lastDate.getDate();

    const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => ({
      id: `empty-${year}-${month}-${index}`,
      isEmpty: true,
    }));

    const dayCells = Array.from({ length: lastDateNumber }, (_, index) => {
      const day = index + 1;
      const dateKey = formatDateKey(day);

      const matchedData = calendar.find((item) => item.date === dateKey);

      return {
        id: dateKey,
        day,
        date: dateKey,
        income: normalizeAmount(matchedData?.income),
        expenses: normalizeAmount(matchedData?.expenses),
        isEmpty: false,
        isToday: dateKey === todayKey,
      };
    });

    return [...emptyCells, ...dayCells];
  };

  const monthCells = getMonthCells();

  return (
    <S.CalendarWrapper>
      <S.CalendarHeader>
        <S.CalendarTitleBox>
          <S.CalendarTitle>{groupName || "자산 캘린더"}</S.CalendarTitle>
          <S.CalendarSubTitle>월별 수입/지출 흐름</S.CalendarSubTitle>
        </S.CalendarTitleBox>

        <S.MonthControl>
          <S.MonthButton type="button" onClick={movePrevMonth}>
            이전
          </S.MonthButton>

          <S.CalendarMonth>
            {year}.{String(month).padStart(2, "0")}
          </S.CalendarMonth>

          <S.MonthButton type="button" onClick={moveNextMonth}>
            다음
          </S.MonthButton>

          <S.TodayButton type="button" onClick={moveToday}>
            오늘
          </S.TodayButton>
        </S.MonthControl>
      </S.CalendarHeader>

      <S.WeekHeader>
        {WEEK_DAYS.map((day) => (
          <S.WeekDay key={day}>{day}</S.WeekDay>
        ))}
      </S.WeekHeader>

      <S.CalendarGrid>
        {monthCells.map((item) =>
          item.isEmpty ? (
            <S.EmptyCell key={item.id} />
          ) : (
            <S.CalendarCell key={item.id} $isToday={item.isToday}>
              <S.DateText $isToday={item.isToday}>{item.day}</S.DateText>

              <S.AmountList>
                {item.income > 0 && (
                  <S.IncomeText>+{formatAmount(item.income)}</S.IncomeText>
                )}

                {item.expenses > 0 && (
                  <S.ExpenseText>-{formatAmount(item.expenses)}</S.ExpenseText>
                )}
              </S.AmountList>
            </S.CalendarCell>
          ),
        )}
      </S.CalendarGrid>
    </S.CalendarWrapper>
  );
};

export default CalendarContainer;
