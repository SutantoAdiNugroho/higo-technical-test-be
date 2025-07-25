const express = require('express');
const multer = require('multer');
const csvController = require('../controllers/csvController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/customers/upload', upload.single('csvFile'), csvController.uploadCsv);

module.exports = router;