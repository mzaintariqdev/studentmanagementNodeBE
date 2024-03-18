import express from 'express';
import {
  deleteUser,
  getUserById,
  loginUser,
  registerUser,
  resetPassword,
  updateUser
} from '../controllers/userController.js';

// router instance Created
const userRouter = express.Router();

// routes for user-related operations
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/reset-password', resetPassword);
userRouter.get('/:userId', getUserById);
userRouter.put('/:userId', updateUser);
userRouter.delete('/:userId', deleteUser);

// Export the userRouter
export default userRouter;