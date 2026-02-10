import React from 'react';
import { FiBookOpen, FiEdit2, FiTrash2, FiCalendar, FiTag } from 'react-icons/fi';
import './ArticleList.css';

const ArticleList = ({ articles, onRead, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getExcerpt = (content, maxLength = 150) => {
    const text = content.replace(/[#*`\[\]]/g, '').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (articles.length === 0) {
    return (
      <div className="article-list-empty">
        <div className="empty-state">
          <FiBookOpen size={64} />
          <h2>No Articles Yet</h2>
          <p>Start writing your first cyberpunk tech journal entry!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-list">
      <div className="articles-grid">
        {articles.map((article) => (
          <div key={article.id} className="article-card glass-card">
            {article.coverImage && (
              <div className="article-cover">
                <img src={article.coverImage} alt={article.title} />
              </div>
            )}

            <div className="article-content">
              <h2 
                className="article-title" 
                onClick={() => onRead(article)}
                title="Click to read"
              >
                {article.title}
              </h2>

              <div className="article-meta">
                <span className="article-date">
                  <FiCalendar size={14} />
                  {formatDate(article.createdAt)}
                </span>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  <FiTag size={14} />
                  {article.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="article-excerpt">
                {getExcerpt(article.content)}
              </p>

              <div className="article-actions">
                <button 
                  className="action-btn read-btn"
                  onClick={() => onRead(article)}
                  title="Read article"
                >
                  <FiBookOpen /> Read
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => onEdit(article)}
                  title="Edit article"
                >
                  <FiEdit2 /> Edit
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => onDelete(article.id)}
                  title="Delete article"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
