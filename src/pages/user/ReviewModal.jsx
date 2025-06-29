import React, { useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ReviewModal = ({ productId, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await API.post('/reviews', {
      product: productId, // ✅ Make sure this is included
      rating,
      comment,
    });

    toast.success('Review added successfully');
    onClose();
  } catch (error) {
    console.error('Review Submit Error:', error.response?.data || error.message);
    toast.error('Failed to add review');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">Leave a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comment:</label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Write your thoughts..."
            ></textarea>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
