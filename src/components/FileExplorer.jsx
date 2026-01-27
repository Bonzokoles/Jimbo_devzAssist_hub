import React, { useState } from 'react';
import { FiFolder, FiFile, FiFolderPlus } from 'react-icons/fi';
import { open } from '@tauri-apps/api/dialog';
import './FileExplorer.css';

const FileExplorer = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [files, setFiles] = useState([]);

  const handleOpenFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected) {
        setSelectedFolder(selected);
        // In a real implementation, we would read the directory contents
        // For demo, just show some placeholder files
        setFiles([
          { name: 'src', type: 'folder' },
          { name: 'index.js', type: 'file' },
          { name: 'package.json', type: 'file' },
          { name: 'README.md', type: 'file' },
        ]);
      }
    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  };

  return (
    <div className="file-explorer">
      <h2>File Explorer</h2>

      {!selectedFolder ? (
        <div className="explorer-empty">
          <FiFolderPlus className="explorer-empty-icon" />
          <p>No folder opened</p>
          <button className="neon-button" onClick={handleOpenFolder}>
            Open Folder
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button className="neon-button cyan" onClick={handleOpenFolder}>
              Change Folder
            </button>
            <p style={{ marginTop: '10px', color: 'rgba(255,255,255,0.6)' }}>
              Current: {selectedFolder}
            </p>
          </div>

          <div className="file-tree">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                {file.type === 'folder' ? (
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
