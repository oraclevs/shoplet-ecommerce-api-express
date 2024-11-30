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
    PhoneNumber?: string[];
    StripeCustomerID: string;
    Gender?: 'Male'| 'Female';
    Address?: UserAddress[];
    Avatar?: string;
    AuthToken?: string;
    Role: 'User';
    Blocked: {
        IsBlocked: boolean;
        Type: "Permanently" | "Temporary";
        Reason: string;
        Duration: {
            from: Date,
            to: Date,
        }
    };
    CreatedAt: Date;
    UpdatedAt: Date;
}


const UserSchema = new Schema<UserType>({
    FullName: { type:String,required: true, },
    UserName: {type:String, required: true },
    Email: { type: String, required: true, unique: true },
    IsEmailVerified:{type:Boolean, default:false,},
    Password: { type: String, required: true },
    PhoneNumber: { type: [String], default:[]},
    StripeCustomerID: { type: String},
    Gender: {type:String},
    Address: { type:[Object],},
    Avatar: {type:String, default: "",  },
    AuthToken: { type: String, default: "" },
    Role: { type: String, default: "User" },
    Blocked: {
        IsBlocked: { type: Boolean, default: false },
        Type: { type: String },
        Reason: { type: String },
        Duration:{
            from: { type: Date },
            to:{ type: Date}
        },
    },
    CreatedAt: {type:Date, default: new Date(),required:true },
    UpdatedAt:{ type:Date, default: new Date(),required:true },
})


export const User = model<UserType>('User', UserSchema)
