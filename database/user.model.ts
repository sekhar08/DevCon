import mongoose, { Schema, Model } from 'mongoose';

// TypeScript interface for User document based on Better Auth schema
// Omitting 'Document' extension to explicitly control the `_id` type without conflict.
export interface IUser {
    _id: string; // Better Auth uses string IDs
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

// User schema definition
const userSchema = new Schema<IUser>(
    {
        _id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        _id: false, // We're providing our own _id since Better Auth generates it
    }
);

// Create and export the User model
// Make sure to use the exact collection name that Better Auth expects (usually 'user')
const User: Model<IUser> =
    mongoose.models.user || mongoose.model<IUser>('user', userSchema, 'user');

export default User;
