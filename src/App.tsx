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

const langList = {
  label: "Langue",
  options: [
    { name: "Auto", code: "" },
    { name: "Anglais", code: "en" },
    { name: "Français", code: "fr" },
    { name: "Espagnol", code: "es" },
    { name: "Chinese", code: "ch" },
  ],
};

const formatList = {
  label: "Type de sortie",
  options: [
    { name: "TXT", code: "txt" },
    { name: "VTT", code: "vtt" },
    { name: "SRT", code: "srt" },
    { name: "LRC", code: "lrc" },
    { name: "CSV", code: "cvs" },
    { name: "JSON", code: "json" },
  ],
};

function App() {
  const [language, setLanguage] = useState("en");
  const [outputFormat, setOutputFormat] = useState("txt");
  const [chosenFilePath, setChosenFilePath] = useState("");
  const [outputFolderPath, setChosenFolderPath] = useState("");
  const [error, setError] = useState("");

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const chooseOutputOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {};

  const chooseInputOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {};

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <StyledApp onSubmit={formOnSubmit}>
        <SelectBox
          {...langList}
          onChange={(curr) => setLanguage(curr)}
          current={langList.options.find((opt) => opt.code === language)!.name}
        />
        <SelectBox
          {...formatList}
          onChange={(curr) => setOutputFormat(curr)}
          current={
            formatList.options.find((opt) => opt.code === outputFormat)!.name
          }
        />
        <StyledActions>
          <StyledChooseButton
            onClick={chooseInputOnClick}
            type="button"
            title="Choisir le fichier audio"
          >
            <AiFillFileAdd />
          </StyledChooseButton>
          <StyledTranscriptButton>
            <AiOutlineAudio />
            <span>Transcrire</span>
          </StyledTranscriptButton>
          <StyledChooseButton
            onClick={chooseOutputOnClick}
            type="button"
            title="Choisir le fichier de sortie"
          >
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
