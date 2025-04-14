import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import '../styles/ReviewSystem.css';

const ReviewSystem = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [vehicleId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/vehicles/${vehicleId}/reviews`,
        newReview,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNewReview({ rating: 0, comment: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="review-system">
      <h3>Customer Reviews</h3>
      
      <div className="review-form">
        <h4>Write a Review</h4>
        <form onSubmit={handleSubmitReview}>
          <StarRating
            rating={newReview.rating}
            onRatingChange={(rating) => setNewReview(prev => ({...prev, rating}))}
          />
          <textarea
            placeholder="Share your experience..."
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <StarRating rating={review.rating} readonly />
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="review-comment">{review.comment}</p>
            <p className="reviewer-name">- {review.user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;