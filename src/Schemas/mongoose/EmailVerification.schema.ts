import mongoose, { Document, Schema } from 'mongoose';

interface IVerificationCode extends Document {
    code: Number;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const VerificationCodeSchema: Schema = new Schema({
    code: { type: Number, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // Expires after 10 minutes (300 seconds)
});

export const VerificationCode = mongoose.model<IVerificationCode>('VerificationCode', VerificationCodeSchema);
