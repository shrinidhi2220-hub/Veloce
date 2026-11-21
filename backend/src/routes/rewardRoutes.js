const express = require('express');
const router = express.Router();

const rewardController = require('../controllers/rewardController');
const wordPuzzleController =
  require('../controllers/wordPuzzleController');
const {
  authenticate,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Customer: read only their own reward history and balance.
router.get('/me', authenticate, rewardController.getMyRewards);
router.post('/game/play', authenticate, rewardController.playGame);
router.get(
  '/game/word-puzzle',
  authenticate,
  wordPuzzleController.getWordPuzzle
);
router.post(
  '/game/word-puzzle/attempt',
  authenticate,
  wordPuzzleController.attemptWordPuzzle
);

// Admin: award points to a selected customer.
router.post(
  '/admin/award',
  authenticate,
  authorizeRoles('ADMIN'),
  rewardController.adminAwardPoints
);

module.exports = router;
