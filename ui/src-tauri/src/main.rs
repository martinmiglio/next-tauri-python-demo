// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::Manager;

pub fn main() {
  struct _ServiceProcess(Mutex<Option<tauri_plugin_shell::process::CommandChild>>);

  tauri::Builder::default()
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
      let windows = app.webview_windows();
      windows
        .values()
        .next()
        .expect("Sorry, no window found")
        .set_focus()
        .expect("Can't Bring Window to Focus");
    }))
    .plugin(tauri_plugin_websocket::init())
    .setup(|_app| {
      #[cfg(not(debug_assertions))]
      {
        use tauri_plugin_shell::ShellExt;

        // create command to spawn the service
        let cmd = _app
          .shell()
          .sidecar("service")
          .expect("failed to create sidecar command");

        // spawn the command
        let (_, child) = cmd.spawn().expect("failed to spawn sidecar command");

        // store the child process in the app state
        _app.manage(_ServiceProcess(Mutex::new(Some(child))));

        // get main window
        let window = _app.get_webview_window("main").unwrap();

        // clone app handle to be used in the window event closure
        let c_app = _app.handle().clone();

        window.on_window_event(move |event| {
          match event {
            // when the window is destroyed, kill the child process stored in the app state
            tauri::WindowEvent::Destroyed => c_app
              .state::<_ServiceProcess>()
              .0
              .lock()
              .unwrap()
              .take()
              .map(|child| {
                child.kill().expect("failed to kill child process");
              }),
            _ => Some({}),
          };
        });
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
