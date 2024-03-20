import Class from '../models/class.js';
import Teacher from '../models/teacher.js';

// Get all classes
export const getAllClasses = async (req, res) => {
    let page =  req.query.page || 1;
    page = parseInt(page);
    let limit =  req.query.limit || 10;
    limit = parseInt(limit);
    const skip = (page -1)*limit;

    try {
        // Check user role
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const classes = await Class.aggregate([
            {
                $lookup: {
                    from: 'teachers',
                    localField: 'teachers',
                    foreignField: '_id',
                    as: 'teachers'
                }
            },
            {
                $lookup: {
                    from: 'students',
                    localField: 'students',
                    foreignField: '_id',
                    as: 'students'
                }
            },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subjects',
                    foreignField: '_id',
                    as: 'subjects'
                }
            },
            {
                $unwind: {
                    path: "$teachers",
                    preserveNullAndEmptyArrays: true // Preserve documents with empty or missing teachers arrays
                }
            },
            {
                $lookup: {
                    from: 'users', // Assuming the user field is a reference to the users collection
                    localField: 'teachers.user',
                    foreignField: '_id',
                    as: 'teacherUser'
                }
            },
            {
                $addFields: {
                    students: {
                        $cond: {
                            if: { $gt: [{$size: "$students"},0]},
                            then: {
                                $map: {
                                    input: "$students",
                                    as: "student",
                                    in: {id: "$$student._id", name: "$$student.name" , age: "$$student.age" }
                                }
                            },
                            else: []
                        }
                    },
                    subjects: {
                        $cond: {
                            if: { $gt: [{$size: "$subjects"}, 0] },
                            then: {
                                $map: {
                                   input: "$subjects",
                                   as: "subject",
                                   in: { id: "$$subject._id", name: "$$subject.name" } 
                                }
                            },
                            else: []
                        }
                    },
                    teachersData: {
                        $cond: {
                            if: { $gt: [{$size: "$teacherUser"}, 0] },
                            then: {
                                $map: {
                                   input: "$teacherUser",
                                   as: "teacherUs",
                                   in: { id: "$$teacherUs._id", name: "$$teacherUs.name" } 
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
                    students: "$students",
                    subjects: "$subjects",
                    teachers: "$teachersData"
                }
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            }
        ]);
        
        res.status(200).json(classes);
    } catch (error) {
        console.error('Error in getting all classes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a class
export const createClass = async (req, res) => {
    try {
        // Check user role
        console.log(req)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { name, subjects, students, teachers } = req.body;
        const newClass = new Class({ name, subjects, students, teachers });
        await newClass.save();
        // If teachers are provided, update the class of all mentioned teachers
        if (teachers && teachers.length > 0) {
            await Promise.all(teachers.map(async (teacherId) => {
                await Teacher.findByIdAndUpdate(
                    teacherId,
                    { classes: newClass._id },
                    { new: true }
                );
            }));
        }
        res.status(201).json({ message: 'Class created successfully' });
    } catch (error) {
        console.error('Error in creating class:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get class by ID
export const getClassById = async (req, res) => {
    try {
        const classId = req.params.classId;
        const classData = await Class.aggregate([
            {
                $addFields: {
                    _id: {
                        $toString: "$_id"
                    }
                }
            },
            {
                $match: {
                    _id: classId
                }
            },
            {
                $addFields: {
                    _id: {
                        $toObjectId: "$_id"
                    }
                }
            },
            {
                $lookup: {
                    from: 'teachers',
                    localField: 'teachers',
                    foreignField: '_id',
                    as: 'teachers'
                }
            },
            {
                $lookup: {
                    from: 'students',
                    localField: 'students',
                    foreignField: '_id',
                    as: 'students'
                }
            },
            {
                $lookup: {
                    from: 'subjects',
                    localField: 'subjects',
                    foreignField: '_id',
                    as: 'subjects'
                }
            },
            {
                $unwind: {
                    path: "$teachers",
                    preserveNullAndEmptyArrays: true // Preserve documents with empty or missing teachers arrays
                }
            },
            {
                $lookup: {
                    from: 'users', // Assuming the user field is a reference to the users collection
                    localField: 'teachers.user',
                    foreignField: '_id',
                    as: 'teacherUser'
                }
            },
            {
                $addFields: {
                    students: {
                        $cond: {
                            if: { $gt: [{$size: "$students"},0]},
                            then: {
                                $map: {
                                    input: "$students",
                                    as: "student",
                                    in: {id: "$$student._id", name: "$$student.name" , age: "$$student.age" }
                                }
                            },
                            else: []
                        }
                    },
                    subjects: {
                        $cond: {
                            if: { $gt: [{$size: "$subjects"}, 0] },
                            then: {
                                $map: {
                                   input: "$subjects",
                                   as: "subject",
                                   in: { id: "$$subject._id", name: "$$subject.name" } 
                                }
                            },
                            else: []
                        }
                    },
                    teachersData: {
                        $cond: {
                            if: { $gt: [{$size: "$teacherUser"}, 0] },
                            then: {
                                $map: {
                                   input: "$teacherUser",
                                   as: "teacherUs",
                                   in: { id: "$$teacherUs._id", name: "$$teacherUs.name" } 
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
                    students: "$students",
                    subjects: "$subjects",
                    teachers: "$teachersData"
                }
            },
        ]);
        if (!classData || classData.length===0) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json(classData);
    } catch (error) {
        console.error('Error in getting class by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update class
export const updateClass = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const classId = req.params.classId;
        const { name, subjects, students, teachers } = req.body;
        // new make sure we get updated doc not the previous version in response 
        const updatedClass = await Class.findByIdAndUpdate(classId, { name, subjects, students, teachers }, { new: true });
        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json({ message: 'Class updated successfully' });
    } catch (error) {
        console.error('Error in updating class:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete class
export const deleteClass = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const classId = req.params.classId;
        const deletedClass = await Class.findByIdAndDelete(classId);
        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error in deleting class:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
