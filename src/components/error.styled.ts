import { styled } from "styled-components";

const StyledError = styled.p`
  color: #ff6464;
  padding: 10px 2rem;
  background: #ff000041;
  border-left: 10px solid red;
  border-radius: 3px 0 0 3px;
  position: relative;
  max-width: 260px;
  max-height: 3rem;
  overflow-y: auto;

  svg {
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
  }
`;

export default StyledError;
