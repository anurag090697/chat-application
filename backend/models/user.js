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
        // a people to which you sent request
        sent_request: {
            type: [mongoose.Schema.Types.ObjectId], // Array of ObjectId references
            ref: 'User', // Reference to the same User collection
            default: [], // Default value is an empty array
        },
        friends: {
            type: [mongoose.Schema.Types.ObjectId], // Array of ObjectId references
            ref: 'User', // Reference to the same User collection
            default: [], // Default value is an empty array
        },
        // a people from which you got request
        received_request:{
            type: [mongoose.Schema.Types.ObjectId], // Array of ObjectId references
            ref: 'User', // Reference to the same User collection
            default: [], // Default value is an empty array
        }
    },
    {
        timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
    }
);

// Create the User model
export const UserModel = mongoose.model('User', userSchema);
