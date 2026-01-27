// Prompt management commands for Tauri
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::api::path;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PromptPreset {
    pub name: String,
    pub prompt: String,
}

// Get the prompts directory path
fn get_prompts_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_dir = path::app_data_dir(&app_handle.config())
        .ok_or("Failed to get app data directory")?;
    
    let prompts_dir = app_dir.join("prompts");
    fs::create_dir_all(&prompts_dir)
        .map_err(|e| format!("Failed to create prompts directory: {}", e))?;
    
    Ok(prompts_dir)
}

// Get the workspace prompts directory path
fn get_workspace_prompts_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_dir = path::app_data_dir(&app_handle.config())
        .ok_or("Failed to get app data directory")?;
    
    let workspace_dir = app_dir.join("workspaces");
    fs::create_dir_all(&workspace_dir)
        .map_err(|e| format!("Failed to create workspaces directory: {}", e))?;
    
    Ok(workspace_dir)
}

// Get the MOA scenarios directory path
fn get_scenarios_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_dir = path::app_data_dir(&app_handle.config())
        .ok_or("Failed to get app data directory")?;
    
    let scenarios_dir = app_dir.join("moa_scenarios");
    fs::create_dir_all(&scenarios_dir)
        .map_err(|e| format!("Failed to create scenarios directory: {}", e))?;
    
    Ok(scenarios_dir)
}

// Hash a project path to create a unique identifier
fn hash_project_path(path: &str) -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};
    
    let mut hasher = DefaultHasher::new();
    path.hash(&mut hasher);
    format!("{:x}", hasher.finish())
}

#[tauri::command]
pub async fn save_system_prompt(app_handle: tauri::AppHandle, prompt: String) -> Result<(), String> {
    let prompts_dir = get_prompts_dir(&app_handle)?;
    let prompt_file = prompts_dir.join("system_prompt.txt");
    
    fs::write(prompt_file, prompt)
        .map_err(|e| format!("Failed to save system prompt: {}", e))?;
    
    Ok(())
}

#[tauri::command]
pub async fn load_system_prompt(app_handle: tauri::AppHandle) -> Result<String, String> {
    let prompts_dir = get_prompts_dir(&app_handle)?;
    let prompt_file = prompts_dir.join("system_prompt.txt");
    
    if !prompt_file.exists() {
        return Ok(String::new());
    }
    
    fs::read_to_string(prompt_file)
        .map_err(|e| format!("Failed to load system prompt: {}", e))
}

#[tauri::command]
pub async fn save_workspace_prompt(
    app_handle: tauri::AppHandle,
    project_path: String,
    prompt: String
) -> Result<(), String> {
    let workspace_dir = get_workspace_prompts_dir(&app_handle)?;
    let project_hash = hash_project_path(&project_path);
    let project_dir = workspace_dir.join(&project_hash);
    
    fs::create_dir_all(&project_dir)
        .map_err(|e| format!("Failed to create project directory: {}", e))?;
    
    let prompt_file = project_dir.join("prompt.txt");
    fs::write(&prompt_file, &prompt)
        .map_err(|e| format!("Failed to save workspace prompt: {}", e))?;
    
    // Also save the original path for reference
    let path_file = project_dir.join("path.txt");
    fs::write(path_file, project_path)
        .map_err(|e| format!("Failed to save project path: {}", e))?;
    
    Ok(())
}

#[tauri::command]
pub async fn load_workspace_prompt(
    app_handle: tauri::AppHandle,
    project_path: String
) -> Result<String, String> {
    let workspace_dir = get_workspace_prompts_dir(&app_handle)?;
    let project_hash = hash_project_path(&project_path);
    let prompt_file = workspace_dir.join(&project_hash).join("prompt.txt");
    
    if !prompt_file.exists() {
        return Ok(String::new());
    }
    
    fs::read_to_string(prompt_file)
        .map_err(|e| format!("Failed to load workspace prompt: {}", e))
}

#[tauri::command]
pub async fn save_prompt_preset(
    app_handle: tauri::AppHandle,
    name: String,
    prompt: String
) -> Result<(), String> {
    let prompts_dir = get_prompts_dir(&app_handle)?;
    let presets_file = prompts_dir.join("presets.json");
    
    // Load existing presets
    let mut presets: Vec<PromptPreset> = if presets_file.exists() {
        let content = fs::read_to_string(&presets_file)
            .map_err(|e| format!("Failed to read presets: {}", e))?;
        serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse presets: {}", e))?
    } else {
        Vec::new()
    };
    
    // Remove existing preset with same name
    presets.retain(|p| p.name != name);
    
    // Add new preset
    presets.push(PromptPreset {
        name,
        prompt,
    });
    
    // Save back
    let json = serde_json::to_string_pretty(&presets)
        .map_err(|e| format!("Failed to serialize presets: {}", e))?;
    
    fs::write(presets_file, json)
        .map_err(|e| format!("Failed to save presets: {}", e))?;
    
    Ok(())
}

#[tauri::command]
pub async fn load_prompt_presets(app_handle: tauri::AppHandle) -> Result<Vec<PromptPreset>, String> {
    let prompts_dir = get_prompts_dir(&app_handle)?;
    let presets_file = prompts_dir.join("presets.json");
    
    if !presets_file.exists() {
        return Ok(Vec::new());
    }
    
    let content = fs::read_to_string(presets_file)
        .map_err(|e| format!("Failed to read presets: {}", e))?;
    
    serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse presets: {}", e))
}

#[tauri::command]
pub async fn delete_prompt_preset(
    app_handle: tauri::AppHandle,
    name: String
) -> Result<(), String> {
    let prompts_dir = get_prompts_dir(&app_handle)?;
    let presets_file = prompts_dir.join("presets.json");
    
    if !presets_file.exists() {
        return Ok(());
    }
    
    let content = fs::read_to_string(&presets_file)
        .map_err(|e| format!("Failed to read presets: {}", e))?;
    
    let mut presets: Vec<PromptPreset> = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse presets: {}", e))?;
    
    presets.retain(|p| p.name != name);
    
    let json = serde_json::to_string_pretty(&presets)
        .map_err(|e| format!("Failed to serialize presets: {}", e))?;
    
    fs::write(presets_file, json)
        .map_err(|e| format!("Failed to save presets: {}", e))?;
    
    Ok(())
}

#[tauri::command]
pub async fn save_moa_scenario(
    app_handle: tauri::AppHandle,
    scenario: String
) -> Result<(), String> {
    let scenarios_dir = get_scenarios_dir(&app_handle)?;
    
    // Parse scenario to get name
    let scenario_value: serde_json::Value = serde_json::from_str(&scenario)
        .map_err(|e| format!("Invalid scenario JSON: {}", e))?;
    
    let name = scenario_value["name"]
        .as_str()
        .ok_or("Scenario name not found")?;
    
    let filename = format!("{}.json", name.replace(" ", "_").to_lowercase());
    let scenario_file = scenarios_dir.join(filename);
    
    fs::write(scenario_file, scenario)
        .map_err(|e| format!("Failed to save scenario: {}", e))?;
    
    Ok(())
}

#[tauri::command]
pub async fn load_moa_scenarios(app_handle: tauri::AppHandle) -> Result<Vec<String>, String> {
    let scenarios_dir = get_scenarios_dir(&app_handle)?;
    
    let entries = fs::read_dir(scenarios_dir)
        .map_err(|e| format!("Failed to read scenarios directory: {}", e))?;
    
    let mut scenarios = Vec::new();
    
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let path = entry.path();
        
        if path.extension().and_then(|s| s.to_str()) == Some("json") {
            let content = fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read scenario file: {}", e))?;
            scenarios.push(content);
        }
    }
    
    Ok(scenarios)
}

#[tauri::command]
pub async fn delete_moa_scenario(
    app_handle: tauri::AppHandle,
    name: String
) -> Result<(), String> {
    let scenarios_dir = get_scenarios_dir(&app_handle)?;
    let filename = format!("{}.json", name.replace(" ", "_").to_lowercase());
    let scenario_file = scenarios_dir.join(filename);
    
    if scenario_file.exists() {
        fs::remove_file(scenario_file)
            .map_err(|e| format!("Failed to delete scenario: {}", e))?;
    }
    
    Ok(())
}
