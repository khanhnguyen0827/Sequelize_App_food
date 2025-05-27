// Xử lý request HTTP và gọi đến lớp service tương ứng
import asyncHandler from '../common/utils/asyncHandler.js';
import ratingsService from '../service/ratings.service.js';

const upsertRating = asyncHandler(async (req, res) => {
  const { userId, restaurantId, rating, comment } = req.body;
  if (!userId || !restaurantId || rating === undefined) {
    return res.status(400).json({ message: 'User ID, Restaurant ID, and Rating are required.' });
  }
  const newRating = await ratingsService.upsertRating(userId, restaurantId, rating, comment);
  res.status(201).json({ message: 'Rating saved successfully.', data: newRating });
});

const getRatingsByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const ratings = await ratingsService.getRatingsByRestaurant(restaurantId);
  res.status(200).json(ratings);
});

const getRatingsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const ratings = await ratingsService.getRatingsByUser(userId);
  res.status(200).json(ratings);
});

export { upsertRating, getRatingsByRestaurant, getRatingsByUser };