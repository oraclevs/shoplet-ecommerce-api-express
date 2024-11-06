import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config({ path: 'src/.env' })

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } = process.env

// cloudinary configuration
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY,
    secure: true
});

// cloudinary AI background removal
export const AiBackgroundRemovalCloudinary = {
    background_removal: 'cloudinary_ai',
    public_id: "",//req.file?.filename as string,
    resource_type: 'image'
}

export default cloudinary