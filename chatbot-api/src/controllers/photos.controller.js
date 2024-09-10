const path = require('path');
const fs2 = require('fs/promises'); 
const fs = require('fs');
const multer = require('multer');

// Configuración de multer para manejar la subida de archivos
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Ruta de destino para guardar los archivos
      cb(null, path.join(__dirname, '../public/accounts/customUserId'));
    },
    filename: function (req, file, cb) {
      // Obtener el userId de los parámetros de la URL
      const { userId } = req.params;

      // Asegúrate de que el userId es una cadena válida para usar como nombre de archivo
      const fileExtension = path.extname(file.originalname);
      const fileName = `${userId}${fileExtension}`;

      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
    }
    cb(null, true);
  },
});
// Función para manejar la subida de fotos
async function uploadPhoto(req, res) {
  const userId = req.params.userId;
  upload.single('photo')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Photo uploaded successfully', file: req.file });
  });
}

async function getPhotos(req, res) {
  const photoName = req.params.userId; // Aquí asumimos que 'userId' es el nombre del archivo de la foto
  const photoPath = path.join(__dirname, '../public/accounts/customUserId', photoName);

  try {
    // Verificar si el archivo existe
    const stats = await fs2.stat(photoPath);

    // Si es un archivo, enviar la imagen directamente al navegador
    if (stats.isFile()) {
      return res.sendFile(photoPath); // Envía el archivo como respuesta
    } else {
      return res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve photo' });
  }
}

module.exports = { uploadPhoto, getPhotos };
