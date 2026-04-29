import styled from "styled-components";
import { Link } from "react-router-dom";

export const S = {};

S.NotificationWrapper=styled.div`
  width: 100%;
  height: 100%;
`;

S.NotificationType = styled(Link)`
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
  color: ${({ theme }) => theme.PALETTE.text.main};
  margin-bottom: 4px;
`;

S.NotificationTitle = styled(Link)`
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.medium};
`;

S.NotificationDate = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.h7};
  color: ${({ theme }) => theme.PALETTE.text.secondary};
`;

export default S;
