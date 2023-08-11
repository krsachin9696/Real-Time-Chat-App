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
submitUserNameNode.addEventListener("click", async function () {
  try {
    const userName = userNameNode.value;
    await socket.emit("connect user", userName);
    userNameNode.value = "";
  } catch (error) {
    console.error("Error connecting user:", error);
  }
});

// Handle user updates
socket.on("user updated", function (userData) {
  try {
    if (!userData.nickName) {
      const nickName = prompt("Enter NickName:");

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
  } catch (error) {
    console.error("Error updating user:", error);
  }
});

// Event listener for searching friends
searchFriendButtonNode.addEventListener("click", async function () {
  try {
    const friendName = searchFriendNode.value;
    await socket.emit("search friend", friendName);
    searchFriendNode.value = "";
  } catch (error) {
    console.error("Error searching friend:", error);
  }
});

// Handle search friend response
socket.on("search friend", function (friendData) {
  try {
    if (friendData) {
      friendNickNameLabelNode.innerText = friendData.nickName;
      startChat(friendData);
    } else {
      friendNickNameLabelNode.innerText = "No such friend found";
    }
  } catch (error) {
    console.error("Error handling search friend response:", error);
  }
});

// Start chat with friend
function startChat(friendData) {
  try {
    const chatBoxNode = document.getElementById("chatBox");

    const chatButtonNode = document.createElement("button");
    chatButtonNode.innerText = "Chat with " + friendData.nickName;
    chatButtonNode.id = "chatButton";

    chatBoxNode.appendChild(chatButtonNode);

    chatButtonNode.addEventListener("click", function () {
      createChatBox(friendData, socket);
    });
  } catch (error) {
    console.error("Error starting chat:", error);
  }
}

// Create chat box and send messages
function createChatBox(friendData, socket) {
  try {
    const chatBoxId = "chat-" + friendData.userName;
    let chatBox = document.getElementById(chatBoxId);

    if (!chatBox) {
      chatBox = document.createElement("div");
      chatBox.id = chatBoxId;
      chatBox.className = "chat-box";
      chatBox.dataset.userName = friendData.userName;

      const senderName = document.createElement("div");
      senderName.className = "sender-name";
      senderName.innerText = friendData.nickName;

      const chat = document.createElement("ul");
      chat.className = "chat";

      const form_box = document.createElement("div");
      form_box.className = "form-box";
      const inp = document.createElement("input");
      inp.className = "input";
      inp.type = "text";
      inp.placeholder = "Type your message...";
      const sendButton = document.createElement("button");
      sendButton.className = "send-button";
      sendButton.innerText = "Send";
      sendButton.type = "button";

      form_box.appendChild(inp);
      form_box.appendChild(sendButton);

      chatBox.appendChild(senderName);
      chatBox.appendChild(chat);
      chatBox.appendChild(form_box);

      const whatsappDiv = document.getElementById("whatsapp");
      whatsappDiv.appendChild(chatBox);

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
  } catch (error) {
    console.error("Error creating chat box:", error);
  }
}

// Handle incoming chat messages
socket.on("chat message", function (chatData) {
  try {
    if (!chatData || !chatData.sentBy || !chatData.sentBy.userName) {
      console.log("Received invalid chat data:", chatData);
      return;
    }

    const friendUserName = chatData.sentBy.userName;
    const chatBoxId = "chat-" + friendUserName;
    let chatBox = document.getElementById(chatBoxId);

    if (!chatBox) {
      // Create chat box if it doesn't exist (optional)
      createChatBox(chatData.sentBy, socket);
      chatBox = document.getElementById(chatBoxId);
    }

    const messageElement = document.createElement("li");
    messageElement.innerText = chatData.msg;

    messageElement.classList.add(chatData.sentBy.userName === user.userName ? "outgoing" : "incoming");

    chatBox.querySelector(".chat").appendChild(messageElement);

    chatBox.querySelector(".chat").scrollTop = chatBox.scrollHeight;
  } catch (error) {
    console.error("Error handling chat message:", error);
  }
});

socket.on("user updated nickname", function (userData) {
  try {
    user = userData;
    userNickNameLabelNode.innerText = userData.nickName;
  } catch (error) {
    console.error("Error updating user nickname:", error);
  }
});

console.log("Connected to the server.");
