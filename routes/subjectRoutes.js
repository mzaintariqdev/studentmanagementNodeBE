import express from 'express';
import { createSubject, deleteSubject, getAllSubjects, getSubjectById, updateSubject } from '../controllers/subjectController.js';
import authMiddleware from '../middleware/authMiddleware.js';


// creating a new router instance

const subjectRouter = express.Router()

// Routes for subjects
subjectRouter.get('/', authMiddleware, getAllSubjects);
subjectRouter.post('/', authMiddleware, createSubject);
subjectRouter.get('/:subjectId', authMiddleware, getSubjectById);
subjectRouter.put('/:subjectId', authMiddleware, updateSubject);
subjectRouter.delete('/:subjectId', authMiddleware, deleteSubject);

export default subjectRouter;