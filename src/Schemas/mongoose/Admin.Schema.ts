import { Schema, model } from "mongoose";


interface AdminType{
    Email: string;
    Password: string;
    AuthToken: string;
    Role: 'admin';
    CreatedAt: Date;
    UpdatedAt: Date;
}

const AdminSchema = new Schema<AdminType>({
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    AuthToken: { type: String, },
    Role: { type: String, default: 'admin' },
    CreatedAt: { type: Date },
    UpdatedAt: { type: Date },
})

export const Admin = model<AdminType>('Admin', AdminSchema)
