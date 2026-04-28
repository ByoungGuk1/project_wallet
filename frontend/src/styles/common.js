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
  width: min(1080px, calc(100% - 40px));
  margin: 0 auto;
`;
