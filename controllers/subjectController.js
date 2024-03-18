import Subject from '../models/subject.js';

// Get all subjects
export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('teacher'); // Populate teacher details
        res.json(subjects);
    } catch (error) {
        console.error('Error in getting subjects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new subject
export const createSubject = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, teacher: teacherId } = req.body;
        const newSubject = new Subject({ name, teacher: teacherId });
        await newSubject.save();
        res.status(201).json({ message: 'Subject created successfully' });
    } catch (error) {
        console.error('Error in creating subject:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a subject by its ID
export const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.subjectId).populate('teacher'); // Populate teacher details
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json(subject);
    } catch (error) {
        console.error('Error in getting subject by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a subject
export const updateSubject = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, teacher: teacherId } = req.body;
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.subjectId, { name, teacher: teacherId }, { new: true });
        if (!updatedSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json({ message: 'Subject updated successfully' });
    } catch (error) {
        console.error('Error in updating subject:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a subject
export const deleteSubject = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const deletedSubject = await Subject.findByIdAndDelete(req.params.subjectId);
        if (!deletedSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error in deleting subject:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
