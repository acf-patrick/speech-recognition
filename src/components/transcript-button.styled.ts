import styled from "styled-components";

export const StyledTranscriptButton = styled.button`
  width: 200px;
  height: 200px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.button.background};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: solid 1px ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: color 350ms, background-color 350ms;
  gap: 1rem;
  font-weight: bolder;
  letter-spacing: 1.5px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }

  #icon {
    font-size: 65px;
  }
`;
