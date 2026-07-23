const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder based on route (optional but good for organization)
    let folderName = 'ngo_uploads';
    if (req.baseUrl.includes('gallery')) folderName = 'ngo_gallery';
    if (req.baseUrl.includes('projects')) folderName = 'ngo_projects';
    if (req.baseUrl.includes('events')) folderName = 'ngo_events';
    if (req.baseUrl.includes('news')) folderName = 'ngo_news';
    if (req.baseUrl.includes('team')) folderName = 'ngo_team';

    return {
      folder: folderName,
      allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`, // unique filename
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimeAllowed = allowedTypes.test(file.mimetype);
  const extAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeAllowed && extAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

// Helper to get public URL for uploaded file (returns the Cloudinary URL)
const getFileUrl = (req, filename) => {
  // If the filename already looks like a URL (Cloudinary URL), return it directly
  if (filename && filename.startsWith('http')) {
    return filename;
  }
  return filename; 
};

// Delete file from Cloudinary storage
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder/public_id.ext
    const urlParts = fileUrl.split('/');
    const fileNameWithExt = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    const publicId = fileNameWithExt.split('.')[0];
    
    // Only attempt deletion if it's a Cloudinary URL
    if (fileUrl.includes('cloudinary.com') && folderName && publicId) {
       await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
  }
};

module.exports = { upload, getFileUrl, deleteFile };
