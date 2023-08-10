const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const socketServer = new Server(server);

const userBase = require("../userBase/users");

// express solves routing and middleware problems for developers
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/script.js", function (req, res) {
  res.sendFile(__dirname + "/script.js");
});



server.listen(3000, () => {
  console.log("server on port 3000");
});

socketServer.on("connection", function (socket) {
  socket.on("disconnect", function () {
    console.log("bhai chala gaya");
  });
  console.log("koi aa gaya maa");

  socket.on("connect user", updateConnectedUsers(socket));

  socket.on("update user", function (userData) {
    updateConnectedUsersName(socket, userData);
  });


  socket.on("search friend", function (friendName) {
    searchFriend(friendName, socket);
  });
  // socket.on("search friend", searchFriend(friendName, socket));

  socket.on("chat message", function (chatData) {
    // socketServer.emit("chat from server", msg);
    const friendData = userBase.getUser(chatData.friendUserName);

    friendData.connection.emit("chat message", chatData);
  })
});


function updateConnectedUsers(socket){
  return function (userName){
    let userData = userBase.getUser(userName);

    if(!userData){
      userData = userBase.setUserNames(socket, userName);
    }
    socket.emit("user updated", userData.data);
  };
}

function updateConnectedUsersName(socket, userData){
  const userName = userData.userName;

  userBase.updateUser(userName, userData);

  userData = userBase.getUser(userName);

  socket.emit("user updated nickname", userData.data);
}

function searchFriend(friendName, socket){
  const friendData = userBase.getUser(friendName);

  socket.emit("search friend", friendData?.data);   // friendData?.data: This is the data that is being sent along with the event. The ?. is the optional chaining operator, which is used to safeguard against potential null or undefined values. It checks if friendData is not null or undefined before trying to access the data property. If friendData is null or undefined, this expression will evaluate to undefine
}