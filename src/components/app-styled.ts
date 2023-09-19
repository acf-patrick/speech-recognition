import styled from "styled-components";

const StyledApp = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: ${({ theme }) => theme.sizes.window.width};
  overflow: hidden;
  margin: 0 auto;
  gap: 1rem;

  & > div {
    display: flex;
    align-items: center;
    gap: 2rem;

    p {
      margin: 0;
    }
  }

  input {
    cursor: pointer;

    &[type="checkbox"] {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .error {
    height: 3rem;
  }
`;

export default StyledApp;
