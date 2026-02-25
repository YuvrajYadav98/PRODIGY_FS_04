const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

// Models
const Message = require("./models/Message");

// Serve public folder outside backend
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// Routes
app.use("/api/auth", require("./routes/auth"));

app.use(express.static(path.join(__dirname, "../public")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New user connected");

  // Join group
  socket.on("joinGroup", async ({ username }) => {
    socket.username = username;

    // Broadcast new user joined
    io.emit("groupMessage", { sender: "System", message: `${username} joined the chat` });

    // Send previous messages to new user
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100); // last 100 messages
    socket.emit("previousMessages", messages);
  });

  // Receive and broadcast message
  socket.on("groupMessage", async ({ message }) => {
    if(!socket.username) return;

    const msg = { sender: socket.username, message };
    const newMsg = new Message(msg);
    await newMsg.save();

    io.emit("groupMessage", msg);
  });

  socket.on("disconnect", () => {
    if(socket.username){
      io.emit("groupMessage", { sender: "System", message: `${socket.username} left the chat` });
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));