const express = require('express');
const router = express.Router();

const LocationController = require('../controllers/LocationController');

router.get('/', LocationController.locations_get_all);
router.get('/:locationId', LocationController.locations_get_location);
router.post('/', LocationController.locations_create_location);
router.delete('/:locationId', LocationController.locations_delete_location);

module.exports = router;