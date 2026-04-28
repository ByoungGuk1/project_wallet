import styled from "styled-components";

export const AccountListWrapper = styled.div`
  display: grid;
  gap: 12px;
`;

export const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.PALETTE.gray[500]};
`;
