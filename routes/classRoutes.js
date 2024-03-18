import express from 'express';
import { createClass, deleteClass, getAllClasses, getClassById, updateClass } from '../controllers/classController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// router instance Created
const classRouter = express.Router();

// routes for class-related operations
classRouter.get('/', authMiddleware, getAllClasses);
classRouter.post('/', authMiddleware, createClass);
classRouter.get('/:classId', authMiddleware, getClassById);
classRouter.put('/:classId', authMiddleware, updateClass);
classRouter.delete('/:classId', authMiddleware, deleteClass);

// Export the classRouter
export default classRouter;