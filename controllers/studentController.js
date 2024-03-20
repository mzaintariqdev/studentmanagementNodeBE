import Class from '../models/class.js';
import Student from '../models/student.js';

// Get all students
export const getAllStudents = async (req, res) => {
    let page =  req.query.page || 1;
    page = parseInt(page);
    let limit =  req.query.limit || 10;
    limit = parseInt(limit);
    const skip = (page -1)*limit;

    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const students = await Student.aggregate([
            {
                $sort: {
                    name: 1
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'class',
                    foreignField: '_id',
                    as: 'class',
                }
            },
            {
                $addFields: {
                    class: { $arrayElemAt: ["$class", 0] }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$id',
                    name: "$name",
                    age: "$age",
                    class: "$class.name"
                }
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            }
        ]);
        
        res.json(students);
    } catch (error) {
        console.error('Error in getting students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new student
export const createStudent = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, age } = req.body;
        const classID = req.body.class;
        // Create the student
        const newStudent = new Student({ name, age, class: classID });
        await newStudent.save();

        // Update the corresponding Class model
        if(classID) {
            await Class.findByIdAndUpdate(
                classID, // ID of the class
                { $push: { students: newStudent._id } }, // Add the new student to the students array
                { new: true } // Return the updated class document
            );
        }

        res.status(201).json({ message: 'Student created successfully' });
    } catch (error) {
        console.error('Error in creating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Get a student by its ID
export const getStudentById = async (req, res) => {
    try {
        // No role check for reading student by ID

        const student = await Student.aggregate([
            {
                $addFields: {
                    _id: {
                        $toString: "$_id",
                    }
                }
            },
            {
                $match: {
                    _id:  req.params.studentId,
                }
            },
            {
                $addFields: {
                    _id: {
                        $toObjectId: "$_id",
                    }
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    foreignField: "_id",
                    localField: "class",
                    as: 'class'
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$id",
                    name: "$name",
                    age: "$age",
                    class: {
                        $first: "$class.name"
                    }
                }
            }
        ]);
        console.log(student)
        if (!student || student.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error('Error in getting student by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a student
export const updateStudent = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, age, class: classId } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(req.params.studentId, { name, age, class: classId }, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error in updating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a student
export const deleteStudent = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const deletedStudent = await Student.findByIdAndDelete(req.params.studentId);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error in deleting student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
