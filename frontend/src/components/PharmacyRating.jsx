import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PharmacyRating = ({ pharmacyId, pharmacyName, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/ratings', {
        pharmacyId,
        pharmacyName,
        rating,
        review,
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName')
      });
      toast.success('Rating submitted successfully!');
      onRatingSubmit();
      setRating(0);
      setReview('');
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border rounded p-3 mt-2">
      <h6>Rate {pharmacyName}</h6>
      <div className="d-flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="btn btn-sm p-0"
            style={{ fontSize: '24px', background: 'none', border: 'none' }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <span style={{ color: (hover || rating) >= star ? '#ffc107' : '#e4e5e9' }}>
              ★
            </span>
          </button>
        ))}
      </div>
      <textarea
        className="form-control form-control-sm mb-2"
        rows="2"
        placeholder="Write a review (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <button className="btn btn-sm btn-primary" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
};

export default PharmacyRating;