import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.PALETTE.gray[300]};
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.PALETTE.primary.main};
  }
`;

export default Input;
