import { CustomRequest, CustomResponse } from "../../Types/Main";
import multer from 'multer'
import  CustomCloudinary from "../../Utils/Cloudinary.config";
import { User } from "../../Schemas/mongoose/User.schema";
import { CleanUpAfterUpload } from "../../Utils/DeleteFiles";
import { MulterStorage } from "../../Utils/Multer";
import { NextFunction } from "express-serve-static-core";



// Configure Multer to store files in the 'uploads' directory
const Upload = multer({
    storage: MulterStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    },
    fileFilter: (req, file, cb) => {
        // Check the file type 
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    }
}).single('profilePicture')

export const updateProfilePicture = [
    (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
        Upload(req, res, (error) => {
            if (error) {
                return res.status(400).json({ error: error.message });
            } // Check if files are valid images 
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'Only image files are allowed and at least one file must be uploaded!' });
            }
            next()
        })
    },
    async (req: CustomRequest, res: CustomResponse) => {
        try {
            // upload the profile to cloudinary
            const FileInCloud = await CustomCloudinary.uploader.upload(req.file?.path as string,
                {
                    folder: "Shoplet",
                    public_id: req.file?.filename,
                    resource_type:'image'
                })
            // get the image url
            const ProfileImageUrl = FileInCloud.secure_url
            // update the user Avatar in the database
            await User.findByIdAndUpdate(req.UserID, { Avatar: ProfileImageUrl })
            // clean up the profile image from the upload folder
            CleanUpAfterUpload(req.file?.filename as string)
            res.status(200).json({ success: true,msg:"Profile Picture Uploaded Successfully"})
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message })
            } else {
                res.status(500).json({ error })
            }
        }
    }
];

