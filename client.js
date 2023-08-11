// Establish socket connection
var socket = io();

// Elements
const userNameNode = document.getElementById("userName");
const submitUserNameNode = document.getElementById("submitUserName");
const userNickNameLabelNode = document.getElementById("userNickNameLabel");

const searchFriendNode = document.getElementById("searchFriend");
const searchFriendButtonNode = document.getElementById("search");
const friendNickNameLabelNode = document.getElementById("friendNickNameLabel");

// User data
let user;

// Event listener for submitting user name
submitUserNameNode.addEventListener("click", function () {
  const userName = userNameNode.value;
  socket.emit("connect user", userName);
  userNameNode.value = "";
});

// Handle user updates
socket.on("user updated", function (userData) {
  if (!userData.nickName) {
    const nickName = prompt("NickName bta bhai");

    if (nickName) {
      socket.emit("update user", {
        nickName: nickName,
        userName: userData.userName,
      });
    }
  } else {
    user = userData;
    userNickNameLabelNode.innerText = userData.nickName;
  }
});

// Event listener for searching friends
searchFriendButtonNode.addEventListener("click", function () {
  const friendName = searchFriendNode.value;
  socket.emit("search friend", friendName);
  searchFriendNode.value = "";
});

// Handle search friend response
socket.on("search friend", function (friendData) {
  console.log("hn bhai yja aa rha hai");
  if (friendData) {
    friendNickNameLabelNode.innerText = friendData.nickName;
    startChat(friendData);
  } else {
    friendNickNameLabelNode.innerText = "No such friend found";
  }
});

// Start chat with friend
function startChat(friendData) {
  const chatBoxNode = document.getElementById("chatBox");

  const chatButtonNode = document.createElement("button");
  chatButtonNode.innerText = "chat with " + friendData.nickName;
  chatButtonNode.id = "chatButton";

  chatBoxNode.appendChild(chatButtonNode);

  chatButtonNode.addEventListener("click", function () {
    createChatBox(friendData, socket);
  });
}

// Create chat box and send messages
function createChatBox(friendData, socket) {
  const chatBox = document.createElement("div");
  chatBox.id = "chat";
  chatBox.dataset.userName = friendData.userName;

  const form_box = document.createElement("div");
  form_box.id = "form";
  const senderName = document.createElement("div");
  senderName.className = "sender-name";
  senderName.innerText = friendData.nickName;
  const inp = document.createElement("input");
  inp.id = "input";
  inp.type = "text";
  inp.placeholder = "Type your message...";
  const sendButton = document.createElement("button");
  sendButton.innerText = "Send";
  sendButton.type = "button";

  form_box.appendChild(inp);
  form_box.appendChild(sendButton);

  const whatsappDiv = document.getElementById("whatsapp");
  whatsappDiv.appendChild(senderName);
  whatsappDiv.appendChild(chatBox);
  whatsappDiv.appendChild(form_box);

  sendButton.addEventListener("click", function () {
    const msg = inp.value;

    socket.emit("chat message", {
      msg: msg,
      friendUserName: friendData.userName,
      sentBy: user,
    });
    inp.value = "";
  });
}

// Handle incoming chat messages
const chatList = {};

socket.on("chat message", function (chatData) {
  if (!chatData || !chatData.sentBy || !chatData.sentBy.userName) {
    console.log("Received invalid chat data:", chatData);
    return;
  }

  const friendUserName = chatData.sentBy.userName;

  let chatBox = document.querySelector(`.chat-box[data-user-name="${friendUserName}"] .chat`);

  if (!chatBox) {
    createChatBox(chatData.sentBy, socket);
    chatBox = document.querySelector(`.chat-box[data-user-name="${friendUserName}"] .chat`);
  }

  const messageElement = document.createElement("li");
  messageElement.innerText = chatData.msg;

  messageElement.classList.add(chatData.sentBy.userName === user.userName ? "outgoing" : "incoming");

  chatBox.appendChild(messageElement);

  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("user updated nickname", function (userData) {
  user = userData;
  userNickNameLabelNode.innerText = userData.nickName;
});

console.log("connect to hua hai");
