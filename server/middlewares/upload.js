const multer = require('multer');
const path = require('path');

// Define onde salvar e o nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // certifique-se de que essa pasta existe
  },
  filename: (req, file, cb) => {
    cb(null, `planilha-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
module.exports = upload;