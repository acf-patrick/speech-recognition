// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    api::process::{Command, CommandEvent},
    Window,
};

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

    let (mut rx, _) = Command::new_sidecar("main")
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
                CommandEvent::Terminated(_t) => {
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
        .invoke_handler(tauri::generate_handler![call_whisper])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
