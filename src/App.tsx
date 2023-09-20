import { useEffect, useState } from "react";
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
  const [error, setError] = useState("erreur be ty rlerony e");

  useEffect(() => {
    appWindow.listen<string>("stdout", (line) => {
      console.log(line.payload);
    });

    appWindow.listen<string>("stderr", (line) => {
      console.error(line.payload);
    });

    appWindow.listen<string>("error", (line) => {
      setError(line.payload);
    });
  }, []);

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    invoke("call_whisper", {
      audioPath: "D:/FIT_Apprenti_Vague_006/whisper/essai1.wav",
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));

    /*const cmd = Command.sidecar("whisper/main", [
      "-m",
      "dataset",
      "-f",
      "D:/FIT_Apprenti_Vague_006/whisper/essai1.wav",
      "2>",
      "D:/stdout.txt",
    ]);

    cmd.addListener("error", (args) => {
      console.error(args);
    });

    cmd
      .execute()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));*/
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
      .catch();
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
      .catch((err) => console.error(err));
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
