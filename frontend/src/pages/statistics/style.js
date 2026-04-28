import styled from "styled-components";

export const Page = styled.div`
  display: grid;
  gap: 20px;
`;

export const EmptyMessage = styled.p`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.PALETTE.gray[500]};
`;
