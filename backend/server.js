require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    organizationName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// User Model
const User = mongoose.model('User', userSchema);

// Student Schema
const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNo: { type: String, required: true },
    enrollmentNo: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    dateOfBirth: { type: String },
    address: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

// Teacher Schema
const teacherSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNo: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    qualification: { type: String },
    dateOfBirth: { type: String },
    address: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const Teacher = mongoose.model('Teacher', teacherSchema);

// Class Schema
const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    classTeacher: { type: String, required: true },
    section: { type: String },
    roomNumber: { type: String },
    totalStudents: { type: Number, required: true },
    startTime: { type: String },
    endTime: { type: String },
    capacity: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const Class = mongoose.model('Class', classSchema);

// Subject Schema
const subjectSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true },
    subjectCode: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    creditHours: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);

// Student Attendance Schema
const studentAttendanceSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    enrollmentNo: { type: String, required: true },
    className: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent', 'leave'], required: true },
  },
  { timestamps: true }
);

const StudentAttendance = mongoose.model('StudentAttendance', studentAttendanceSchema);

// Staff Attendance Schema
const staffAttendanceSchema = new mongoose.Schema(
  {
    staffName: { type: String, required: true },
    employeeId: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent', 'leave', 'on-duty'], required: true },
  },
  { timestamps: true }
);

const StaffAttendance = mongoose.model('StaffAttendance', staffAttendanceSchema);

// Event Schema
const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, enum: ['holiday', 'school-event', 'exam', 'meeting', 'other'], required: true },
    description: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

// Routes

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, organizationName, email, mobileNo, password } = req.body;

    // Validation
    if (!fullName || !organizationName || !email || !mobileNo || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email' });
    }

    if (mobileNo.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid mobile number' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      organizationName,
      email,
      mobileNo,
      password,
    });

    await newUser.save();
    console.log('✅ User created:', email);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        organizationName: newUser.organizationName,
        email: newUser.email,
        mobileNo: newUser.mobileNo,
      },
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Error creating account', details: error.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email not found. Please sign up first' });
    }

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    console.log('✅ User logged in:', email);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        organizationName: user.organizationName,
        email: user.email,
        mobileNo: user.mobileNo,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Error during login', details: error.message });
  }
});

// Get user by email (for verification)
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        organizationName: user.organizationName,
        email: user.email,
        mobileNo: user.mobileNo,
      },
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// STUDENT ROUTES
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating student' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Error updating student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting student' });
  }
});

// TEACHER ROUTES
app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teachers' });
  }
});

app.post('/api/teachers', async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(500).json({ error: 'Error creating teacher' });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Error updating teacher' });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting teacher' });
  }
});

// CLASS ROUTES
app.get('/api/classes', async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching classes' });
  }
});

app.post('/api/classes', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: 'Error creating class' });
  }
});

app.put('/api/classes/:id', async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(classData);
  } catch (error) {
    res.status(500).json({ error: 'Error updating class' });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting class' });
  }
});

// SUBJECT ROUTES
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subjects' });
  }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ error: 'Error creating subject' });
  }
});

app.put('/api/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Error updating subject' });
  }
});

app.delete('/api/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting subject' });
  }
});

// STUDENT ATTENDANCE ROUTES
app.get('/api/attendance/students', async (req, res) => {
  try {
    const attendance = await StudentAttendance.find();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching student attendance' });
  }
});

app.post('/api/attendance/students', async (req, res) => {
  try {
    const newAttendance = new StudentAttendance(req.body);
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ error: 'Error creating student attendance' });
  }
});

app.put('/api/attendance/students/:id', async (req, res) => {
  try {
    const attendance = await StudentAttendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Error updating student attendance' });
  }
});

app.delete('/api/attendance/students/:id', async (req, res) => {
  try {
    await StudentAttendance.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student attendance deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting student attendance' });
  }
});

// STAFF ATTENDANCE ROUTES
app.get('/api/attendance/staff', async (req, res) => {
  try {
    const attendance = await StaffAttendance.find();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching staff attendance' });
  }
});

app.post('/api/attendance/staff', async (req, res) => {
  try {
    const newAttendance = new StaffAttendance(req.body);
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ error: 'Error creating staff attendance' });
  }
});

app.put('/api/attendance/staff/:id', async (req, res) => {
  try {
    const attendance = await StaffAttendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Error updating staff attendance' });
  }
});

app.delete('/api/attendance/staff/:id', async (req, res) => {
  try {
    await StaffAttendance.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Staff attendance deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting staff attendance' });
  }
});

// EVENT ROUTES
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating event' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
});

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
