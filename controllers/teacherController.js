import Teacher from '../models/teacher.js';

// Get all teachers
export const getAllTeachers = async (req, res) => {
    let page =  req.query.page || 1;
    page = parseInt(page);
    let limit =  req.query.limit || 10;
    limit = parseInt(limit);
    const skip = (page -1)*limit;
    
    try {
        const teachers = await Teacher.aggregate([
            {
                $lookup: {
                    from: 'users',
                    as: 'user',
                    localField: 'user',
                    foreignField: '_id'
                }
            },
            {
                $lookup: {
                    from: 'subjects',
                    as: 'subjects',
                    localField: 'subjects',
                    foreignField: '_id'
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    as: 'classes',
                    localField: 'classes',
                    foreignField: '_id'
                }
            },
            {
                $addFields: {
                    name: { $first: "$user.name" },
                    email: { $first: "$user.email" },
                    classes: {
                        $cond: {
                            if: { $gt: [{ $size: "$classes" }, 0] },
                            then: {
                                $map: {
                                    input: "$classes",
                                    as: "class",
                                    in: { id: "$$class._id", name: "$$class.name" }
                                }
                            },
                            else: []
                        }
                    },
                    subjects: {
                        $cond: {
                            if: { $gt: [{ $size: "$subjects" }, 0] },
                            then: {
                                $map: {
                                    input: "$subjects",
                                    as: "subject",
                                    in: { id: "$$subject._id", name: "$$subject.name" }
                                }
                            },
                            else: []
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: "$name",
                    email: "$email",
                    classes: 1,
                    subjects: 1
                }
            },
                {
                $skip: skip,
              },
              {
                $limit: limit,
              }
        ]);
        
        res.json(teachers);
    } catch (error) {
        console.error('Error in getting teachers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new teacher
export const createTeacher = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { user: userId, subjects, classes } = req.body;
        const newTeacher = new Teacher({ user: userId, subjects, classes });
        await newTeacher.save();
        res.status(201).json({ message: 'Teacher created successfully' });
    } catch (error) {
        console.error('Error in creating teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a teacher by their ID
export const getTeacherById = async (req, res) => {
    try {
        // const teacher = await Teacher.findById(req.params.teacherId).populate('user', 'name email'); // Populate user details
        const teacher = await Teacher.aggregate([
            {
                $addFields: {
                    _id: {
                        $toString: "$_id"
                    }
                }
            },
            {
                $match:{
                    _id: req.params.teacherId
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
                    from: 'users',
                    as: 'user',
                    localField: 'user',
                    foreignField: '_id',
                }
            },
            {
                $addFields: {
                    user: { $first: '$user' } // Extract user object from the array
                }
            },
            {
                $lookup: {
                    from: 'subjects',
                    as: 'subjects',
                    localField: 'subjects',
                    foreignField: '_id',
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    as: 'classes',
                    localField: 'classes',
                    foreignField: '_id',
                }
            },
            {
                $addFields: {
                    classes: {
                        $cond: {
                            if: { $gt: [{ $size: "$classes" }, 0] },
                            then: {
                                $map: {
                                    input: "$classes",
                                    as: "class",
                                    in: { id: "$$class._id", name: "$$class.name" }
                                }
                            },
                            else: []
                        }
                    },
                    subjects: {
                        $cond: {
                            if: { $gt: [{ $size: "$subjects" }, 0] },
                            then: {
                                $map: {
                                    input: "$subjects",
                                    as: "subject",
                                    in: { id: "$$subject._id", name: "$$subject.name" }
                                }
                            },
                            else: []
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: '$user.name',
                    email: '$user.email',
                    subjects: 1,
                    classes: 1
                }
            }
        ]);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (error) {
        console.error('Error in getting teacher by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a teacher
export const updateTeacher = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { user: userId, subjects, classes } = req.body;
        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.teacherId, { user: userId, subjects, classes }, { new: true });
        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher updated successfully' });
    } catch (error) {
        console.error('Error in updating teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a teacher
export const deleteTeacher = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.teacherId);
        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error in deleting teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
