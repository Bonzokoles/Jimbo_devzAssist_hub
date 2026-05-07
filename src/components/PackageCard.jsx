import React from 'react';
import { FiDownload, FiInfo, FiTag, FiUser } from 'react-icons/fi';
import './PackageCard.css';

const PackageCard = ({ 
  pkg, 
  onInstall, 
  onViewDetails, 
  isInstalling = false,
  aiExplanation = null 
}) => {
  const formatDownloads = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  return (
    <div className="package-card glass-card">
      <div className="package-header">
        <h3 className="package-name neon-text cyan">{pkg.name}</h3>
        <div className="package-version-badge">{pkg.version}</div>
      </div>

      <p className="package-description">{pkg.description || 'No description available'}</p>

      <div className="package-meta">
        {pkg.author && (
          <div className="package-meta-item">
            <FiUser size={14} />
            <span>{pkg.author}</span>
          </div>
        )}
        
        {pkg.downloads > 0 && (
          <div className="package-meta-item">
            <FiDownload size={14} />
            <span>{formatDownloads(pkg.downloads)}</span>
          </div>
        )}

        {pkg.license && (
          <div className="package-license-badge">{pkg.license}</div>
        )}
      </div>

      {pkg.keywords && pkg.keywords.length > 0 && (
        <div className="package-keywords">
          {pkg.keywords.slice(0, 5).map((keyword, index) => (
            <span key={index} className="package-keyword">
              <FiTag size={10} />
              {keyword}
            </span>
          ))}
        </div>
      )}

      {aiExplanation && (
        <div className="package-ai-explanation">
          <div className="ai-label">🤖 AI Insight</div>
          <p>{aiExplanation}</p>
        </div>
      )}

      <div className="package-actions">
        <button
          className="package-install-btn neon-button cyan"
          onClick={() => onInstall(pkg)}
          disabled={isInstalling}
        >
          {isInstalling ? 'Installing...' : 'Install'}
        </button>
        
        <button
          className="package-details-btn"
          onClick={() => onViewDetails(pkg)}
        >
          <FiInfo size={16} />
          Details
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
