import styled, { css } from "styled-components";

const variantCSS = {
  primary: css`
    background: ${({ theme }) => theme.PALETTE.primary.main};
    color: ${({ theme }) => theme.PALETTE.white};
  `,
  outline: css`
    border: 1px solid ${({ theme }) => theme.PALETTE.gray[300]};
    color: ${({ theme }) => theme.PALETTE.gray[700]};
  `,
};

const Button = styled.button`
  min-width: 96px;
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.semiBold};
  ${({ variant = "primary" }) => variantCSS[variant]}
`;

export default Button;
