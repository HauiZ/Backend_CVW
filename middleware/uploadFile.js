import multer from 'multer';
import path from 'path';
import fs from 'fs';
import messages from '../config/message.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

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

const avatar = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Avatar',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const logo = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Logo',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const template = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'PdfPreview',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const uploadAvatar = multer({ storage: avatar });
const uploadLogo = multer({ storage: logo });
const uploadTemplate = multer({ storage: template });

const uploadPdfAndImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF and image files are allowed'), false);
  },
}).fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

export default {pdfUpload, uploadAvatar, uploadLogo, uploadTemplate, uploadPdfAndImage};