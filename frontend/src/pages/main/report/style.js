import styled, { css } from "styled-components";

export const S = {};

S.ReportWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

S.CalendarSection = styled.div`
  width: 65%;
  height: 100%;
`;

S.GroupSection = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

S.CategoryList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  padding: 0 30px;
  margin: 27px auto;
  border-bottom: 1px solid ${({ theme }) => theme.PALETTE.primary.light};
`;

S.CategoryButton = styled.button`
  padding-bottom: 13px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};

  ${({ $selected, theme }) =>
    $selected
      ? css`
          color: ${theme.PALETTE.text.main};
          border-bottom: 1px solid ${theme.PALETTE.primary.main};
        `
      : css`
          color: ${theme.PALETTE.text.secondary};

          &:hover,
          &:focus {
            color: ${theme.PALETTE.text.main};
            border-bottom: 1px solid ${theme.PALETTE.primary.main};
          }
        `}
`;

S.SettingButton = styled.button`
  cursor: pointer;
  padding-bottom: 13px;
  color: ${({ theme }) => theme.PALETTE.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.PALETTE.text.main};
    border-bottom: 1px solid ${({ theme }) => theme.PALETTE.primary.main};
  }
`;

S.GroupList = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: auto;
`;

S.NoData = styled.p`
  width: 100%;
  height: 60px;
  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h4};
  text-align: center;
`;

S.GroupButton = styled.button`
  width: 100%;
  height: 60px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.FONT_SIZE.h4};
  ${({ $selected, theme }) =>
    $selected
      ? css`
          background-color: ${theme.PALETTE.primary.main};
          color: ${theme.PALETTE.background};
        `
      : css`
          &:hover {
            background-color: ${theme.PALETTE.primary.light};
            color: ${theme.PALETTE.background};
          }
          &:focus {
            background-color: ${theme.PALETTE.primary.main};
            color: ${theme.PALETTE.background};
          }
        `}
`;

export default S;
