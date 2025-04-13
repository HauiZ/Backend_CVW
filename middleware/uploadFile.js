import multer from 'multer';
import path from 'path';
import fs from 'fs';
import messages from '../config/message.js';

const storage = multer.memoryStorage();

const pdfUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(messages.file.ERR_ONLY_ACCEPT_PDF), false);
    }
  },
});
const imageUpload = multer({
  storage: multer.memoryStorage(), // Lưu trữ file trong bộ nhớ dưới dạng Buffer
  fileFilter: (req, file, cb) => {
    // Kiểm tra xem mimetype có phải là của hình ảnh hay không
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Chấp nhận file
    } else {
      cb(new Error(messages.file.ERR_ONLY_ACCEPT_IMAGE), false); // Từ chối file và trả về lỗi
    }
  },
});
export default {pdfUpload, imageUpload};