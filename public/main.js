const socket = io();

// Ask for username
let username = prompt("Enter your username");

// Join group
socket.emit("joinGroup", { username });

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("msgInput");
const button = document.getElementById("sendBtn");

// Send message
button.addEventListener("click", () => {
  const msg = input.value.trim();
  if(msg){
    socket.emit("groupMessage", { message: msg });
    input.value = "";
  }
});

// Receive message
socket.on("groupMessage", ({ sender, message }) => {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${sender}:</strong> ${message}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Send on Enter key
input.addEventListener("keypress", (e) => {
  if(e.key === "Enter") button.click();
});