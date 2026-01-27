import React, { useEffect, useRef } from 'react';
import { FiFile, FiFolder, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import './ContextMenu.css';

const ContextMenu = ({ x, y, item, onClose, onAction }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const actions = item.is_dir 
    ? [
        { id: 'new-file', label: 'New File', icon: FiFile },
        { id: 'new-folder', label: 'New Folder', icon: FiFolder },
        { id: 'rename', label: 'Rename', icon: FiEdit2 },
        { id: 'delete', label: 'Delete', icon: FiTrash2 },
      ]
    : [
        { id: 'rename', label: 'Rename', icon: FiEdit2 },
        { id: 'delete', label: 'Delete', icon: FiTrash2 },
        { id: 'copy-path', label: 'Copy Path', icon: FiCopy },
      ];

  const handleAction = (actionId) => {
    onAction(actionId, item);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="context-menu glass-card"
      style={{ left: x, top: y }}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <div
            key={action.id}
            className="context-menu-item"
            onClick={() => handleAction(action.id)}
          >
            <Icon className="context-menu-icon" />
            <span>{action.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;
