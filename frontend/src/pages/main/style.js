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
  height: 450px;
  background-color: #865a5a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

S.AdSection = styled.section`
  width: 65%;
  height: 100%;
  background-color: #f3cdcd;
  display: flex;
  align-items: center;
  justify-content: center;
`;

S.SigninSection = styled.section`
  width: 30%;
  height: 100%;
  background-color: #af8686;
  display: flex;
  align-items: center;
  justify-content: center;
`;

S.ReportSection = styled.section`
  width: 100%;
  height: 450px;
`;

S.EventsSection = styled.section`
  width: 100%;
  height: 920px;
  display: flex;
  flex-direction: column;
`;

S.SubEventsWrapper = styled.div`
  display: flex;
  gap: 35px;
  justify-content: space-between;
`;

S.NotificationsSection = styled.section`
  width: 100%;
  height: 121px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  > div {
    width: 33%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.PALETTE.gray[300]};
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    justify-content: center;
  }
`;

S.CustomerServiceBox = styled.div`
  > p {
    font-size: ${({ theme }) => theme.FONT_SIZE.h6};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
    color: ${({ theme }) => theme.PALETTE.text.main};
  }
`;

S.CustomerServiceWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  width: 100%;
`;

S.CustomerService = styled(Link)`
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
