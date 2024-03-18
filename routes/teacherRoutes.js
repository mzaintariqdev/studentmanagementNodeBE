import express from 'express';
import { createTeacher, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from '../controllers/teacherController.js';
import authMiddleware from '../middleware/authMiddleware.js';


const teacherRouter = express.Router();

// Routes for teachers
teacherRouter.get('/', authMiddleware, getAllTeachers);
teacherRouter.post('/', authMiddleware, createTeacher);
teacherRouter.get('/:teacherId', authMiddleware, getTeacherById);
teacherRouter.put('/:teacherId', authMiddleware, updateTeacher);
teacherRouter.delete('/:teacherId', authMiddleware, deleteTeacher);

export default teacherRouter;