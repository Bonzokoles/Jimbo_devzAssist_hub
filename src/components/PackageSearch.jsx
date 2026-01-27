import React, { useState } from 'react';
import { FiSearch, FiPackage, FiLoader } from 'react-icons/fi';
import PackageCard from './PackageCard';
import { searchPackages } from '../utils/package/packageManager';
import { installPackage } from '../utils/package/installer';
import './PackageSearch.css';

const PackageSearch = ({ onAskAI }) => {
  const [query, setQuery] = useState('');
  const [packageManager, setPackageManager] = useState('npm');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [installingPackages, setInstallingPackages] = useState(new Set());
  const [searchPerformed, setSearchPerformed] = useState(false);

  const packageManagers = [
    { value: 'npm', label: 'NPM' },
    { value: 'yarn', label: 'Yarn' },
    { value: 'pnpm', label: 'pnpm' },
    { value: 'bun', label: 'Bun' },
    { value: 'pip', label: 'pip' },
    { value: 'pipenv', label: 'pipenv' },
    { value: 'poetry', label: 'Poetry' },
    { value: 'cargo', label: 'Cargo' },
    { value: 'bundler', label: 'Bundler' },
    { value: 'composer', label: 'Composer' },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchPerformed(true);
    try {
      const packages = await searchPackages(packageManager, query);
      setResults(packages);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInstall = async (pkg) => {
    setInstallingPackages(prev => new Set([...prev, pkg.name]));
    
    try {
      const result = await installPackage(packageManager, pkg.name);
      if (result.success) {
        console.log(`Successfully installed ${pkg.name}`);
        // Could show a success toast here
      } else {
        console.error(`Failed to install ${pkg.name}:`, result.error);
        // Could show an error toast here
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setInstallingPackages(prev => {
        const newSet = new Set(prev);
        newSet.delete(pkg.name);
        return newSet;
      });
    }
  };

  const handleViewDetails = (pkg) => {
    // Open package details in a modal or new view
    console.log('View details for:', pkg);
    // This could open a modal with more detailed package info
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="package-search">
      <div className="package-search-header">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search packages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <select
          className="package-manager-select"
          value={packageManager}
          onChange={(e) => setPackageManager(e.target.value)}
        >
          {packageManagers.map(pm => (
            <option key={pm.value} value={pm.value}>
              {pm.label}
            </option>
          ))}
        </select>

        <button
          className="search-button neon-button cyan"
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? <FiLoader className="spinning" /> : 'Search'}
        </button>
      </div>

      <div className="search-actions">
        <button className="ask-ai-button neon-button pink" onClick={onAskAI}>
          🤖 Ask AI for Recommendations
        </button>
      </div>

      {isSearching && (
        <div className="search-loading">
          <FiLoader className="spinning" size={32} />
          <p>Searching {packageManager} packages...</p>
        </div>
      )}

      {!isSearching && searchPerformed && results.length === 0 && (
        <div className="no-results">
          <FiPackage size={48} />
          <h3>No packages found</h3>
          <p>Try a different search term or package manager</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h3>Found {results.length} packages</h3>
          </div>
          <div className="results-grid">
            {results.map((pkg, index) => (
              <PackageCard
                key={`${pkg.name}-${index}`}
                pkg={pkg}
                onInstall={handleInstall}
                onViewDetails={handleViewDetails}
                isInstalling={installingPackages.has(pkg.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageSearch;
