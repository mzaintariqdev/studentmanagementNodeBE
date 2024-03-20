import mongoose from 'mongoose';
import Subject from '../models/subject.js';
import Teacher from '../models/teacher.js';

// Get all subjects
export const getAllSubjects = async (req, res) => {
    
  let page =  req.query.page || 1;
  page = parseInt(page);
  let limit =  req.query.limit || 10;
  limit = parseInt(limit);
  const skip = (page -1)*limit;
  
    try {
        const subjects = await Subject.aggregate([
            {
                $sort: {
                    subjectName: 1,
                }
            },
            {
                $lookup: {
                    from: 'teachers',
                    localField: 'teacher',
                    foreignField: '_id',
                    as: 'teacherDetail'
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "teacherDetail.user",
                    foreignField: "_id",
                    as: "teacherData"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    subjectName: "$name",
                    teacherName: {
                        $cond: {
                            if: { $eq: [{ $size: "$teacherDetail" }, 0] }, // Check if teacherDetail is empty
                            then: null,
                            else: { $arrayElemAt: ["$teacherData.name", 0] }
                        }
                    }
                }
            },
            {
                $skip: skip,
              },
              {
                $limit: limit,
              }
        ]);

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

        const { name, teacher } = req.body;
        const newSubject = new Subject({ name, teacher });
        await newSubject.save();
        if(teacher){
            await Teacher.findByIdAndUpdate(
                teacher, // ID of the class
                { $push: { subjects: newSubject._id } }, // Add the new student to the subject array
                { new: true } // Return the updated class document
            );
        }
        res.status(201).json({ message: 'Subject created successfully' });
    } catch (error) {
        console.error('Error in creating subject:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a subject by its ID
export const getSubjectById = async (req, res) => {
    try {
        console.log(req.params.subjectId)
        const subjectId = new mongoose.Types.ObjectId(req.params.subjectId);
        const subject = await Subject.aggregate([
            {
                $match: {
                    _id: subjectId // Match against the converted ObjectId
                }
            },
            {
                $lookup: {
                    from : 'teachers',
                    as: 'teacherDetail',
                    localField: 'teacher',
                    foreignField: '_id',

                }
            },
            {
                $unwind: "$teacherDetail" // Unwind the teacherDetail array
              },
              {
                $lookup: {
                  from: "users", // Assuming your users collection is named "users"
                  localField: "teacherDetail.user",
                  foreignField: "_id",
                  as: "teacherData" // This will contain the matching user data
                }
              },
              {
                $unwind: "$teacherData" // Unwind the teacherData array
              },
              {
                $project: {
                  _id: 0,  
                  id: "$_id",
                  subjectName: "$name",
                  teacherName: "$teacherData.name" // Assuming the teacher's name is stored in the "name" field of the users collection
                }
              }
        ]);

        if (!subject || subject.length === 0) {
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
