import Class from '../models/class.js';
import Teacher from '../models/teacher.js';

// Get all classes
export const getAllClasses = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const classes = await Class.find().populate('subjects students teachers');
        res.status(200).json(classes);
    } catch (error) {
        console.error('Error in getting all classes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a class
export const createClass = async (req, res) => {
    try {
        // Check user role
        console.log(req)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, subjects, students, teachers } = req.body;
        const newClass = new Class({ name, subjects, students, teachers });
        await newClass.save();
        // If teachers are provided, update the class of all mentioned teachers
        if (teachers && teachers.length > 0) {
            await Promise.all(teachers.map(async (teacherId) => {
                await Teacher.findByIdAndUpdate(
                    teacherId,
                    { classes: newClass._id },
                    { new: true }
                );
            }));
        }
        res.status(201).json({ message: 'Class created successfully' });
    } catch (error) {
        console.error('Error in creating class:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get class by ID
export const getClassById = async (req, res) => {
    try {
        const classId = req.params.classId;
        const foundClass = await Class.findById(classId).populate('subjects students teachers');
        if (!foundClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json(foundClass);
    } catch (error) {
        console.error('Error in getting class by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update class
export const updateClass = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const classId = req.params.classId;
        const { name, subjects, students, teachers } = req.body;
        // new make sure we get updated doc not the previous version in response 
        const updatedClass = await Class.findByIdAndUpdate(classId, { name, subjects, students, teachers }, { new: true });
        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json({ message: 'Class updated successfully' });
    } catch (error) {
        console.error('Error in updating class:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete class
export const deleteClass = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const classId = req.params.classId;
        const deletedClass = await Class.findByIdAndDelete(classId);
        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error in deleting class:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
