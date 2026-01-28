import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DiffLine = ({ 
  line, 
  lineNum, 
  type, 
  language, 
  selectable,
  selected,
  onToggle 
}) => {
  return (
    <div className={`diff-line diff-${type} ${selected ? 'selected' : ''}`}>
      {lineNum && (
        <span className="line-number">{lineNum}</span>
      )}
      {selectable && (
        <input 
          type="checkbox" 
          checked={selected}
          onChange={onToggle}
          className="diff-checkbox"
        />
      )}
      <span className="line-marker">
        {type === 'added' ? '+' : type === 'removed' ? '-' : ' '}
      </span>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '0 8px',
          background: 'transparent',
          display: 'inline'
        }}
        PreTag="span"
      >
        {line}
      </SyntaxHighlighter>
    </div>
  );
};

export default DiffLine;
