import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';

const directories = [
    uploadDir,
    `${uploadDir}/carousel`,
    `${uploadDir}/news`,
    `${uploadDir}/galleries`,
    `${uploadDir}/documents`,
    `${uploadDir}/temp`
];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = uploadDir;
        
        if (req.baseUrl.includes('carousel')) {
            dest = `${uploadDir}/carousel`;
        } else if (req.baseUrl.includes('news')) {
            dest = `${uploadDir}/news`;
        } else if (req.baseUrl.includes('gallery')) {
            dest = `${uploadDir}/galleries`;
        } else if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) {
            dest = `${uploadDir}/documents`;
        } else {
            dest = `${uploadDir}/temp`;
        }
        
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedExtensions = (process.env.ALLOWED_EXTENSIONS || '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx').split(',');
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760')
    }
});