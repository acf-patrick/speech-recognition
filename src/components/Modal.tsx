import { useState } from "react";
import { createPortal } from "react-dom";
import { CgCloseR } from "react-icons/cg";
import styled from "styled-components";

const StyledModal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ theme }) => theme.sizes.modal.width};
  height: ${({ theme }) => theme.sizes.modal.height};
  background-color: ${({ theme }) => theme.colors.modal.background};
  z-index: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .close {
    all: unset;
    position: absolute;
    top: 0.3rem;
    right: 0.5rem;
    font-size: 1.5rem;
    cursor: pointer;
  }

  h1 {
    margin: 0.5rem 0;
  }

  progress {
    margin-right: 1rem;
    width: 250px;
    height: 20px;
    border-radius: 3px;
    overflow: hidden;

    -webkit-appearance: none;

    &::-webkit-progress-bar {
      background-color: ${({ theme }) => theme.colors.primary};
    }

    &::-webkit-progress-value {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }

  .prog-container {
    position: relative;

    span {
      display: block;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      color: ${({ theme }) => theme.colors.background};
      font-weight: bold;
    }
  }

  p {
    margin: 15px 0;
  }

  button {
    &:last-of-type {
      all: unset;
      position: absolute;
      bottom: 1rem;
      right: 3rem;
      background-color: red;
      padding: 3px 15px;
      border-radius: 5px;
      font-weight: 400;
      cursor: pointer;
    }
  }
`;

function Modal({ onClose }: { onClose: () => void }) {
  const [progress, setProgress] = useState(75);
  const [time, setTime] = useState("02:51:15");
  const modal = document.querySelector("#modal");
  if (!modal) return null;
  return createPortal(
    <>
      <div id="back" onClick={onClose}></div>
      <StyledModal>
        <button className="close" onClick={onClose}>
          <CgCloseR />
        </button>
        <h1>Progression</h1>
        <div className="prog-container">
          <progress value={progress} max={100}></progress>
          <span>{progress}%</span>
        </div>
        <p>Temps de calcul: {time}</p>
        <button onClick={onClose}>Annuler</button>
      </StyledModal>
    </>,
    modal
  );
}

export default Modal;
