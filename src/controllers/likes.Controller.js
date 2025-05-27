// Xử lý request HTTP và gọi đến lớp service tương ứng
import asyncHandler from '../common/utils/asyncHandler.js';
import likesService from '../service/likes.service.js';

const toggleLike = asyncHandler(async (req, res) => {
  const { userId, restaurantId } = req.body;
  if (!userId || !restaurantId) {
    return res.status(400).json({ message: 'User ID and Restaurant ID are required.' });
  }
  const result = await likesService.toggleLike(userId, restaurantId);
  if (result.type === 'unlike') {
    res.status(200).json({ message: result.message });
  } else {
    res.status(201).json({ message: result.message, data: result.data });
  }
});

const getLikesByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const likes = await likesService.getLikesByRestaurant(restaurantId);
  res.status(200).json(likes);
});

const getLikesByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const likes = await likesService.getLikesByUser(userId);
  res.status(200).json(likes);
});

export { toggleLike, getLikesByRestaurant, getLikesByUser };