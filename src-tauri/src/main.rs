// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod prompts;

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use sysinfo::{System, SystemExt, CpuExt, DiskExt};
use tauri::api::path;

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
    
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create parent directory: {}", e))?;
    }
    
    fs::write(path, content).map_err(|e| format!("Failed to write file: {}", e))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_system_stats,
            clean_cache,
            optimize_memory,
            call_openai_api,
            call_claude_api,
            save_api_key,
            get_api_key,
            read_file_content,
            write_file_content,
            prompts::save_system_prompt,
            prompts::load_system_prompt,
            prompts::save_workspace_prompt,
            prompts::load_workspace_prompt,
            prompts::save_prompt_preset,
            prompts::load_prompt_presets,
            prompts::delete_prompt_preset,
            prompts::save_moa_scenario,
            prompts::load_moa_scenarios,
            prompts::delete_moa_scenario,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
