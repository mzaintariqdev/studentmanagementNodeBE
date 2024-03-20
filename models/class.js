import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }]
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt
     
const Class = mongoose.model('Class', classSchema);

export default Class;
