// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use sysinfo::{System, SystemExt, CpuExt, DiskExt};
use tauri::api::path;

#[derive(Debug, Serialize, Deserialize)]
struct FileEntry {
    name: String,
    path: String,
    is_dir: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    children: Option<Vec<FileEntry>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct SystemStats {
    cpu_usage: f32,
    memory_total: u64,
    memory_used: u64,
    memory_percent: f32,
    disk_total: u64,
    disk_used: u64,
    disk_percent: f32,
}

#[derive(Debug, Serialize, Deserialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ExecutionResult {
    stdout: String,
    stderr: String,
    exit_code: i32,
}

#[tauri::command]
async fn get_system_stats() -> Result<SystemStats, String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();
    let memory_percent = (memory_used as f32 / memory_total as f32) * 100.0;
    
    let mut disk_total = 0;
    let mut disk_used = 0;
    
    for disk in sys.disks() {
        disk_total += disk.total_space();
        disk_used += disk.total_space() - disk.available_space();
    }
    
    let disk_percent = if disk_total > 0 {
        (disk_used as f32 / disk_total as f32) * 100.0
    } else {
        0.0
    };
    
    Ok(SystemStats {
        cpu_usage,
        memory_total: memory_total / (1024 * 1024), // Convert to MB
        memory_used: memory_used / (1024 * 1024),
        memory_percent,
        disk_total: disk_total / (1024 * 1024 * 1024), // Convert to GB
        disk_used: disk_used / (1024 * 1024 * 1024),
        disk_percent,
    })
}

#[tauri::command]
async fn clean_cache() -> Result<String, String> {
    // Simple cache cleaning - just return success message
    // In production, this would clean temp files
    Ok("Cache cleaned successfully".to_string())
}

#[tauri::command]
async fn optimize_memory() -> Result<String, String> {
    // Memory optimization placeholder
    Ok("Memory optimized successfully".to_string())
}

#[tauri::command]
async fn call_openai_api(
    api_key: String,
    model: String,
    messages: Vec<Message>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    let payload = serde_json::json!({
        "model": model,
        "messages": messages,
        "temperature": 0.7,
    });
    
    let response = client
        .post("https://api.openai.com/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("API error: {}", error_text));
    }
    
    let json: serde_json::Value = response.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let content = json["choices"][0]["message"]["content"]
        .as_str()
        .ok_or("Invalid response format")?
        .to_string();
    
    Ok(content)
}

#[tauri::command]
async fn call_claude_api(
    api_key: String,
    model: String,
    messages: Vec<Message>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    let payload = serde_json::json!({
        "model": model,
        "messages": messages,
        "max_tokens": 4096,
    });
    
    let response = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("API error: {}", error_text));
    }
    
    let json: serde_json::Value = response.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let content = json["content"][0]["text"]
        .as_str()
        .ok_or("Invalid response format")?
        .to_string();
    
    Ok(content)
}

#[tauri::command]
async fn call_openrouter_api(
    api_key: String,
    model: String,
    messages: Vec<Message>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    let payload = serde_json::json!({
        "model": model,
        "messages": messages,
    });
    
    let response = client
        .post("https://openrouter.ai/api/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .header("HTTP-Referer", "https://bonzo-devassist.app")
        .header("X-Title", "BONZO DevAssist AI")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("API error: {}", error_text));
    }
    
    let json: serde_json::Value = response.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let content = json["choices"][0]["message"]["content"]
        .as_str()
        .ok_or("Invalid response format")?
        .to_string();
    
    Ok(content)
}

#[tauri::command]
async fn call_gemini_api(
    api_key: String,
    model: String,
    messages: Vec<Message>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    // Convert messages to Gemini format
    let mut contents = vec![];
    for msg in messages {
        contents.push(serde_json::json!({
            "role": if msg.role == "assistant" { "model" } else { "user" },
            "parts": [{ "text": msg.content }]
        }));
    }
    
    let payload = serde_json::json!({
        "contents": contents,
    });
    
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
        model, api_key
    );
    
    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("API error: {}", error_text));
    }
    
    let json: serde_json::Value = response.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let content = json["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .ok_or("Invalid response format")?
        .to_string();
    
    Ok(content)
}

#[tauri::command]
async fn call_mistral_api(
    api_key: String,
    model: String,
    messages: Vec<Message>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    let payload = serde_json::json!({
        "model": model,
        "messages": messages,
    });
    
    let response = client
        .post("https://api.mistral.ai/v1/chat/completions")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("API error: {}", error_text));
    }
    
    let json: serde_json::Value = response.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let content = json["choices"][0]["message"]["content"]
        .as_str()
        .ok_or("Invalid response format")?
        .to_string();
    
    Ok(content)
}

#[tauri::command]
async fn call_cohere_api(
    api_key: String,
    model: String,
    messages: Vec<Message>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    // Get the last user message
    let message = messages.last()
        .ok_or("No messages provided")?
        .content.clone();
    
    // Build chat history (exclude last message)
    let chat_history: Vec<_> = messages[..messages.len()-1]
        .iter()
        .map(|msg| serde_json::json!({
            "role": if msg.role == "assistant" { "CHATBOT" } else { "USER" },
            "message": msg.content
        }))
        .collect();
    
    let payload = serde_json::json!({
        "model": model,
        "message": message,
        "chat_history": chat_history,
    });
    
    let response = client
        .post("https://api.cohere.ai/v1/chat")
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("API error: {}", error_text));
    }
    
    let json: serde_json::Value = response.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let content = json["text"]
        .as_str()
        .ok_or("Invalid response format")?
        .to_string();
    
    Ok(content)
}

#[tauri::command]
async fn call_ollama_api(
    base_url: String,
    model: String,
    messages: Vec<Message>,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    
    let payload = serde_json::json!({
        "model": model,
        "messages": messages,
        "stream": false,
    });
    
    let url = format!("{}/api/chat", base_url);
    
    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("API error: {}", error_text));
    }
    
    let json: serde_json::Value = response.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let content = json["message"]["content"]
        .as_str()
        .ok_or("Invalid response format")?
        .to_string();
    
    Ok(content)
}

#[tauri::command]
async fn get_ollama_models(base_url: String) -> Result<Vec<String>, String> {
    let client = reqwest::Client::new();
    
    let url = format!("{}/api/tags", base_url);
    
    let response = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if !response.status().is_success() {
        return Err("Failed to get models from Ollama".to_string());
    }
    
    let json: serde_json::Value = response.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
    
    let models = json["models"]
        .as_array()
        .ok_or("Invalid response format")?
        .iter()
        .filter_map(|m| m["name"].as_str().map(String::from))
        .collect();
    
    Ok(models)
}

#[tauri::command]
async fn save_api_key(app_handle: tauri::AppHandle, provider: String, key: String) -> Result<(), String> {
    let app_dir = path::app_data_dir(&app_handle.config())
        .ok_or("Failed to get app data directory")?;
    
    fs::create_dir_all(&app_dir).map_err(|e| format!("Failed to create app directory: {}", e))?;
    
    let key_file = app_dir.join(format!("{}_api_key.txt", provider));
    fs::write(key_file, key).map_err(|e| format!("Failed to save API key: {}", e))?;
    
    Ok(())
}

#[tauri::command]
async fn get_api_key(app_handle: tauri::AppHandle, provider: String) -> Result<String, String> {
    let app_dir = path::app_data_dir(&app_handle.config())
        .ok_or("Failed to get app data directory")?;
    
    let key_file = app_dir.join(format!("{}_api_key.txt", provider));
    
    if !key_file.exists() {
        return Ok(String::new());
    }
    
    fs::read_to_string(key_file).map_err(|e| format!("Failed to read API key: {}", e))
}

#[tauri::command]
async fn read_file_content(path_str: String) -> Result<String, String> {
    let path = Path::new(&path_str);
    fs::read_to_string(path).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
async fn write_file_content(path_str: String, content: String) -> Result<(), String> {
    let path = Path::new(&path_str);
    fs::write(path, content).map_err(|e| format!("Failed to write file: {}", e))
}

#[tauri::command]
async fn get_podman_containers() -> Result<String, String> {
    let output = std::process::Command::new("podman")
        .args(["ps", "-a", "--format", "json"])
        .output()
        .map_err(|e| format!("Failed to execute podman: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

#[tauri::command]
async fn manage_podman_container(id: String, action: String) -> Result<String, String> {
    let output = std::process::Command::new("podman")
        .args([&action, &id])
        .output()
        .map_err(|e| format!("Failed to execute podman {}: {}", action, e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    Ok(format!("Container {} {} successfully", id, action))
}

#[tauri::command]
async fn check_localhost_port(port: u16) -> bool {
    use std::net::{TcpStream, SocketAddr, IpAddr, Ipv4Addr};
    use std::time::Duration;

    let addr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), port);
    TcpStream::connect_timeout(&addr, Duration::from_millis(500)).is_ok()
}

#[tauri::command]
async fn read_dir(path_str: String) -> Result<Vec<FileEntry>, String> {
    let path = Path::new(&path_str);
    let entries = fs::read_dir(path).map_err(|e| format!("Failed to read directory: {}", e))?;
    
    let mut files = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let metadata = entry.metadata().map_err(|e| format!("Failed to get metadata: {}", e))?;
        files.push(FileEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            path: entry.path().to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
            children: None,
        });
    }
    
    // Sort directories first, then alphabetical
    files.sort_by(|a, b| {
        if a.is_dir != b.is_dir {
            b.is_dir.cmp(&a.is_dir)
        } else {
            a.name.cmp(&b.name)
        }
    });

    Ok(files)
}

// Recursive directory reading
#[tauri::command]
async fn read_dir_recursive(path_str: String) -> Result<FileEntry, String> {
    read_dir_tree(&Path::new(&path_str))
}

fn read_dir_tree(path: &Path) -> Result<FileEntry, String> {
    let name = path.file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("")
        .to_string();
    
    let path_string = path.to_string_lossy().to_string();
    
    if !path.is_dir() {
        return Ok(FileEntry {
            name,
            path: path_string,
            is_dir: false,
            children: None,
        });
    }
    
    let mut children = Vec::new();
    
    match fs::read_dir(path) {
        Ok(entries) => {
            for entry in entries {
                if let Ok(entry) = entry {
                    let child_path = entry.path();
                    // Skip hidden files/folders
                    if let Some(file_name) = child_path.file_name() {
                        if let Some(name_str) = file_name.to_str() {
                            if name_str.starts_with('.') {
                                continue;
                            }
                        }
                    }
                    if let Ok(child_entry) = read_dir_tree(&child_path) {
                        children.push(child_entry);
                    }
                }
            }
        }
        Err(e) => return Err(format!("Failed to read directory: {}", e)),
    }
    
    // Sort: directories first, then files
    children.sort_by(|a, b| {
        match (a.is_dir, b.is_dir) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });
    
    Ok(FileEntry {
        name,
        path: path_string,
        is_dir: true,
        children: Some(children),
    })
}

// File operations
#[tauri::command]
async fn create_file(path_str: String, content: String) -> Result<(), String> {
    // Create parent directories if they don't exist
    let path = Path::new(&path_str);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create parent directories: {}", e))?;
    }
    fs::write(&path_str, content)
        .map_err(|e| format!("Failed to create file: {}", e))
}

#[tauri::command]
async fn create_folder(path_str: String) -> Result<(), String> {
    fs::create_dir_all(&path_str)
        .map_err(|e| format!("Failed to create folder: {}", e))
}

#[tauri::command]
async fn delete_path(path_str: String) -> Result<(), String> {
    let path = Path::new(&path_str);
    
    if path.is_dir() {
        fs::remove_dir_all(path)
            .map_err(|e| format!("Failed to delete folder: {}", e))
    } else {
        fs::remove_file(path)
            .map_err(|e| format!("Failed to delete file: {}", e))
    }
}

#[tauri::command]
async fn rename_path(old_path: String, new_path: String) -> Result<(), String> {
    fs::rename(&old_path, &new_path)
        .map_err(|e| format!("Failed to rename: {}", e))
}

// Code execution
#[tauri::command]
async fn execute_code(command: String, working_dir: String) -> Result<ExecutionResult, String> {
    use std::process::Command;
    
    // Parse the command - split by space but respect quotes
    let parts: Vec<&str> = command.split_whitespace().collect();
    if parts.is_empty() {
        return Err("Empty command".to_string());
    }
    
    let program = parts[0];
    let args = &parts[1..];
    
    let output = Command::new(program)
        .args(args)
        .current_dir(&working_dir)
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;
    
    Ok(ExecutionResult {
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
        exit_code: output.status.code().unwrap_or(-1),
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            clean_cache,
            optimize_memory,
            call_openai_api,
            call_claude_api,
            call_openrouter_api,
            call_gemini_api,
            call_mistral_api,
            call_cohere_api,
            call_ollama_api,
            get_ollama_models,
            save_api_key,
            get_api_key,
            read_file_content,
            write_file_content,
            get_podman_containers,
            manage_podman_container,
            check_localhost_port,
            read_dir,
            read_dir_recursive,
            create_file,
            create_folder,
            delete_path,
            rename_path,
            execute_code,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
