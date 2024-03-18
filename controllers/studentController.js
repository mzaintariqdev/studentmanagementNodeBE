import Student from '../models/student.js';

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const students = await Student.find().populate('class');
        res.json(students);
    } catch (error) {
        console.error('Error in getting students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new student
export const createStudent = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, age, class: classId } = req.body;
        const newStudent = new Student({ name, age, class: classId });
        await newStudent.save();
        res.status(201).json({ message: 'Student created successfully' });
    } catch (error) {
        console.error('Error in creating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a student by its ID
export const getStudentById = async (req, res) => {
    try {
        // No role check for reading student by ID

        const student = await Student.findById(req.params.studentId).populate('class');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error('Error in getting student by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a student
export const updateStudent = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, age, class: classId } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(req.params.studentId, { name, age, class: classId }, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error in updating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a student
export const deleteStudent = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const deletedStudent = await Student.findByIdAndDelete(req.params.studentId);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error in deleting student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
