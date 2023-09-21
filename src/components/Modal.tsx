import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CgCloseR } from "react-icons/cg";
import styled from "styled-components";
import { invoke } from "@tauri-apps/api";
import { FaFolderOpen } from "react-icons/fa";

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

  p {
    margin: 15px 0;
  }

  .close {
    all: unset;
    position: absolute;
    top: 0.3rem;
    right: 0.5rem;
    font-size: 1.5rem;
    cursor: pointer;
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

  .btn-folder {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    padding: unset;
    right: 2rem;
  }
`;

const StyledButton = styled.button<{ $color: string }>`
  all: unset;
  position: absolute;
  bottom: 1rem;
  right: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ $color }) => $color};
  padding: 3px 15px;
  border-radius: 5px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 500ms;

  &:hover {
    background-color: transparent;
    outline: 2px solid ${({ $color }) => $color};
  }
`;

function secondsToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function Modal({
  onClose,
  progress,
  outputFile,
}: {
  onClose: () => void;
  progress: number;
  outputFile: string;
}) {
  const [time, setTime] = useState(0);
  const modal = document.querySelector("#modal");
  if (!modal) return null;

  useEffect(() => {
    if (progress < 100) {
      setTimeout(() => {
        setTime(time + 1);
      }, 1000);
    }
  }, [time]);

  const buttonColor = progress >= 100 ? "green" : "red";

  const close = () => {
    invoke("kill_computation")
      .then((res) => {
        console.log(res);
        console.log("process killed");
      })
      .catch((err) => console.error(err));
    onClose();
  };

  const openOutputLocation = () => {
    invoke("open_file_location", {
      file: outputFile,
    }).catch((err) => console.error(err));
  };

  return createPortal(
    <>
      <div id="back"></div>
      <StyledModal>
        <button className="close" onClick={close}>
          <CgCloseR />
        </button>
        <h1>Progression</h1>
        <div className="prog-container">
          <progress value={progress} max={100}></progress>
          <span>{progress}%</span>
        </div>
        <p>Temps de calcul: {secondsToHHMMSS(time)}</p>
        {progress >= 100 ? (
          <StyledButton
            $color={buttonColor}
            onClick={openOutputLocation}
            className="btn-folder"
            title="Ouvrir l'emplacement du fichier"
          >
            <FaFolderOpen />
          </StyledButton>
        ) : (
          <StyledButton $color={buttonColor} onClick={close}>
            Annuler
          </StyledButton>
        )}
      </StyledModal>
    </>,
    modal
  );
}

export default Modal;
