import { model, Schema } from "mongoose";




interface UserAddress{
    Address: string;
    Country: string;
    State: string;
    ZipCode: string;
}


interface UserType  {
    FullName: string;
    UserName: string;
    Email: string;
    IsEmailVerified: boolean;
    Password: string;
    PhoneNumber?: string;
    Gender?: 'Male'| 'Female';
    Address?: UserAddress[];
    Avatar?: string;
    AuthToken?: string;
    Role:'User'
    CreatedAt: Date;
    UpdatedAt: Date;
}


const UserSchema = new Schema<UserType>({
    FullName: { type:String,required: true, },
    UserName: {type:String, required: true },
    Email: { type: String, required: true, unique: true },
    IsEmailVerified:{type:Boolean, default:false,},
    Password: { type: String, required: true },
    PhoneNumber: { type: String, default: Math.random()*999, unique:true},
    Gender: {type:String},
    Address: { type:[Object], default: [], },
    Avatar: {type:String, default: "",  },
    AuthToken: { type: String, default: "" },
    Role:{type:String,default:"User"},
    CreatedAt: {type:Date, default: Date.now(),required:true },
    UpdatedAt:{ type:Date, default: Date.now(),required:true },
})


export const User = model<UserType>('User', UserSchema)
