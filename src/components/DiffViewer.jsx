import React, { useState } from 'react';
import { diffLines } from 'diff';
import { FiCheck, FiX } from 'react-icons/fi';
import DiffLine from './DiffLine';
import './DiffViewer.css';

const DiffViewer = ({ 
  oldCode, 
  newCode, 
  language = 'javascript',
  onAccept,
  onReject,
  showLineNumbers = true,
  viewMode: initialViewMode = 'split' // 'split' or 'unified'
}) => {
  const [selectedChanges, setSelectedChanges] = useState(new Set());
  const [viewMode, setViewMode] = useState(initialViewMode);
  
  // Calculate diff
  const diff = diffLines(oldCode, newCode);
  
  // Split view: side by side
  const renderSplitView = () => {
    let leftLineNum = 1;
    let rightLineNum = 1;
    
    return (
      <div className="diff-split-view">
        <div className="diff-pane diff-old">
          <div className="diff-header">Original</div>
          <div className="diff-lines">
            {diff.map((part, index) => {
              if (part.removed) {
                const lines = part.value.split('\n').filter(l => l !== '' || part.value.endsWith('\n'));
                if (lines.length > 0 && lines[lines.length - 1] === '') {
                  lines.pop();
                }
                return lines.map((line, i) => (
                  <DiffLine
                    key={`old-${index}-${i}`}
                    line={line}
                    lineNum={leftLineNum++}
                    type="removed"
                    language={language}
                    selectable={true}
                    selected={selectedChanges.has(`old-${index}-${i}`)}
                    onToggle={() => toggleChange(`old-${index}-${i}`)}
                  />
                ));
              } else if (!part.added) {
                const lines = part.value.split('\n').filter(l => l !== '' || part.value.endsWith('\n'));
                if (lines.length > 0 && lines[lines.length - 1] === '') {
                  lines.pop();
                }
                return lines.map((line, i) => (
                  <DiffLine
                    key={`unchanged-left-${index}-${i}`}
                    line={line}
                    lineNum={leftLineNum++}
                    type="unchanged"
                    language={language}
                    selectable={false}
                  />
                ));
              }
              return null;
            })}
          </div>
        </div>
        
        <div className="diff-pane diff-new">
          <div className="diff-header">Modified</div>
          <div className="diff-lines">
            {diff.map((part, index) => {
              if (part.added) {
                const lines = part.value.split('\n').filter(l => l !== '' || part.value.endsWith('\n'));
                if (lines.length > 0 && lines[lines.length - 1] === '') {
                  lines.pop();
                }
                return lines.map((line, i) => (
                  <DiffLine
                    key={`new-${index}-${i}`}
                    line={line}
                    lineNum={rightLineNum++}
                    type="added"
                    language={language}
                    selectable={true}
                    selected={selectedChanges.has(`new-${index}-${i}`)}
                    onToggle={() => toggleChange(`new-${index}-${i}`)}
                  />
                ));
              } else if (!part.removed) {
                const lines = part.value.split('\n').filter(l => l !== '' || part.value.endsWith('\n'));
                if (lines.length > 0 && lines[lines.length - 1] === '') {
                  lines.pop();
                }
                return lines.map((line, i) => (
                  <DiffLine
                    key={`unchanged-right-${index}-${i}`}
                    line={line}
                    lineNum={rightLineNum++}
                    type="unchanged"
                    language={language}
                    selectable={false}
                  />
                ));
              }
              return null;
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Unified view: inline
  const renderUnifiedView = () => {
    return (
      <div className="diff-unified-view">
        {diff.map((part, index) => {
          const lines = part.value.split('\n').filter(l => l !== '' || part.value.endsWith('\n'));
          if (lines.length > 0 && lines[lines.length - 1] === '') {
            lines.pop();
          }
          const type = part.added ? 'added' : part.removed ? 'removed' : 'unchanged';
          
          return lines.map((line, i) => (
            <DiffLine
              key={`${index}-${i}`}
              line={line}
              type={type}
              language={language}
              selectable={type !== 'unchanged'}
              selected={selectedChanges.has(`${index}-${i}`)}
              onToggle={() => toggleChange(`${index}-${i}`)}
            />
          ));
        })}
      </div>
    );
  };
  
  const toggleChange = (id) => {
    const newSelected = new Set(selectedChanges);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedChanges(newSelected);
  };
  
  const handleAcceptAll = () => {
    if (onAccept) onAccept(newCode);
  };
  
  const handleRejectAll = () => {
    if (onReject) onReject();
  };
  
  const handleAcceptSelected = () => {
    // Apply only selected changes
    // Complex logic - merge selected parts
    if (onAccept) onAccept(newCode); // Simplified for now
  };
  
  const stats = {
    added: diff.filter(p => p.added).reduce((acc, p) => {
      const lines = p.value.split('\n').filter(l => l !== '' || p.value.endsWith('\n'));
      if (lines.length > 0 && lines[lines.length - 1] === '') {
        return acc + lines.length - 1;
      }
      return acc + lines.length;
    }, 0),
    removed: diff.filter(p => p.removed).reduce((acc, p) => {
      const lines = p.value.split('\n').filter(l => l !== '' || p.value.endsWith('\n'));
      if (lines.length > 0 && lines[lines.length - 1] === '') {
        return acc + lines.length - 1;
      }
      return acc + lines.length;
    }, 0),
    modified: 0
  };
  
  return (
    <div className="diff-viewer glass-card">
      <div className="diff-toolbar">
        <div className="diff-title">
          <span>🔄 Code Changes Preview</span>
        </div>
        <div className="diff-stats">
          <span className="stat-added">+{stats.added}</span>
          <span className="stat-removed">-{stats.removed}</span>
        </div>
        <div className="diff-actions">
          <button 
            className={`diff-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            Split View
          </button>
          <button 
            className={`diff-btn ${viewMode === 'unified' ? 'active' : ''}`}
            onClick={() => setViewMode('unified')}
          >
            Unified
          </button>
        </div>
      </div>
      
      {viewMode === 'split' ? renderSplitView() : renderUnifiedView()}
      
      <div className="diff-footer">
        <button className="neon-button pink" onClick={handleRejectAll}>
          <FiX /> Reject All
        </button>
        {selectedChanges.size > 0 && (
          <button className="neon-button cyan" onClick={handleAcceptSelected}>
            Accept Selected ({selectedChanges.size})
          </button>
        )}
        <button className="neon-button" onClick={handleAcceptAll}>
          <FiCheck /> Accept All
        </button>
      </div>
    </div>
  );
};

export default DiffViewer;
