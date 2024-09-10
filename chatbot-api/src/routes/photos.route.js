const express = require('express');
const router = express.Router();
const PhotoController = require('../controllers/photos.controller');

// Ruta para subir una foto
router.post('/upload/:userId', PhotoController.uploadPhoto);

// Ruta para recuperar fotos
router.get('/photos/:userId', PhotoController.getPhotos);

module.exports = router;
