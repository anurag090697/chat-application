import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true, // Make the field mandatory
            unique: true,   // Ensure the username is unique
            trim: true,     // Remove extra spaces
        },
        password: {
            type: String,
            required: true, // Make the field mandatory
            // minlength: 6,   // Set a minimum length for security
        },
    },
    {
        timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
    }
);

// Create the User model
export const UserModel = mongoose.model('User', userSchema);

