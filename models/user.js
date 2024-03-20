import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true }, // Making emails lowercase for consistency
    password: { type: String, required: true }, // Adding select: false to prevent returning password by default
    role: { type: String, enum: ['admin', 'teacher'], default: 'teacher' },
    resetToken: String,
    resetTokenExpiry: Date
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

export default User;
