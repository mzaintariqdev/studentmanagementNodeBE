import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },

    // here type is mongoDb ObjectID , ref is for Class document in mongodb 
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;

