// Redirect to login if not logged in
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
if(!token || !username){
  window.location.href = "/index.html";
}

const socket = io();

// Join group
socket.emit("joinGroup", { username });

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("msgInput");
const button = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Display previous messages
socket.on("previousMessages", (messages) => {
  messages.forEach(({ sender, message }) => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messagesDiv.appendChild(p);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Display new messages
socket.on("groupMessage", ({ sender, message }) => {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${sender}:</strong> ${message}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Send message
button.addEventListener("click", () => {
  const msg = input.value.trim();
  if(msg){
    socket.emit("groupMessage", { message: msg });
    input.value = "";
  }
});

// Enter key
input.addEventListener("keypress", (e) => {
  if(e.key === "Enter") button.click();
});

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "/index.html";
});