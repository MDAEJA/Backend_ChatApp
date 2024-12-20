const multer = require('multer');

const multerFunction = () => {
  // Set up multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'upload'); // Save files in the 'upload' folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + file.originalname);
    },
  });

  return multer({ storage });
};

module.exports = multerFunction;
