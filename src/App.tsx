import { useEffect, useRef, useState } from "react";
import {
  StyledApp,
  StyledChooseButton,
  StyledTranscriptButton,
  StyledActions,
  StyledError,
  SelectBox,
} from "./components";
import { GlobalStyles } from "./styles/globalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import { BiError } from "react-icons/bi";
import { dialog } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { AiFillFileAdd, AiFillSave, AiOutlineAudio } from "react-icons/ai";
import { LuFileInput, LuFileOutput } from "react-icons/lu";

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
    { name: "CSV", code: "csv" },
    { name: "JSON", code: "json" },
  ],
};

function App() {
  const [language, setLanguage] = useState("en");
  const [outputFormat, setOutputFormat] = useState("txt");
  const [chosenFilePath, setChosenFilePath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const [error, setError] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      appWindow.listen<string>("stdout", (line) => {
        console.log(line.payload);
      });

      appWindow.listen<string>("stderr", (line) => {
        console.error(line.payload);
      });

      appWindow.listen<string>("error", (line) => {
        setError(line.payload);
      });

      appWindow.listen<string>("terminated", (_e) => {
        console.log("Transcription finished successfully!");
      });
    }
  }, []);

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!chosenFilePath) {
      setError("Aucun fichier audio séléctionné.");
      return;
    }

    if (!outputPath) {
      setError("Aucun fichier de sortie séléctionné.");
      return;
    }

    const input = document.querySelector("#translate") as HTMLInputElement;

    invoke("call_whisper", {
      audioPath: chosenFilePath,
      outputPath: outputPath.replace("." + outputFormat, ""),
      language: language ? language : null,
      extension: outputFormat,
      translate: input.checked,
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  const chooseOutputOnClick = () => {
    dialog
      .save({
        filters: [
          {
            name: "Fichier texte",
            extensions: [outputFormat],
          },
        ],
      })
      .then((path) => {
        if (path) {
          setOutputPath(path);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setError(""));
  };

  const chooseInputOnClick = () => {
    dialog
      .open({
        filters: [
          {
            name: "Fichier audio",
            extensions: ["wav", "mp3", "mp4", "ogg", "flac"],
          },
        ],
        title: "Choisir le fichier audio",
      })
      .then((path) => {
        if (path) {
          setChosenFilePath(path as string);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setError(""));
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <StyledApp onSubmit={formOnSubmit}>
        <div>
          <SelectBox
            {...langList}
            onChange={(curr) => setLanguage(curr)}
            current={
              langList.options.find((opt) => opt.code === language)!.name
            }
          />
          <SelectBox
            {...formatList}
            onChange={(curr) => setOutputFormat(curr)}
            current={
              formatList.options.find((opt) => opt.code === outputFormat)!.name
            }
          />
          {chosenFilePath && (
            <p
              className="file"
              title={chosenFilePath}
              onClick={chooseInputOnClick}
            >
              <LuFileInput />
              <span>
                {chosenFilePath.length > 38
                  ? "..." + chosenFilePath.slice(chosenFilePath.length - 38)
                  : chosenFilePath}
              </span>
            </p>
          )}
          {outputPath && (
            <p
              className="file"
              title={outputPath}
              onClick={chooseOutputOnClick}
            >
              <LuFileOutput />
              <span>
                {outputPath.length > 38
                  ? "..." + outputPath.slice(outputPath.length - 38)
                  : outputPath}
              </span>
            </p>
          )}
          {error ? (
            <StyledError>
              <BiError />
              <span>{error}</span>
            </StyledError>
          ) : (
            <div className="error"></div>
          )}
        </div>
        <div>
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
        </div>
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
