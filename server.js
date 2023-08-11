const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const socketServer = new Server(server);

const userBase = require("./userBase/users");

// Set up Express routes
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/client.js", function (req, res) {
  res.sendFile(__dirname + "/client.js");
});

// Start the server
server.listen(3000, () => {
  console.log("server on port 3000");
});

// Socket.io connection handling
socketServer.on("connection", function (socket) {
  console.log("koi aa gaya maa");

  // Handle user disconnection
  socket.on("disconnect", function () {
    console.log("bhai chala gaya");
  });

  // Handle connecting user
  socket.on("connect user", updateConnectedUsers(socket));

  // Handle updating user data
  socket.on("update user", function (userData) {
    updateConnectedUsersName(socket, userData);
  });

  // Handle searching for a friend
  socket.on("search friend", function (friendName) {
    searchFriend(friendName, socket);
  });

  // Handle sending chat messages
  socket.on("chat message", function (chatData) {
    const friendData = userBase.getUser(chatData.friendUserName);
    friendData.connection.emit("chat message", chatData);
  });
});

// Helper function to update connected users
function updateConnectedUsers(socket) {
  return function (userName) {
    let userData = userBase.getUser(userName);

    if (!userData) {
      userData = userBase.setUserNames(socket, userName);
    }
    socket.emit("user updated", userData.data);
  };
}

// Helper function to update user's nickname
function updateConnectedUsersName(socket, userData) {
  const userName = userData.userName;
  userBase.updateUser(userName, userData);
  userData = userBase.getUser(userName);
  socket.emit("user updated nickname", userData.data);
}

// Helper function to search for a friend
function searchFriend(friendName, socket) {
  const friendData = userBase.getUser(friendName);
  socket.emit("search friend", friendData?.data);
}
