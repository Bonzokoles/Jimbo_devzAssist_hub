import React from 'react';
import { FiArrowLeft, FiEdit2, FiCalendar, FiTag, FiClock } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ArticleReader.css';

const ArticleReader = ({ article, onBack, onEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  return (
    <div className="article-reader">
      <div className="reader-navigation">
        <button className="neon-button cyan" onClick={onBack}>
          <FiArrowLeft /> Back to Articles
        </button>
        <button className="neon-button" onClick={onEdit}>
          <FiEdit2 /> Edit Article
        </button>
      </div>

      <article className="reader-content">
        {article.coverImage && (
          <div className="reader-cover">
            <img src={article.coverImage} alt={article.title} />
          </div>
        )}

        <header className="reader-header">
          <h1 className="reader-title">{article.title}</h1>

          <div className="reader-meta">
            <div className="meta-item">
              <FiCalendar />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            
            <div className="meta-item">
              <FiClock />
              <span>{estimateReadTime(article.content)} min read</span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="meta-item">
                <FiTag />
                <div className="reader-tags">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="reader-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="reader-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {article.updatedAt && article.updatedAt !== article.createdAt && (
          <footer className="reader-footer">
            <p>Last updated: {formatDate(article.updatedAt)}</p>
          </footer>
        )}
      </article>
    </div>
  );
};

export default ArticleReader;
