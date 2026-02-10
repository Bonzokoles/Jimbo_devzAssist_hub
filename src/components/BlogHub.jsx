import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import ArticleList from './blog/ArticleList';
import ArticleEditor from './blog/ArticleEditor';
import ArticleReader from './blog/ArticleReader';
import './BlogHub.css';

const STORAGE_KEY = 'bonzo_blog_articles';
const DEFAULT_TAGS = ['all', 'tutorial', 'devlog', 'news', 'cyberpunk', 'ai', 'coding'];

const BlogHub = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // list, editor, reader
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');

  // Load articles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setArticles(parsed);
        setFilteredArticles(parsed);
      } catch (error) {
        console.error('Failed to parse articles from localStorage:', error);
      }
    }
  }, []);

  // Save articles to localStorage whenever they change
  useEffect(() => {
    if (articles.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }
  }, [articles]);

  // Filter articles based on search query and active tag
  useEffect(() => {
    let filtered = articles;

    // Filter by tag
    if (activeTag !== 'all') {
      filtered = filtered.filter(article => 
        article.tags && article.tags.includes(activeTag)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  }, [articles, searchQuery, activeTag]);

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setCurrentView('editor');
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setCurrentView('editor');
  };

  const handleReadArticle = (article) => {
    setSelectedArticle(article);
    setCurrentView('reader');
  };

  const handleSaveArticle = (articleData) => {
    if (selectedArticle) {
      // Update existing article
      setArticles(prev => prev.map(a => 
        a.id === selectedArticle.id 
          ? { ...articleData, id: selectedArticle.id, updatedAt: new Date().toISOString() }
          : a
      ));
    } else {
      // Create new article
      const newArticle = {
        ...articleData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setArticles(prev => [newArticle, ...prev]);
    }
    setCurrentView('list');
    setSelectedArticle(null);
  };

  const handleDeleteArticle = (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(prev => prev.filter(a => a.id !== articleId));
      if (selectedArticle && selectedArticle.id === articleId) {
        setCurrentView('list');
        setSelectedArticle(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setCurrentView('list');
    setSelectedArticle(null);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedArticle(null);
  };

  return (
    <div className="blog-hub">
      <div className="blog-header">
        <h1 className="neon-text cyan">📝 Blog Hub</h1>
        
        {currentView === 'list' && (
          <div className="blog-controls">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="tag-filters">
              {DEFAULT_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter ${activeTag === tag ? 'active' : ''}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button className="neon-button cyan" onClick={handleCreateArticle}>
              <FiPlus /> New Article
            </button>
          </div>
        )}
      </div>

      <div className="blog-content">
        {currentView === 'list' && (
          <ArticleList
            articles={filteredArticles}
            onRead={handleReadArticle}
            onEdit={handleEditArticle}
            onDelete={handleDeleteArticle}
          />
        )}

        {currentView === 'editor' && (
          <ArticleEditor
            article={selectedArticle}
            onSave={handleSaveArticle}
            onCancel={handleCancelEdit}
          />
        )}

        {currentView === 'reader' && selectedArticle && (
          <ArticleReader
            article={selectedArticle}
            onBack={handleBackToList}
            onEdit={() => handleEditArticle(selectedArticle)}
          />
        )}
      </div>
    </div>
  );
};

export default BlogHub;
