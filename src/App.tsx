import { useState } from "react";
import {
  StyledApp,
  StyledChooseButton,
  StyledTranscriptButton,
  StyledActions,
} from "./components";
import { GlobalStyles } from "./styles/globalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import SelectBox, { SelectBoxProps } from "./components/SelectBox";
import { AiFillFileAdd, AiFillSave, AiOutlineAudio } from "react-icons/ai";

const options: SelectBoxProps[] = [
  {
    label: "Langue",
    current: "Anglais",
    options: [
      { name: "Auto", code: "" },
      { name: "Anglais", code: "en" },
      { name: "Français", code: "fr" },
      { name: "Espagnol", code: "es" },
      { name: "Chinese", code: "ch" },
    ],
  },
  {
    label: "Type de sortie",
    current: "TXT",
    options: [
      { name: "TXT", code: "txt" },
      { name: "VTT", code: "vtt" },
      { name: "SRT", code: "srt" },
      { name: "LRC", code: "lrc" },
      { name: "CSV", code: "cvs" },
      { name: "JSON", code: "json" },
    ],
  },
];

function App() {
  const [chosenFilePath, setChosenFilePath] = useState("");
  const [outputFolderPath, setChosenFolderPath] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <StyledApp>
        {options.map((option, i) => (
          <SelectBox {...option} key={i} />
        ))}
        <StyledActions>
          <StyledChooseButton title="Choisir le fichier">
            <AiFillFileAdd />
          </StyledChooseButton>
          <StyledTranscriptButton>
            <AiOutlineAudio id="icon" />
            <span>Transcrire</span>
          </StyledTranscriptButton>
          <StyledChooseButton title="Choisir le fichier de sortie">
            <AiFillSave />
          </StyledChooseButton>
        </StyledActions>
        <div>
          <label htmlFor="translate">Traduire en anglais: </label>
          <input name="translate" type="checkbox" id="translate" />
        </div>
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
