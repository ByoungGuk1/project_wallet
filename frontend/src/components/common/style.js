import styled from "styled-components";

export const CardWrapper = styled.section`
  padding: 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.PALETTE.white};
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.06);
`;

export const CardTitle = styled.h2`
  margin-bottom: 16px;
  font-size: ${({ theme }) => theme.FONT_SIZE.h3};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;

export const CardBody = styled.div`
  width: 100%;
`;
