import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { boxShadow } from "../../../styles/common";

export const S = {};

S.LoginWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 18px 20px 14px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.PALETTE.white};
  border: 1px solid ${({ theme }) => theme.PALETTE.gray[200]};
  ${boxShadow}
  display: flex;
  flex-direction: column;
`;

S.TabList = styled.div`
  display: grid;
  margin-top: 12px;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid ${({ theme }) => theme.PALETTE.gray[200]};
  margin-bottom: 18px;
`;

S.TabButton = styled.button`
  height: 32px;
  padding-bottom: 12px;

  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};

  ${({ $active, theme }) =>
    $active &&
    css`
      color: ${theme.PALETTE.text.main};
      font-weight: ${theme.FONT_WEIGHT.bold};
      border-bottom: 2px solid ${theme.PALETTE.primary.main};
    `}
  &:hover {
    color: ${({ theme }) => theme.PALETTE.text.main};
    border-bottom: 1px solid ${({ theme }) => theme.PALETTE.primary.main};
  }
`;

S.TabContent = styled.div`
  flex: 1;
`;

S.LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

S.InputRow = styled.div`
  position: relative;
  width: 100%;
  height: 42px;
`;

S.LoginInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 86px 0 14px;

  border: 1px solid ${({ theme }) => theme.PALETTE.gray[400]};
  border-radius: 4px;

  color: ${({ theme }) => theme.PALETTE.text.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};

  &::placeholder {
    color: ${({ theme }) => theme.PALETTE.text.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.PALETTE.primary.main};
  }
`;

S.SaveIdBox = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  gap: 6px;

  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
`;

S.SaveCircle = styled.span`
  width: 18px;
  height: 18px;
  border: 1px solid ${({ theme }) => theme.PALETTE.gray[400]};
  border-radius: 50%;
`;

S.InfoIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);

  width: 18px;
  height: 18px;

  border: 1px solid ${({ theme }) => theme.PALETTE.gray[400]};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;

S.LoginButton = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 10px;

  border-radius: 4px;
  background-color: ${({ theme }) => theme.PALETTE.primary.light};

  color: ${({ theme }) => theme.PALETTE.white};
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};

  &:hover {
    background-color: ${({ theme }) => theme.PALETTE.primary.main};
  }
`;

S.AuthLinkRow = styled.div`
  margin-top: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.PALETTE.gray[200]};

  display: flex;
  justify-content: space-between;
`;

S.AuthLink = styled(Link)`
  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.PALETTE.text.main};
  }
`;

S.QuickMenu = styled.div`
  height: 52px;
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
`;

S.QuickMenuItem = styled(Link)`
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  color: ${({ theme }) => theme.PALETTE.text.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};
  text-decoration: none;
`;

S.QuickIcon = styled.span`
  font-size: 20px;
  line-height: 1;
`;

S.QuickDivider = styled.span`
  width: 1px;
  height: 14px;
  background-color: ${({ theme }) => theme.PALETTE.gray[300]};
`;

S.SocialButton = styled.button`
  width: 100%;
  height: 42px;

  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.PALETTE.gray[300]};
  background-color: ${({ theme }) => theme.PALETTE.white};

  color: ${({ theme }) => theme.PALETTE.text.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};

  &:hover {
    background-color: ${({ theme }) => theme.PALETTE.gray[50]};
  }
`;

S.CertificateBox = styled.div`
  height: 142px;
  padding: 18px;

  border: 1px solid ${({ theme }) => theme.PALETTE.gray[200]};
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

S.CertificateTitle = styled.h3`
  margin-bottom: 8px;

  color: ${({ theme }) => theme.PALETTE.text.main};
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;

S.CertificateText = styled.p`
  margin-bottom: 12px;

  color: ${({ theme }) => theme.PALETTE.text.secondary};
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  line-height: 1.5;
`;

export default S;
