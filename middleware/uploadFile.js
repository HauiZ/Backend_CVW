import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.memoryStorage();

const pdfUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF!'), false);
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
      cb(new Error('Chỉ chấp nhận file hình ảnh!'), false); // Từ chối file và trả về lỗi
    }
  },
});
export default {pdfUpload, imageUpload};