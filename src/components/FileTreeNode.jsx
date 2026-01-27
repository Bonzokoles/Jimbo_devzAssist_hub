import React from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { getFileIcon, getFolderIcon } from '../utils/fileIcons';
import './FileTreeNode.css';

const FileTreeNode = ({ 
  node, 
  level, 
  expanded, 
  onToggle, 
  onSelect, 
  onContextMenu,
  selectedPath 
}) => {
  const Icon = node.is_dir ? getFolderIcon(expanded) : getFileIcon(node);
  const hasChildren = node.is_dir && node.children && node.children.length > 0;
  const isSelected = selectedPath === node.path;

  const handleClick = (e) => {
    e.stopPropagation();
    if (node.is_dir) {
      onToggle(node.path);
    }
    onSelect(node);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, node);
  };

  return (
    <>
      <div
        className={`tree-node ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="tree-node-content">
          {node.is_dir && (
            <span className="tree-chevron">
              {expanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
            </span>
          )}
          {!node.is_dir && <span className="tree-chevron-placeholder" />}
          <Icon className={`tree-icon ${node.is_dir ? 'folder-icon' : 'file-icon'}`} />
          <span className="tree-label">{node.name}</span>
        </div>
      </div>
      
      {node.is_dir && expanded && hasChildren && (
        <div className="tree-children">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              expanded={expanded && child.is_dir}
              onToggle={onToggle}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default FileTreeNode;
