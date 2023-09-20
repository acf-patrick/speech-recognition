// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    api::process::{Command, CommandEvent},
    Window,
};

#[tauri::command]
fn call_whisper(window: Window, audio_path: String) {
    let (mut rx, _) = Command::new_sidecar("main")
        .expect("Failed to call sidecar whisper")
        .args(["-m", "dataset", "-l", "fr", "-f", audio_path.as_str()])
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
