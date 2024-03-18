import Teacher from '../models/teacher.js';

// Get all teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('user'); // Populate user details
        res.json(teachers);
    } catch (error) {
        console.error('Error in getting teachers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new teacher
export const createTeacher = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { user: userId, subjects, classes } = req.body;
        const newTeacher = new Teacher({ user: userId, subjects, classes });
        await newTeacher.save();
        res.status(201).json({ message: 'Teacher created successfully' });
    } catch (error) {
        console.error('Error in creating teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a teacher by their ID
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.teacherId).populate('user', 'name email'); // Populate user details
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (error) {
        console.error('Error in getting teacher by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a teacher
export const updateTeacher = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { user: userId, subjects, classes } = req.body;
        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.teacherId, { user: userId, subjects, classes }, { new: true });
        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher updated successfully' });
    } catch (error) {
        console.error('Error in updating teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a teacher
export const deleteTeacher = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.teacherId);
        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error in deleting teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
