import bcrypt from 'bcrypt';
import jwtConfig from '../configs/jwt.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import Teacher from '../models/teacher.js';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Save the user to the database
        await newUser.save();

        // If user's role is teacher, create a teacher profile
        if (role === 'teacher') {
            const newTeacher = new Teacher({
                user: newUser._id,
                subjects: [], // You can add subjects later if needed
                classes: []   // You can add classes later if needed
            });
            await newTeacher.save();
        }

        // Return success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if password is correct
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid password' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });
      const response = {
        userId: user._id,
        email: user.email,
        name: user.name ,
        role: user.role ,
        token,
      } 
      // Return token in response
      res.status(200).json({ response });
  } catch (error) {
      console.error('Error in logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
      const { email, newPassword } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      console.error('Error in resetting password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
      const userId = req.params.userId;
      const { name, email, password, role } = req.body;

      // Find user by ID
      let user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if email is being updated and already exists
      if (email && email !== user.email) {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
              return res.status(400).json({ message: 'Email already exists' });
          }
      }

      // Update user fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
      }
      if (role) user.role = role;

      // Save updated user
      await user.save();

      res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
      console.error('Error in updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find user by ID and delete
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get User
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find user by ID and delete
        const userData = await User.findById(userId);
        if(!userData){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: userData });
    } catch (error) {
        console.error('Error in Finding user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
