import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Heart, MessageSquare, Share2, Send, Trash2, Edit3 } from 'lucide-react';
import '../styles/achievements.css';

export const AchievementCard = ({ achievement }) => {
  const {
    data,
    isAuthenticated,
    toggleLikeAchievement,
    addCommentToAchievement,
    deleteCommentFromAchievement,
    deleteAchievement,
    openAdminTab,
    showToast
  } = usePortfolio();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleShare = () => {
    const shareUrl = window.location.origin + window.location.pathname + `#achievements-${achievement.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Post link copied to clipboard!');
    }).catch(() => {
      showToast('Share URL: ' + shareUrl);
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToAchievement(achievement.id, commentText, authorName.trim() || 'Visitor');
    setCommentText('');
  };

  return (
    <div className="achievement-card" id={`achievements-${achievement.id}`}>
      <div className="achievement-header">
        <div className="achievement-author-info">
          <img
            src={data.profile.avatar}
            alt={data.profile.name}
            className="achievement-author-avatar"
          />
          <div>
            <div className="author-name">{data.profile.name}</div>
            <div className="achievement-date">{achievement.date}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge">{achievement.category || 'Post'}</span>
          {isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem' }}>
              <button
                className="btn-icon"
                style={{ padding: '0.3rem' }}
                onClick={() => openAdminTab('achievements', achievement)}
                title="Edit this post"
              >
                <Edit3 size={14} />
              </button>
              <button
                className="btn-icon"
                style={{ padding: '0.3rem' }}
                onClick={() => deleteAchievement(achievement.id)}
                title="Delete this post"
              >
                <Trash2 size={14} color="#ef4444" />
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="achievement-title">{achievement.title}</h3>
      <p className="achievement-description">{achievement.description}</p>

      {achievement.image && (
        <div className="achievement-image-wrapper">
          <img src={achievement.image} alt={achievement.title} className="achievement-image" />
        </div>
      )}

      <div className="achievement-actions">
        <button
          className={`action-btn ${achievement.isLikedByUser ? 'liked' : ''}`}
          onClick={() => toggleLikeAchievement(achievement.id)}
          title="Like this achievement"
        >
          <Heart size={18} fill={achievement.isLikedByUser ? 'currentColor' : 'none'} />
          <span>{achievement.likesCount} {achievement.likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
          title="View & Add Comments"
        >
          <MessageSquare size={18} />
          <span>{achievement.comments ? achievement.comments.length : 0} Comments</span>
        </button>

        <button className="action-btn" onClick={handleShare} title="Share Link">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {achievement.comments && achievement.comments.length > 0 && (
            <div className="comments-list">
              {achievement.comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{c.author}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="comment-date">{c.date}</span>
                      {isAuthenticated && (
                        <Trash2
                          size={14}
                          color="#ef4444"
                          style={{ cursor: 'pointer' }}
                          onClick={() => deleteCommentFromAchievement(achievement.id, c.id)}
                          title="Delete Comment"
                        />
                      )}
                    </div>
                  </div>
                  <div className="comment-text">{c.text}</div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="add-comment-form">
            <input
              type="text"
              placeholder="Your Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="comment-input"
              style={{ flex: '0 0 120px' }}
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-input"
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
