import styled from "styled-components";

const StyledChooseButton = styled.button`
  all: unset;
  background-color: transparent;
  border: solid 1px ${({ theme }) => theme.colors.primary};
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  font-size: 25px;
  transition: color 350ms, background-color 350ms;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }
`;

export default StyledChooseButton;
