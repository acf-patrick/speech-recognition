import { useEffect, useState } from "react";
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
    margin: 1rem 0;
    font-size: 1.5rem;
  }

  progress {
    margin-right: 1rem;
    width: 250px;
    height: 20px;
    border-radius: 3px;
    overflow: hidden;

    -webkit-appearance: none;
    appearance: none;

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
`;

const StyledButton = styled.button<{ $color: string }>`
    all: unset;
    position: absolute;
    bottom: 1rem;
    right: 3rem;
    background-color: ${({ $color }) => $color};
    padding: 3px 15px;
    border-radius: 5px;
    font-weight: 400;
    cursor: pointer;
`;

function secondsToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function Modal({ onClose, progress }: { onClose: () => void, progress: number }) {
  const [time, setTime] = useState(0);
  const modal = document.querySelector("#modal");
  if (!modal) return null;

  useEffect(() => {
    if (progress < 100) {
      setTimeout(() => {
        setTime(time + 1);
      }, 1000);
    }
    console.log(time)
  }, [time])

  const buttonColor = progress >= 100 ? "green" : "red";
  const buttonText = progress >= 100 ? "OK" : "Annuler";

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
        <p>Temps de calcul: {secondsToHHMMSS(time)}</p>
        <StyledButton $color={buttonColor} onClick={onClose}>{buttonText}</StyledButton>
      </StyledModal>
    </>,
    modal
  );
}

export default Modal;
