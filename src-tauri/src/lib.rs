use tauri::{AppHandle, Manager, Emitter};
use serde::{Serialize, Deserialize};
use std::sync::Mutex;
use rusqlite::{Connection, params};
use walkdir::WalkDir;
use id3::{Tag, TagLike};
use sha2::{Sha256, Digest};
use std::path::Path;

struct AppState {
    db: Mutex<Connection>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct User {
    id: i32,
    username: String,
    currency: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MusicTrack {
    pub path: String,
    pub title: String,
    pub artist: String,
    pub duration: u32,
}

#[tauri::command]
fn register(state: tauri::State<'_, AppState>, username: String, password: String) -> Result<User, String> {
    let db = state.db.lock().map_err(|_| "Database lock failed")?;
    
    // Hash password
    let mut hasher = Sha256::new();
    hasher.update(password);
    let result = hasher.finalize();
    let password_hash = hex::encode(result);

    match db.execute(
        "INSERT INTO users (username, password_hash, currency) VALUES (?1, ?2, ?3)",
        params![username, password_hash, 0], // Initial currency 0
    ) {
        Ok(_) => {
            let id = db.last_insert_rowid() as i32;
            Ok(User { id, username, currency: 0 })
        },
        Err(e) => Err(format!("Registration failed: {}", e)),
    }
}

#[tauri::command]
fn login(state: tauri::State<'_, AppState>, username: String, password: String) -> Result<User, String> {
    let db = state.db.lock().map_err(|_| "Database lock failed")?;

    let mut hasher = Sha256::new();
    hasher.update(password);
    let result = hasher.finalize();
    let password_hash = hex::encode(result);

    let mut stmt = db.prepare("SELECT id, username, currency FROM users WHERE username = ?1 AND password_hash = ?2").map_err(|e| e.to_string())?;
    
    let user_iter = stmt.query_map(params![username, password_hash], |row| {
        Ok(User {
            id: row.get(0)?,
            username: row.get(1)?,
            currency: row.get(2)?,
        })
    }).map_err(|e| e.to_string())?;

    for user in user_iter {
        return user.map_err(|e| e.to_string());
    }

    Err("Invalid username or password".to_string())
}

#[tauri::command]
async fn scan_music(path: String) -> Result<Vec<MusicTrack>, String> {
    println!("Scanning music in path: {}", path);
    let path_buf = Path::new(&path);
    if !path_buf.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    // Use tokio::task::spawn_blocking for heavy IO
    let tracks = tokio::task::spawn_blocking(move || {
        let mut local_tracks = Vec::new();
        for entry in WalkDir::new(&path).into_iter().filter_map(|e| e.ok()) {
            let entry_path = entry.path();
            if entry_path.is_file() {
                if let Some(ext) = entry_path.extension() {
                    if ext.eq_ignore_ascii_case("mp3") {
                        let path_str = entry_path.to_string_lossy().to_string();
                        println!("Found track: {}", path_str);
                        let (title, artist, duration) = match Tag::read_from_path(entry_path) {
                            Ok(tag) => (
                                tag.title().unwrap_or(entry_path.file_name().unwrap().to_string_lossy().as_ref()).to_string(),
                                tag.artist().unwrap_or("Unknown Artist").to_string(),
                                tag.duration().unwrap_or(0),
                            ),
                            Err(_) => (
                                entry_path.file_name().unwrap().to_string_lossy().to_string(),
                                "Unknown Artist".to_string(),
                                0,
                            )
                        };

                        local_tracks.push(MusicTrack {
                            path: path_str,
                            title,
                            artist,
                            duration,
                        });
                    }
                }
            }
        }
        local_tracks
    }).await.map_err(|e| e.to_string())?;
    
    println!("Found {} tracks", tracks.len());
    Ok(tracks)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir().unwrap();
            std::fs::create_dir_all(&app_data_dir).unwrap();
            let db_path = app_data_dir.join("coscraft.db");
            
            let conn = Connection::open(db_path).expect("Failed to open database");
            
            conn.execute(
                "CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    currency INTEGER DEFAULT 0
                )",
                [],
            ).expect("Failed to create users table");

            app.manage(AppState { db: Mutex::new(conn) });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![register, login, scan_music])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
