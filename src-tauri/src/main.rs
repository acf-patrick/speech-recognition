// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs};

use tauri::{
    api::process::{kill_children, Command, CommandEvent},
    Manager, Window,
};

#[tauri::command]
fn kill_computation() {
    kill_children();
}

#[tauri::command]
fn open_file_location(file: String) -> Result<(), String> {
    if let Err(_) = std::process::Command::new("explorer")
        .args(["/select,", file.as_str()])
        .spawn()
    {
        Err(String::from(
            "Impossible d'ouvrir l'emplacement du fichier.",
        ))
    } else {
        Ok(())
    }
}

#[tauri::command]
fn call_whisper(
    window: Window,
    audio_path: String,
    output_path: String,
    language: Option<String>,
    extension: String,
    translate: bool,
) {
    let ext = match extension.as_str() {
        "txt" => "--output-txt",
        "vtt" => "--output-vtt",
        "srt" => "--output-srt",
        "lrc" => "--output-lrc",
        "csv" => "--output-csv",
        "json" => "--output-json",
        _ => "",
    };

    let mut args = vec![
        "-m".to_owned(),
        "dataset".to_owned(),
        ext.to_owned(),
        "--output-file".to_owned(),
        output_path,
        "-f".to_owned(),
        audio_path,
        "--print-progress".to_owned(),
    ];

    if translate {
        args.push("--translate".to_owned());
    }

    match language {
        Some(lang) => {
            args.push("-l".to_owned());
            args.push(lang.clone());
        }
        None => (),
    };

    let program_name: String;

    if let Some(_) = env::var_os("CUDA_PATH") {
        println!("CUDA is supported on this device, process will be faster...");
        fs::copy("whisper-cuda.dll", "whisper.dll").expect("Can't copy dll");
        program_name = "maincuda".to_string();
    } else {
        println!("CUDA is not supported on this device, process will use cpu...");
        fs::copy("whisper-vanilla.dll", "whisper.dll").expect("Can't copy dll");
        program_name = "main".to_string();
    }

    let (mut rx, _) = Command::new_sidecar(program_name)
        .expect("Failed to call sidecar whisper")
        .args(args)
        .spawn()
        .expect("Failed to spawn sidecar");

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line) => {
                    window
                        .emit("stdout", line)
                        .expect("Failed to emit stdout event");
                }
                CommandEvent::Stderr(line) => {
                    window
                        .emit("stderr", line)
                        .expect("Failed to emit stderr event");
                }
                CommandEvent::Error(line) => {
                    window
                        .emit("error", line)
                        .expect("Failed to emit error event");
                }
                CommandEvent::Terminated(_) => {
                    window
                        .emit("terminated", "")
                        .expect("Failed to emit terminated event");
                }
                _ => (),
            }
        }
    });
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_window("main").unwrap().open_devtools();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            call_whisper,
            kill_computation,
            open_file_location
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
