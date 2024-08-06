const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require("cors");
// const multer = require('multer');
// const upload = multer();

const StudentModel = require('./models/studentSchema');

const TutorModel = require('./models/tutorSchema');
const ConnectionRequestModel = require('./models/connectionRequestSchema');
const NotificationModel = require('./models/notificationSchema');
const ChatModel = require("./models/chatSchema")
const MessageModel = require("./models/messageSchema")

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, ref: 'Tutor', required: true },
  image:{type:String},
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);




const app = express();

const PORT = process.env.PORT || 3000;

// app.use(upload.single('profilePic'));
app.use(cors())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/expertlocation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      req.userId = decoded.userId;
      req.username = decoded.username;
      next();
    });
  };


app.post('/posts', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const tutor = await TutorModel.findOne({ _id: userId });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const { content,image } = req.body;
   
    const newPost = new Post({
      content,
      image:image,
      author: tutor.username, // Set the author as the tutor's username
    });

     console.log(newPost)
    // Save the post to the database
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/posts', async (req, res) => {
    try {
      const posts = await Post.find({}) // Populate the 'author' field with the 'username' property
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.post('/students/register', async (req, res) => {
    try {
      const { username, password, email,  } = req.body;

      const existingStudent = await StudentModel.findOne({ $or: [{ username }, { email }] });
      if (existingStudent) {
        return res.status(400).json({ message: 'Username or email already exists. Choose a different one.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = new StudentModel({
        username,
        password:hashedPassword,
        email
      });

      const savedStudent = await newStudent.save();

      res.status(201).json({ message: 'Student registered successfully', student: savedStudent,route:"s" });
    } catch (error) {
      console.error('Error registering student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post('/students/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const student = await StudentModel.findOne({ username });
      if (!student) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, student.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      const token = jwt.sign({ userId: student._id, username: student.username }, 'your_secret_key', { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post('/students/update-info', verifyToken, async (req, res) => {
    try {

      const { about, contact, address,profilePic } = req.body;

      const userId = req.userId;

      const updatedStudent = await StudentModel.findByIdAndUpdate(
        userId,
        { $set: { about, contact, address, profilePic } },
        { new: true }
      );

      res.status(200).json({ message: 'Additional information updated successfully', student: updatedStudent });
    } catch (error) {
      console.error('Error updating student information:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/students/profile', verifyToken, async (req, res) => {
    try {
      const userId = req.userId;

      const student = await StudentModel.findById(userId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.status(200).json({ message: 'Profile details retrieved successfully', profile: student });
    } catch (error) {
      console.error('Error fetching student profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/tutors/register', async (req, res) => {
    try {
      const { username, contact, password, location, profilePic, about, email, address, domain, certifications, experience, skills } = req.body;

      const existingTutor = await TutorModel.findOne({ $or: [{ username }, { email }] });
      if (existingTutor) {
        return res.status(400).json({ message: 'Username or email already exists. Choose a different one.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newTutor = new TutorModel({
        username,
        password: hashedPassword,
        email,
      });

      const savedTutor = await newTutor.save();
      res.status(201).json({ message: 'Tutor registered successfully',});
    } catch (error) {
      console.error('Error registering tutor:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/tutors/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const tutor = await TutorModel.findOne({ username });
    if (!tutor) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, tutor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: tutor._id, username: tutor.username }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in tutor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/tutors/profile', async (req, res) => {
  try {
    const { userId } = req.query; // Corrected from req.quer to req.query
    console.log(req.query);

    const tutor = await TutorModel.findById(userId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.status(200).json({ message: 'Tutor profile details retrieved successfully', profile: tutor });
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/tutors/profile/1', verifyToken, async (req, res) => {
  try {
      const userId = req.userId; 

    const tutor = await TutorModel.findById(userId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    res.status(200).json({ message: 'Tutor profile details retrieved successfully', profile: tutor });
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/tutors/update-info', verifyToken,  async (req, res) => {
  try {
    const { about, contact, address, domain, certifications, experience, skills,profilePic,latitude,longitude} = req.body;
    const userId = req.userId;

    let updatedTutorData = { about, contact, address, domain, certifications, experience, skills,profilePic,latitude,longitude };

    // Check if a profile picture is uploaded
    // if (req.file) {
    //   updatedTutorData.profilePic = req.file.buffer;
    // }

    const updatedTutor = await TutorModel.findByIdAndUpdate(
      userId,
      { $set: updatedTutorData },
      { new: true }
    );

    res.status(200).json({ message: 'Additional information updated successfully', tutor: updatedTutor });
  } catch (error) {
    console.error('Error updating tutor information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/students/new-tutors', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const student = await StudentModel.findById(userId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch connection requests where the student is the requester and the status is pending
    const sentConnectionRequests = await ConnectionRequestModel.find({
      studentId: userId,
      status: 'pending',
    });

    // Extract tutor IDs from the pending connection requests
    const sentTutorIds = sentConnectionRequests.map((connection) => connection.tutorId);

    // Fetch connected tutors
    const connectedTutors = await ConnectionRequestModel.find({
      $or: [
        { studentId: userId, status: 'accepted' },
        { tutorId: userId, status: 'accepted' },
      ],
    });

    // Extract connected tutor IDs
    const connectedTutorIds = connectedTutors.map((connection) => connection.tutorId);

    // Fetch new tutors (not connected or pending connection)
    const newTutors = await TutorModel.find({
      _id: { $nin: [...connectedTutorIds, ...sentTutorIds] },
    });

    res.status(200).json({ message: 'New tutors retrieved successfully', newTutors });
  } catch (error) {
    console.error('Error fetching new tutors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/students/connected-tutors', verifyToken, async (req, res) => {
  try {
      const userId = req.userId;

      const student = await StudentModel.findById(userId);
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      const acceptedConnections = await ConnectionRequestModel.find({
          studentId: userId,
          status: 'accepted',
      });

      const connectedTutorIds = acceptedConnections.map(connection => connection.tutorId);

      const connectedTutors = await TutorModel.find({ _id: { $in: connectedTutorIds } });

      res.status(200).json({ message: 'Connected tutors retrieved successfully', connectedTutors });
  } catch (error) {
      console.error('Error fetching connected tutors:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/students/send-connection-request/:tutorId', verifyToken, async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { userId } = req;

    const tutor = await TutorModel.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    const existingRequest = await ConnectionRequestModel.findOne({
      studentId: userId,
      tutorId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    const connectionRequest = new ConnectionRequestModel({
      studentId: userId,
      tutorId,
      status: 'pending', 
    });

    const savedConnectionRequest = await connectionRequest.save();

    const notification = new NotificationModel({
      userId: tutorId,
      senderId: userId,
      message: 'Connection request received',
    });

    const savedNotification = await notification.save();

    res.status(200).json({
      message: 'Connection request sent successfully',
      connectionRequest: savedConnectionRequest,
      notification: savedNotification,
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/students/notifications', verifyToken, async (req, res) => {
  try {
    const studentId = req.userId; // Assuming userId is the student's ID

    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const studentNotifications = await NotificationModel.find({ userId: studentId });

    const uniqueNotifications = Array.from(
      new Set(
        studentNotifications.map(
          (notification) => `${notification._id}-${notification.senderId || ''}-${notification.message || ''}-${notification.createdAt}`
        )
      )
    );

    const notificationsWithSenderInfo = await Promise.all(
      uniqueNotifications.map(async (uniqueKey) => {
        const [notificationId, senderId, message, createdAt] = uniqueKey.split('-');
        if (senderId) {
          const sender = await TutorModel.findById(senderId);
          if (sender) {
            return {
              notificationId,
              message: `Connection request accepted by ${sender.username}`,
              timestamp: createdAt, // Replace 'createdAt' with the actual timestamp field in the sender model
              // Include any other fields you want in the response
            };
          }
        }
        return { notificationId, message };
      })
    );

    res.status(200).json({
      message: 'Student notifications retrieved successfully',
      notifications: notificationsWithSenderInfo,
    });
  } catch (error) {
    console.error('Error fetching student notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/tutors/notifications', verifyToken, async (req, res) => {
  try {
    const tutorId = req.userId; // Assuming userId is the tutor's ID

    const tutor = await TutorModel.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    const tutorNotifications = await NotificationModel.find({ userId: tutorId });

    const uniqueNotifications = Array.from(
      new Set(
        tutorNotifications.map(
          (notification) => `${notification._id}-${notification.senderId || ''}-${notification.message || ''}-${notification.createdAt}`
        )
      )
    );

    const notificationsWithSenderInfo = await Promise.all(
      uniqueNotifications.map(async (uniqueKey) => {
        const [notificationId, senderId, message, createdAt] = uniqueKey.split('-');
        if (senderId) {
          const sender = await StudentModel.findById(senderId);
          if (sender) {
            return {
              notificationId,
              message: `Connection request from ${sender.username}`,
              timestamp: createdAt, // Replace 'createdAt' with the actual timestamp field in the sender model
              // Include any other fields you want in the response
            };
          }
        }
        return { notificationId, message };
      })
    );

    res.status(200).json({
      message: 'Tutor notifications retrieved successfully',
      notifications: notificationsWithSenderInfo,
    });
  } catch (error) {
    console.error('Error fetching tutor notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/accept-connection-request/:notificationId', async (req, res) => {
  const notificationId = req.params.notificationId;

  try {
    const notification = await NotificationModel.findById(notificationId);


    if (!notification) {
      console.log("enter")
      return res.status(404).json({ error: 'Notification not found or already read.' });
    }

    // Mark the notification as read
    notification.isRead = true;
    await notification.save();

    // Get the connection request associated with the notification
    const connectionRequest = await ConnectionRequestModel.findOne({
      studentId: notification.senderId,
      tutorId: notification.userId,
      status: 'pending',
    });

    console.log(connectionRequest)

    if (!connectionRequest) {
      return res.status(404).json({ error: 'Connection request not found or already accepted/rejected.' });
    }

    // Update connection request status
    connectionRequest.status = 'accepted';
    await connectionRequest.save();

    // Send a new notification to the student
    const newNotification = new NotificationModel({
      userId: connectionRequest.studentId,
      senderId: connectionRequest.tutorId,
      message: 'Your connection request has been accepted. You can now start interacting with the tutor.',
    });

    await newNotification.save();

    await NotificationModel.deleteOne({ _id: notificationId });

    return res.status(200).json({ message: 'Connection request accepted, and new notification sent.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/students/connected-tutors', verifyToken, async (req, res) => {
  try {
    const studentId = req.userId;


    const connectionRequests = await ConnectionRequestModel.find({
      studentId,
      status: 'accepted',
    });


    const connectedTutorIds = connectionRequests.map((request) => request.tutorId);


    const connectedTutors = await TutorModel.find({ _id: { $in: connectedTutorIds } });


    const connectedTutorsInfo = connectedTutors.map((tutor) => ({
      tutorId: tutor._id,
      username: tutor.username,

    }));

    res.status(200).json({
      message: 'Connected tutors retrieved successfully',
      connectedTutors: connectedTutorsInfo,
    });
  } catch (error) {
    console.error('Error fetching connected tutors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/tutors/connected-students', verifyToken, async (req, res) => {
  try {
    const tutorId = req.userId; 


    const connectionRequests = await ConnectionRequestModel.find({
      tutorId,
      status: 'accepted',
    });

    const connectedStudentIds = connectionRequests.map((request) => request.studentId);

    const connectedStudents = await StudentModel.find({ _id: { $in: connectedStudentIds } });


    const connectedStudentsInfo = connectedStudents.map((student) => ({
      _id: student._id,
      username: student.username,
      profilePic:student.profilePic
    }));

    res.status(200).json({
      message: 'Connected students retrieved successfully',
      connectedStudents: connectedStudentsInfo,
    });
  } catch (error) {
    console.error('Error fetching connected students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/send-message', verifyToken, async (req, res) => {
  console.log("ok")
  try {
    const { receiverId, content } = req.body;
    const senderId = req.userId;

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      content,
    });

  
    await newMessage.save();


    const chat = await ChatModel.findOneAndUpdate(
      {
        $or: [
          { studentId: senderId, tutorId: receiverId },
          { studentId: receiverId, tutorId: senderId },
        ],
      },
      { $push: { messages: newMessage._id } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/get-messages', verifyToken, async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.query.receiverId;

    const messages = await MessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });


    const sender = await StudentModel.findById(senderId) || await TutorModel.findById(senderId);
    const receiver = await StudentModel.findById(receiverId) || await TutorModel.findById(receiverId);

    res.status(200).json({
      message: 'Messages retrieved successfully',
      sender,
      receiver,
      messages,
    });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
