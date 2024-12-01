import { Types } from "mongoose";
import { CustomRequest, CustomResponse } from "../../Types/Main";
import { AdminInputValidator } from "../../Utils/AdminInputValidators";
import multer from "multer";
import { MulterStorage } from "../../Utils/Multer";
import { NextFunction } from "express";
import { CleanUpAfterUpload } from "../../Utils/DeleteFiles";
import CustomCloudinary from '../../Utils/Cloudinary.config'
import { Product } from "../../Schemas/mongoose/Products.schema";

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

export const UpdateProduct = [
    (req: CustomRequest, res: CustomResponse, next: NextFunction) => {
        Upload(req, res, (error) => {
            if (error) {
                return res.status(400).json({ error: error.message });
            } // Check if files are valid images 
            if (!req.files) {
                return res.status(400).json({ error: 'Only image files are allowed' });
            }
            next()
        })
    },
    async (req: CustomRequest, res: CustomResponse) => {
        try {
            // get the id of the product
            const ProductId = req.params.id
            // validate the product id to make sure it is valid
            const isProductIDvalid = Types.ObjectId.isValid(ProductId)
            if (!isProductIDvalid) {
                res.status(404).json({ Success: false, Error: "Product ID is not valid" })
                return
            }
            // get the req.body and validate it
            if (req.body.price) {
                req.body.price = parseFloat(req.body.price.trim())
            }
            if (req.body.stock_quantity) {
                req.body.stock_quantity = parseFloat(req.body.stock_quantity.trim())
            }
            
            const { success, data } = new AdminInputValidator().validateCreateProductInput(req.body, "Update")
            
            if (!success) { 
                throw data
            }
            // check if the user uploaded any images and update it
            const ImagesUploadedToCloudinary = []
            const ImagesArray = req.files
            if (Array.isArray(ImagesArray) && ImagesArray.length> 0) {
                for (const file of ImagesArray) {
                    const FileInCloud = await CustomCloudinary.uploader.upload(file.path as string,
                        {
                            folder: "Shoplet",
                            public_id: file?.originalname,
                            resource_type: 'image'
                        })
                    ImagesUploadedToCloudinary.push(FileInCloud.secure_url)
                    CleanUpAfterUpload(file?.filename as string);
                }
            }
            
            // update the product in the database
          
            if (ImagesUploadedToCloudinary.length > 0) { 
                await Product.updateOne({ _id: ProductId, }, { ...data, $push: { images: { $each: ImagesUploadedToCloudinary } } } ,{new:true})
            } else {
                await Product.updateOne({ _id: ProductId, }, { ...data }, { new: true })
            }

            res.status(200).json({ success: true, msg: "Product updated successfully" })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.json({ error });
            }
        }
    }
]