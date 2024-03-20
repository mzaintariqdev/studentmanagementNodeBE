import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
