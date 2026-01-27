import React, { useState, useEffect } from 'react';
import { FiFolder, FiFolderPlus, FiRefreshCw } from 'react-icons/fi';
import { open } from '@tauri-apps/api/dialog';
import { 
  readDirRecursive, 
  readFileContent,
  createFile,
  createFolder,
  deletePath,
  renamePath
} from '../utils/tauriCommands';
import useStore from '../store/useStore';
import FileTreeNode from './FileTreeNode';
import ContextMenu from './ContextMenu';
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
  
  const [tree, setTree] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedPath, setSelectedPath] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isTauri = window.__TAURI_IPC__ !== undefined;

  useEffect(() => {
    if (workspaceRoot && isTauri) {
      loadFolderTree();
    }
  }, [workspaceRoot, refreshKey]);

  const loadFolderTree = async () => {
    try {
      const treeData = await readDirRecursive(workspaceRoot);
      setTree(treeData);
      // Auto-expand root folder
      setExpandedFolders(new Set([workspaceRoot]));
    } catch (error) {
      console.error('Failed to load folder tree:', error);
    }
  };

  const handleOpenFolder = async () => {
    try {
      if (isTauri) {
        const selected = await open({ directory: true, multiple: false });
        if (selected) {
          setWorkspaceRoot(selected);
        }
      } else if ('showDirectoryPicker' in window) {
        const handle = await window.showDirectoryPicker();
        setWorkspaceRoot(handle.name);
        setProjectHandle(handle);
      }
    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleNodeSelect = async (node) => {
    setSelectedPath(node.path);
    
    if (!node.is_dir) {
      // It's a file
      try {
        const content = await readFileContent(node.path);
        setCurrentFile(node.path);
        setCurrentFileHandle(null);
        setCurrentFileContent(content);
        setCurrentView('editor'); 
      } catch (error) {
        alert('Failed to read file: ' + error);
      }
    }
  };

  const handleContextMenu = (e, node) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item: node
    });
  };

  const handleContextAction = async (action, item) => {
    try {
      switch (action) {
        case 'new-file': {
          const fileName = prompt('Enter file name:');
          if (fileName) {
            const newPath = `${item.path}/${fileName}`;
            await createFile(newPath, '');
            loadFolderTree();
          }
          break;
        }
        case 'new-folder': {
          const folderName = prompt('Enter folder name:');
          if (folderName) {
            const newPath = `${item.path}/${folderName}`;
            await createFolder(newPath);
            loadFolderTree();
          }
          break;
        }
        case 'rename': {
          const newName = prompt('Enter new name:', item.name);
          if (newName && newName !== item.name) {
            const parentPath = item.path.substring(0, item.path.lastIndexOf('/'));
            const newPath = `${parentPath}/${newName}`;
            await renamePath(item.path, newPath);
            loadFolderTree();
          }
          break;
        }
        case 'delete': {
          const confirmMsg = item.is_dir 
            ? `Delete folder "${item.name}" and all its contents?`
            : `Delete file "${item.name}"?`;
          if (confirm(confirmMsg)) {
            await deletePath(item.path);
            loadFolderTree();
          }
          break;
        }
        case 'copy-path': {
          navigator.clipboard.writeText(item.path);
          break;
        }
      }
    } catch (error) {
      alert(`Failed to ${action}: ${error}`);
    }
  };

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
            <div className="path-display dim-text scrollbar-hidden">
              {workspaceRoot}
            </div>
            <button 
              className="toolbar-btn" 
              onClick={loadFolderTree} 
              title="Refresh"
            >
              <FiRefreshCw />
            </button>
            <button 
              className="toolbar-btn cyan-text" 
              onClick={handleOpenFolder} 
              title="Open another folder"
            >
              <FiFolder />
            </button>
          </div>

          <div className="file-tree scrollbar-hidden">
            {tree && (
              <FileTreeNode
                node={tree}
                level={0}
                expanded={expandedFolders.has(tree.path)}
                onToggle={toggleFolder}
                onSelect={handleNodeSelect}
                onContextMenu={handleContextMenu}
                selectedPath={selectedPath}
              />
            )}
          </div>
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}
    </div>
  );
};

export default FileExplorer;
