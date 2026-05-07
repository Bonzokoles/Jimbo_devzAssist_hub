import React, { useState, useEffect } from 'react';
import { FiSave, FiEye, FiEyeOff, FiZap, FiX } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { callOpenAI, callClaude } from '../../utils/aiClient';
import useStore from '../../store/useStore';
import './ArticleEditor.css';

const ArticleEditor = ({ article, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  
  const { openaiKey, claudeKey } = useStore();

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setContent(article.content || '');
      setCoverImage(article.coverImage || '');
      setTags(article.tags ? article.tags.join(', ') : '');
    }
  }, [article]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your article');
      return;
    }
    if (!content.trim()) {
      alert('Please enter content for your article');
      return;
    }

    const articleData = {
      title: title.trim(),
      content: content.trim(),
      coverImage: coverImage.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(t => t)
    };

    onSave(articleData);
  };

  const handleAiEnhance = async () => {
    if (!content.trim()) {
      alert('Please enter some content first');
      return;
    }

    if (!openaiKey && !claudeKey) {
      alert('Please configure an AI API key in Settings to use AI enhancement');
      return;
    }

    setIsAiEnhancing(true);
    try {
      const prompt = `Ulepsz ten artykuł na blogu. Dodaj sekcje, popraw formatowanie Markdown, dodaj emoji, uczyń go bardziej cyberpunkowym i atrakcyjnym:\n\n${content}`;
      
      let enhancedContent;
      if (openaiKey) {
        enhancedContent = await callOpenAI(
          openaiKey,
          'gpt-3.5-turbo',
          [{ role: 'user', content: prompt }]
        );
      } else if (claudeKey) {
        enhancedContent = await callClaude(
          claudeKey,
          'claude-3-haiku-20240307',
          [{ role: 'user', content: prompt }]
        );
      }

      setContent(enhancedContent);
    } catch (error) {
      console.error('AI enhancement failed:', error);
      alert('AI enhancement failed. Please check your API key and try again.');
    } finally {
      setIsAiEnhancing(false);
    }
  };

  return (
    <div className="article-editor">
      <div className="editor-toolbar">
        <button className="neon-button cyan" onClick={handleSave} disabled={isAiEnhancing}>
          <FiSave /> Save
        </button>
        <button 
          className="neon-button" 
          onClick={() => setShowPreview(!showPreview)}
          disabled={isAiEnhancing}
        >
          {showPreview ? <FiEyeOff /> : <FiEye />} 
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button 
          className="neon-button pink" 
          onClick={handleAiEnhance}
          disabled={isAiEnhancing}
        >
          <FiZap /> {isAiEnhancing ? 'Enhancing...' : 'AI Enhance'}
        </button>
        <button className="neon-button" onClick={onCancel} disabled={isAiEnhancing}>
          <FiX /> Cancel
        </button>
      </div>

      <div className="editor-form">
        <input
          type="text"
          className="title-input"
          placeholder="Article Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isAiEnhancing}
        />

        <div className="meta-inputs">
          <input
            type="text"
            placeholder="Cover Image URL (optional)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            disabled={isAiEnhancing}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated, e.g., tutorial, cyberpunk, ai)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isAiEnhancing}
          />
        </div>

        <div className={`editor-split ${!showPreview ? 'full-editor' : ''}`}>
          <div className="editor-panel">
            <h3>Editor</h3>
            <textarea
              className="content-editor"
              placeholder="Write your article in Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isAiEnhancing}
            />
          </div>

          {showPreview && (
            <div className="preview-panel">
              <h3>Preview</h3>
              <div className="markdown-preview">
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
                  {content || '*Preview will appear here...*'}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
