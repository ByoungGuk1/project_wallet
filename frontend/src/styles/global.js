import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Arial, "Noto Sans KR", sans-serif;
    background: ${({ theme }) => theme.PALETTE.background};
    color: ${({ theme }) => theme.PALETTE.black};
    margin: 0 auto;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }
`;

export default GlobalStyle;
