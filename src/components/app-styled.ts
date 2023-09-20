import styled from "styled-components";

const StyledApp = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: ${({ theme }) => theme.sizes.window.width};
  height: calc(100vh - 1.5rem);
  overflow: hidden;
  margin: 0 auto;

  & > div {
    &:last-of-type > div:last-child {
      margin-top: 1rem;
      justify-content: center;
    }

    & > div {
      display: flex;
      align-items: center;
      gap: 2rem;

      p {
        margin: 0;
      }
    }
  }

  input {
    cursor: pointer;

    &[type="checkbox"] {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .file {
    cursor: pointer;
    color: #ffffff84;

    span {
      padding-left: 1rem;
    }
  }

  .error {
    height: 3rem;
  }
`;

export default StyledApp;
