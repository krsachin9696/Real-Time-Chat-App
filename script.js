var socket = io();

const userNameNode = document.getElementById("userName");
const submitUserNameNode = document.getElementById("submitUserName");
const userNickNameLabelNode = document.getElementById("userNickNameLabel");

const searchFriendNode = document.getElementById("searchFriend");
const searchFriendButtonNode = document.getElementById("search");
const friendNickNameLabelNode = document.getElementById("friendNickNameLabel");

let user;

// search friend 

searchFriendButtonNode.addEventListener("click", function () {
  const friendName = searchFriendNode.value;
  // console.log(friendName);
  socket.emit("search friend", friendName);

  searchFriendNode.value = "";
});

socket.on("search friend", function (friendData) {
  console.log("hn bhai yja aa rha hai");
  if(friendData){
    friendNickNameLabelNode.innerText = friendData.nickName;

    startChat(friendData);
  } else {
    friendNickNameLabelNode.innerText = 
    "No such friend found";
  }
});

function startChat(friendData) {
  const chatBoxNode = document.getElementById("chatBox");

  const chatButtonNode = document.createElement("button");
  chatButtonNode.innerText = "chat with " + friendData.nickName;
  chatButtonNode.id = "chatButton";

  chatBoxNode.appendChild(chatButtonNode);

  chatButtonNode.addEventListener("click", function () {
    // const chat = document.createElement("ul");
    // chat.id = "form";
    // chatBoxNode.appendChild(chat);

    // const form_box = document.createElement("form");
    // form_box.id = "form";
    // const inp = document.createElement("input");
    // inp.id = "input";
    // const sendButton = document.createElement("button");
    // sendButton.innerText = "Send";

    // form_box.appendChild(inp);
    // form_box.appendChild(sendButton);

    // chatBoxNode.appendChild(form_box);

    // ..................................................................................................
    // const chat = document.createElement("ul");
    // chat.id = "chat";

    // const form_box = document.createElement("div");
    // form_box.id = "form";
    // const senderName = document.createElement("div");
    // senderName.className = "sender-name";
    // senderName.innerText = friendData.nickName; // Replace "Your Name" with the actual sender's name
    // const inp = document.createElement("input");
    // inp.id = "input";
    // inp.type = "text";
    // inp.placeholder = "Type your message...";
    // const sendButton = document.createElement("button");
    // sendButton.innerText = "Send";
    // sendButton.type = "button";

    // form_box.appendChild(inp);
    // form_box.appendChild(sendButton);

    // const whatsappDiv = document.getElementById("whatsapp");
    // whatsappDiv.appendChild(senderName);
    // whatsappDiv.appendChild(chat);
    // whatsappDiv.appendChild(form_box);

    
    // // send message

    // sendButton.addEventListener("click", function () {
    //   const msg = inp.value;

    //   socket.emit("chat message", {
    //     msg: msg,
    //     friendUserName: friendData.userName,
    //     sentBy: user,
    //   });
    //   inp.value = "";
    // });



    // ..................................................................................................................

    // var form = document.getElementById('form');
    // var input = document.getElementById('input');

    // form_box.addEventListener("submit", function (e){  // ye hmlog html form se ek event fire kr rhe h..
    //   console.log("form bhr rha ");
    //   e.preventDefault();                        // jo ki socket k through server pe jayega
      // if(input.value){
      //     socket.emit("chat message", input.value);
      //     input.value = "";
  
  
      //     // append message to our list 
  
      //     var item = document.createElement("li");
      //     item.textContent = input.value;
      //     messages.appendChild(item);
      //     item.style.textAlign = "right";
      //     window.scrollTo(0, document.body.scrollHeight);
      // }    
  //     const msg = input.value;
  //     socket.emit("chat message", {
  //       msg: msg,
  //       friendUserName: friendData.userName,
  //       sentBy: user,
  //     });
  //     input.value = "";
  // });

  createChatBox(friendData, socket);
  });
}

// handling incoming chat

// const chatList = {};

// let body;
// socket.on("chat message", function (chatData) {
//   if(!chatList[chatData.sentBy.userName]){
//     chatList[chatData.sentBy.userName] = true;

//     // create a chatbox and append in body


//   }
// })
const chatList = {};
// socket.on("chat message", function (chatData) {
//   if (!chatData || !chatData.sentBy || !chatData.sentBy.userName) {
//     console.log("Received invalid chat data:", chatData);
//     return;
//   }

//   const friendUserName = chatData.sentBy.userName;

//   // Check if the chat box for this friend exists
//   if (!chatList[friendUserName]) {
//     chatList[friendUserName] = true;

//     // Create a chat box for this friend
//     createChatBox(chatData.sentBy, socket);
//   }

//   // Find the chat box element for this friend
//   const chatBox = document.querySelector(`.chat-box[data-user-name="${friendUserName}"] .chat`);

//   // Create a new message element and append it to the chat box
//   const messageElement = document.createElement("li");
//   messageElement.innerText = chatData.msg;

//   // Determine whether the message is incoming or outgoing and set the appropriate class
//   messageElement.classList.add(chatData.sentBy.userName === user.userName ? "outgoing" : "incoming");

//   chatBox.appendChild(messageElement);

//   // Scroll to the bottom of the chat box to show the latest message
//   chatBox.scrollTop = chatBox.scrollHeight;
// });
socket.on("chat message", function (chatData) {
  if (!chatData || !chatData.sentBy || !chatData.sentBy.userName) {
    console.log("Received invalid chat data:", chatData);
    return;
  }

  const friendUserName = chatData.sentBy.userName;

  // Check if the chat box for this friend exists
  let chatBox = document.querySelector(`.chat-box[data-user-name="${friendUserName}"] .chat`);

  if (!chatBox) {
    // If the chat box doesn't exist, create it and append the message
    createChatBox(chatData.sentBy, socket);
    chatBox = document.querySelector(`.chat-box[data-user-name="${friendUserName}"] .chat`);
  }

  // Create a new message element and append it to the chat box
  const messageElement = document.createElement("li");
  messageElement.innerText = chatData.msg;

  // Determine whether the message is incoming or outgoing and set the appropriate class
  messageElement.classList.add(chatData.sentBy.userName === user.userName ? "outgoing" : "incoming");

  chatBox.appendChild(messageElement);

  // Scroll to the bottom of the chat box to show the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
});




// ..........................................................................................................
// update users

submitUserNameNode.addEventListener("click", function () {
  const userName = userNameNode.value;
  socket.emit("connect user", userName);

  userNameNode.value = "";
});

socket.on("user updated", function (userData){
  if(!userData.nickName){
    const nickName = prompt("NickName bta bhai");

    if(nickName){
      socket.emit("update user", {
        nickName: nickName,
        userName: userData.userName,
      });
    }
  }else {
    user = userData;
    userNickNameLabelNode.innerText = userData.nickName;
  }
});

socket.on("user updated nickname", function (userData){
  user = userData;
  userNickNameLabelNode.innerText = userData.nickName;
});



console.log("connect to hua hai");


// function createChatBox(friendData) {
//   const chatBoxNode = document.createElement("div");
//   chatBoxNode.className = "chat-box";
//   chatBoxNode.dataset.userName = friendData.userName;

//   const senderName = document.createElement("div");
//   senderName.className = "sender-name";
//   senderName.innerText = friendData.nickName;

//   const chat = document.createElement("ul");
//   chat.className = "chat";

//   const form_box = document.createElement("form");
//   form_box.className = "form-box";
//   const inp = document.createElement("input");
//   inp.className = "input";
//   inp.type = "text";
//   inp.placeholder = "Type your message...";
//   const sendButton = document.createElement("button");
//   sendButton.className = "send-button";
//   sendButton.innerText = "Send";
//   sendButton.type = "button";

//   form_box.appendChild(inp);
//   form_box.appendChild(sendButton);
//   chatBoxNode.appendChild(senderName);
//   chatBoxNode.appendChild(chat);
//   chatBoxNode.appendChild(form_box);

//   document.getElementById("whatsapp").appendChild(chatBoxNode);

//   // ... Rest of your code for handling sending messages ...
// }
function createChatBox(friendData, socket) {
  const chatBox = document.createElement("div");
  chatBox.id = "chat"; // Keep the same ID as in the provided code.
  chatBox.dataset.userName = friendData.userName;

  const form_box = document.createElement("div");
  form_box.id = "form"; // Keep the same ID as in the provided code.
  const senderName = document.createElement("div");
  senderName.className = "sender-name"; // Keep the same class name as in the provided code.
  senderName.innerText = friendData.nickName; // Replace "Your Name" with the actual sender's name
  // const msgList = document.createElement("ul");
  const inp = document.createElement("input");
  inp.id = "input"; // Keep the same ID as in the provided code.
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

  // send message
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
