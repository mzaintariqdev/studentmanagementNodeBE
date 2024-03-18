import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/userRoutes.js';
import classRouter from './routes/classRoutes.js';
import connectDB from './configs/database.js';
import studentRouter from './routes/studentRoutes.js';
import teacherRouter from './routes/teacherRoutes.js';
import subjectRouter from './routes/subjectRoutes.js';


const PORT = process.env.PORT || 9000;
const app = express();
connectDB();

// Middleware
app.use(bodyParser.json());


// Routes
app.use('/auth', userRouter);
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);
app.use('/subjects', subjectRouter);
app.use('/classes', classRouter);

//  Server Start

app.listen(PORT ,()=>{
  console.log(`Server is running ${PORT}`)
})