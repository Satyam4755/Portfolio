import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Portfolio } from './models/Portfolio.js';
import { defaultPortfolio } from './defaultPortfolio.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || `${ADMIN_PASSWORD || 'change-me'}-jwt-secret`;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is required in .env');
}
if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD is required in .env');
}

app.use(cors());
app.use(express.json({ limit: '20mb' }));

function getTokenFromHeader(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return '';
  return auth.slice(7);
}

function requireAdmin(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

async function getOrCreatePortfolio() {
  let doc = await Portfolio.findOne();
  if (!doc) {
    doc = await Portfolio.create(defaultPortfolio);
  }
  return doc;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
  return res.json({ token });
});

app.get('/api/portfolio', async (_req, res) => {
  const doc = await getOrCreatePortfolio();
  return res.json(doc);
});

app.get('/api/admin/portfolio', requireAdmin, async (_req, res) => {
  const doc = await getOrCreatePortfolio();
  return res.json(doc);
});

app.put('/api/admin/portfolio', requireAdmin, async (req, res) => {
  const payload = req.body || {};
  const doc = await getOrCreatePortfolio();

  doc.ownerEmail = payload.ownerEmail || '';
  doc.profile = payload.profile || defaultPortfolio.profile;
  doc.settings = payload.settings || defaultPortfolio.settings;
  doc.skills = Array.isArray(payload.skills) ? payload.skills : [];
  doc.projects = Array.isArray(payload.projects) ? payload.projects : [];
  doc.education = Array.isArray(payload.education) ? payload.education : [];
  doc.socialLinks = Array.isArray(payload.socialLinks) ? payload.socialLinks : [];
  doc.updatedAt = new Date();

  await doc.save();
  return res.json(doc);
});

app.post('/api/admin/upload', requireAdmin, async (req, res) => {
  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: 'Cloudinary environment variables are missing' });
    }

    const { fileDataUrl, resourceType = 'auto', folder = 'portfolio-admin' } = req.body || {};
    const allowedResourceTypes = new Set(['auto', 'image', 'video', 'raw']);
    if (!fileDataUrl || typeof fileDataUrl !== 'string') {
      return res.status(400).json({ error: 'fileDataUrl is required' });
    }
    if (!allowedResourceTypes.has(resourceType)) {
      return res.status(400).json({ error: 'Invalid resourceType' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          file: fileDataUrl,
          folder,
          timestamp: String(timestamp),
          api_key: CLOUDINARY_API_KEY,
          signature
        }).toString()
      }
    );

    const data = await cloudinaryResponse.json();
    if (!cloudinaryResponse.ok) {
      return res.status(400).json({ error: data?.error?.message || 'Cloudinary upload failed' });
    }

    return res.json({
      url: data.secure_url,
      publicId: data.public_id,
      resourceType: data.resource_type
    });
  } catch {
    return res.status(500).json({ error: 'Upload failed' });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Mongo connection failed:', error.message);
    process.exit(1);
  });
