import { css } from "styled-components";

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const flexBetweenRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const pageContainer = css`
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
`;

export const boxShadow = css`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
