import styled from "styled-components";

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 640px;
  height: 480px;
  overflow: hidden;
  border: solid 1px red;
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
  }
`;

export default StyledApp;
