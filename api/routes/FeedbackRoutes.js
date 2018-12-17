const express = require('express');
const router = express.Router();

const FeedbackController = require('../controllers/FeedbackController');

router.get('/', FeedbackController.feedback_get_all);
router.get('/:feedbackId', FeedbackController.feedback_get_feedback);
router.post('/', FeedbackController.feedback_create_feedback);
router.delete('/:feedbackId', FeedbackController.feedback_delete_feedback);

module.exports = router;