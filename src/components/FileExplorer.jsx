import React, { useState, useEffect } from 'react';
import { FiFolder, FiFile, FiFolderPlus, FiArrowLeft } from 'react-icons/fi';
import { open } from '@tauri-apps/api/dialog';
import { readDir, readFileContent } from '../utils/tauriCommands';
import useStore from '../store/useStore';
import './FileExplorer.css';

const FileExplorer = () => {
  const { 
    setCurrentFile, 
    setCurrentFileHandle,
    setCurrentFileContent, 
    setCurrentView,
    workspaceRoot,
    projectHandle,
    setWorkspaceRoot,
    setProjectHandle
  } = useStore();
  const [history, setHistory] = useState([]);
  const [files, setFiles] = useState([]);

  const isTauri = window.__TAURI_IPC__ !== undefined;

  useEffect(() => {
    if (workspaceRoot) {
      const initialTarget = isTauri ? workspaceRoot : projectHandle;
      if (initialTarget) {
        setHistory([initialTarget]);
        loadFolder(initialTarget);
      }
    }
  }, [workspaceRoot, projectHandle]);

  const loadFolder = async (target) => {
    try {
      if (typeof target === 'string') {
        // Desktop Mode (Tauri)
        const data = await readDir(target);
        setFiles(data);
      } else if (target && target.values) {
        // Web Mode (DirectoryHandle)
        const entries = [];
        for await (const entry of target.values()) {
          entries.push({
            name: entry.name,
            path: entry, // Use handle as path for the next step
            is_dir: entry.kind === 'directory'
          });
        }
        // Sort: folders first, then files
        entries.sort((a, b) => b.is_dir - a.is_dir || a.name.localeCompare(b.name));
        setFiles(entries);
      }
    } catch (error) {
      console.error('Failed to load folder:', error);
    }
  };

  const handleOpenFolder = async () => {
    try {
      if (isTauri) {
        const selected = await open({ directory: true, multiple: false });
        if (selected) setWorkspaceRoot(selected);
      } else if ('showDirectoryPicker' in window) {
        const handle = await window.showDirectoryPicker();
        setWorkspaceRoot(handle.name);
        setProjectHandle(handle);
      }
    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  };

  const handleItemClick = async (item) => {
    if (item.is_dir) {
      setHistory([...history, item.path]);
      loadFolder(item.path);
    } else {
      // It's a file
      try {
        let content;
        if (typeof item.path === 'string') {
          content = await readFileContent(item.path);
          setCurrentFile(item.path);
          setCurrentFileHandle(null);
        } else {
          // Web Mode: FileHandle
          const file = await item.path.getFile();
          content = await file.text();
          setCurrentFile(item.name);
          setCurrentFileHandle(item.path);
        }
        setCurrentFileContent(content);
        setCurrentView('editor'); 
      } catch (error) {
        alert('Failed to read file: ' + error);
      }
    }
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousFolder = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      loadFolder(previousFolder);
    }
  };

  const getDisplayName = (target) => {
    if (!target) return '';
    if (typeof target === 'string') return target;
    return target.name || 'Root';
  };

  const currentFolder = history[history.length - 1];

  return (
    <div className="file-explorer">
      <h2>File Explorer</h2>

      {!workspaceRoot ? (
        <div className="explorer-empty">
          <FiFolderPlus className="explorer-empty-icon" />
          <p>No workspace opened</p>
          <button className="neon-button" onClick={handleOpenFolder}>
            Select Root Directory
          </button>
        </div>
      ) : (
        <div>
          <div className="explorer-toolbar">
            <button className="back-btn" onClick={handleGoBack} disabled={history.length <= 1}>
              <FiArrowLeft />
            </button>
            <div className="path-display dim-text scrollbar-hidden">
              {getDisplayName(currentFolder)}
            </div>
            <button className="neon-button cyan-text" onClick={handleOpenFolder} title="Open another folder">
              <FiFolder />
            </button>
          </div>

          <div className="file-tree">
            {files.map((file, index) => (
              <div key={index} className="file-item" onClick={() => handleItemClick(file)}>
                {file.is_dir ? (
                  <FiFolder className="file-icon folder-icon" />
                ) : (
                  <FiFile className="file-icon" />
                )}
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
