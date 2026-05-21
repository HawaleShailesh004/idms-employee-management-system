import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vercel's filesystem is read-only except /tmp
const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel
  ? path.join(os.tmpdir(), 'idms-uploads')
  : path.join(__dirname, '../../uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn(`Could not create upload dir at ${uploadDir}:`, err.message);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = file.mimetype && allowed.test(file.mimetype);
  if (ext && (mime || !file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, png, gif, webp) are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

export const uploadDirPath = uploadDir;