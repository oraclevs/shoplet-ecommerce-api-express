import { CustomRequest, CustomResponse } from "../../Types/Main";
import multer from 'multer'
import  CustomCloudinary from "../../Utils/Cloudinary.config";
import { User } from "../../Schemas/mongoose/User.schema";
import { CleanUpAfterUpload } from "../../Utils/DeleteFiles";




// Configure Multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/Uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });


export const updateProfilePicture = [
    upload.single('profilePicture'),
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

