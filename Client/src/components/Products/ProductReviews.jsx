import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useCreateReviewMutation, useGetProductReviewsQuery } from '../../redux/api/productApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { formatDate } from '../../utils/formatDate';

const ProductReviews = ({ productId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);
  const { data: reviews, isLoading, refetch } = useGetProductReviewsQuery(productId);
  const [createReview] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      toast.success('Review submitted successfully');
      setRating(5);
      setComment('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

      {userInfo && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="cursor-pointer"
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      size={24}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">{review.username}</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      color={index < review.rating ? "#ffc107" : "#e4e5e9"}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(review.created_at)}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews; 