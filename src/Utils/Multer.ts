import multer from 'multer'




export const MulterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/Uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date() + '-' + file.originalname);
    },
    
});
