// Import required modules
import express from 'express';
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent
} from '../controllers/studentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Create a new router instance
const studentRouter = express.Router();

// Routes for students
studentRouter.get('/', authMiddleware, getAllStudents);
studentRouter.post('/', authMiddleware, createStudent);
studentRouter.get('/:studentId', authMiddleware, getStudentById);
studentRouter.put('/:studentId', authMiddleware, updateStudent);
studentRouter.delete('/:studentId', authMiddleware, deleteStudent);

export default studentRouter;