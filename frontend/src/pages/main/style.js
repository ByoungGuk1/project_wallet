import styled from "styled-components";
import { Link } from "react-router-dom";

export const S = {};

S.Page = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.PALETTE.background};
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

S.FirstSection = styled.section`
  width: 100%;
  height: 348px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

S.AdSection = styled.section`
  width: 65%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

S.SigninSection = styled.section`
  width: 30%;
  height: 100%;
  background-color: #a36c6c;
  display: flex;
  align-items: center;
  justify-content: center;
`;

S.ReportSection = styled.section`
  width: 100%;
  height: 348px;
`;

S.EventsSection = styled.section`
  width: 100%;
  height: 920px;
  background-color: #343483;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

S.EventsRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

S.NotificationsSection = styled.section`
  width: 100%;
  height: 121px;
  background-color: #834343;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  > div {
    width: 33%;
    height: 100%;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.PALETTE.text.secondary};
  }
`;

S.CustomerServiceBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > p {
    padding: 20px 0 7px 20px;
    font-size: ${({ theme }) => theme.FONT_SIZE.h6};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
    color: ${({ theme }) => theme.PALETTE.text.main};
  }
  > div {
    display: flex;
    width: calc(100% - 40px);
    height: 100%;
    gap: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }
`;

S.CustomerService = styled(Link)`
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.regular};
  color: ${({ theme }) => theme.PALETTE.text.main};
  > img,
  > span {
    width: 34px;
    height: 29px;
    font-size: 29px;
  }
`;

export default S;
