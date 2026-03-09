import React, { useState } from 'react';

const FeedbackForm = ({ eventName, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ rating, comment });
      alert('Thank you for your feedback!');
      setComment('');
      setRating(0);
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-form-card">
      <h3 className="feedback-form-title">Event Feedback</h3>
      <p className="feedback-form-subtitle">Share your experience attending "{eventName}"</p>

      <form onSubmit={handleSubmit} className="feedback-form-element">
        <div className="feedback-form-group">
          <label className="feedback-form-label">
            Rating
          </label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="star-button"
              >
                <svg
                  className={`star-icon ${star <= rating ? 'star-icon--active' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="rating-label">
              {rating === 0 ? 'Select rating' : `${rating} star${rating > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        <div className="feedback-form-group">
          <label htmlFor="comment" className="feedback-form-label">
            Comments
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="feedback-textarea"
            placeholder="Share your thoughts about the event..."
          />
        </div>

        <div className="feedback-form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="feedback-btn-secondary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="feedback-btn-primary"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;