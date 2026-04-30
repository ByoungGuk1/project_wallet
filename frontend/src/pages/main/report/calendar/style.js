import styled from "styled-components";

export const S = {};

S.CalendarWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 18px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.PALETTE.white};
  border: 1px solid ${({ theme }) => theme.PALETTE.gray[200]};
  display: flex;
  flex-direction: column;
`;

S.CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

S.CalendarTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

S.CalendarTitle = styled.h3`
  color: ${({ theme }) => theme.PALETTE.text.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h5};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;

S.CalendarSubTitle = styled.p`
  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
`;

S.MonthControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

S.CalendarMonth = styled.strong`
  min-width: 70px;
  text-align: center;
  color: ${({ theme }) => theme.PALETTE.primary.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;

S.MonthButton = styled.button`
  height: 28px;
  padding: 0 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.PALETTE.gray[100]};
  color: ${({ theme }) => theme.PALETTE.text.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};

  &:hover {
    background-color: ${({ theme }) => theme.PALETTE.gray[200]};
  }
`;

S.TodayButton = styled.button`
  height: 28px;
  padding: 0 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.PALETTE.primary.main};
  color: ${({ theme }) => theme.PALETTE.white};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};

  &:hover {
    background-color: ${({ theme }) => theme.PALETTE.primary.light};
  }
`;

S.WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 6px;
`;

S.WeekDay = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};
`;

S.CalendarGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

S.EmptyCell = styled.div`
  min-height: 42px;
`;

S.CalendarCell = styled.div`
  min-height: 42px;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ $isToday, theme }) =>
    $isToday ? theme.PALETTE.primary.light : theme.PALETTE.gray[50]};
  border: 1px solid
    ${({ $isToday, theme }) =>
      $isToday ? theme.PALETTE.primary.main : theme.PALETTE.gray[200]};
`;

S.DateText = styled.strong`
  color: ${({ $isToday, theme }) =>
    $isToday ? theme.PALETTE.white : theme.PALETTE.text.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;

S.AmountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

S.IncomeText = styled.p`
  color: #2563eb;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};
`;

S.ExpenseText = styled.p`
  color: #dc2626;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};
`;

export default S;
