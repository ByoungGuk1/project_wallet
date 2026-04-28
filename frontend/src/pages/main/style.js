import styled from "styled-components";

export const Page = styled.div`
  display: grid;
  gap: 20px;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryItem = styled.div`
  padding: 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.PALETTE.gray[50]};
`;

export const SummaryLabel = styled.p`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.PALETTE.gray[500]};
  font-size: ${({ theme }) => theme.FONT_SIZE.small};
`;

export const SummaryValue = styled.strong`
  font-size: ${({ theme }) => theme.FONT_SIZE.h4};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.bold};
`;
