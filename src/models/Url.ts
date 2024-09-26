import mongoose, { Schema, Document } from 'mongoose';

const ASCENDING_ORDER = 1
const ANY_DOCUMENT = 0

interface IUrl extends Document {
    longUrl: string;
    shortUrl: string;
    urlCode: string;
    createdAt: Date;
    expiresAt?: Date | null;
    clicks: number;
}

const urlSchema = new Schema<IUrl>({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: false },
    urlCode: { type: String, required: false, unique: true }, // Ensure uniqueness
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    clicks: { type: Number, default: 0 }
});

// Add index on urlCode for faster lookups
urlSchema.index({ urlCode: ASCENDING_ORDER });

urlSchema.index({ expiresAt: ASCENDING_ORDER }, { expireAfterSeconds: ANY_DOCUMENT });

export const Url = mongoose.model<IUrl>('Url', urlSchema);
