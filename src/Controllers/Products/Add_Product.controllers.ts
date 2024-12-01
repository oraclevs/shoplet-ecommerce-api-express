import { NextFunction } from "express-serve-static-core";
import { CustomRequest, CustomResponse } from "../../Types/Main";
import { MulterStorage } from "../../Utils/Multer";
import multer from "multer";
import { AdminInputValidator } from "../../Utils/AdminInputValidators";
import CustomCloudinary from "../../Utils/Cloudinary.config";
import { CleanUpAfterUpload } from "../../Utils/DeleteFiles";
import { Product } from "../../Schemas/mongoose/Products.schema";
import { syncProductsToStripe } from "../../Utils/Stripe_price_setup";


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
}).array('ProductImages', 5)

export const AddProductToDb = [
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
            const ImagesArray = req.files
            req.body.Price = parseFloat(req.body.Price.trim())
            req.body.Stock_quantity = parseFloat(req.body.Stock_quantity.trim())
            // validating admin inputs
            const { success, data } = new AdminInputValidator().validateCreateProductInput(req.body,"Add")
            if (!success) {
                throw data
            }
            
            // uploading the product Images to cloudinary
            const ImagesUploadedToCloudinary = []
            if (Array.isArray(ImagesArray)) {    
                for (const file of ImagesArray) { 
                    const FileInCloud = await CustomCloudinary.uploader.upload(file.path as string,
                        {
                            folder: "Shoplet",
                            public_id: file?.originalname,
                            resource_type: 'image'
                        })
                    ImagesUploadedToCloudinary.push(FileInCloud.secure_url)
                    CleanUpAfterUpload(file?.filename as string)
                }
            }
           
            const DateCreated  = new Date() 
            await new Product({
                name: data.name,
                description: data.description,
                brand: data.brand,
                category: data.category,
                stock_quantity: data.stock_quantity,
                price: data.price,
                images: ImagesUploadedToCloudinary,
                attributes:data.attributes,
                CreatedAt: DateCreated,
            }).save()
            const newProduct = await Product.findOne({ CreatedAt: DateCreated }, { _id: 1 })
            
            if (newProduct) {
                syncProductsToStripe(newProduct._id.toString())
            }
            res.status(201).json({ success: true, msg: "Product added successfully Created" })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error });
            }
        }
    }
]