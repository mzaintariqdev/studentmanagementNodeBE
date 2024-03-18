import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true } // Reference to Teacher model for the teacher of the subject
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
