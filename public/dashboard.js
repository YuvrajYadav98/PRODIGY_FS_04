// Check login
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
if(!token || !username){
  window.location.href = "/index.html"; // redirect if not logged in
}

document.getElementById("usernameDisplay").textContent = username;

// Sidebar buttons
const homeBtn = document.getElementById("homeBtn");
const createGroupBtn = document.getElementById("createGroupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const homeContent = document.getElementById("homeContent");
const chatContainer = document.getElementById("chatContainer");

const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

let socket;

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "/index.html";
});

// Show home content
homeBtn.addEventListener("click", () => {
  homeContent.style.display = "block";
  chatContainer.style.display = "none";
});

// Create / Open group chat
createGroupBtn.addEventListener("click", () => {
  homeContent.style.display = "none";
  chatContainer.style.display = "block";

  // Initialize socket only once
  if(!socket){
    socket = io();

    // Join group
    socket.emit("joinGroup", { username });

    // Load previous messages
    socket.on("previousMessages", (messages) => {
      messagesDiv.innerHTML = "";
      messages.forEach(({ sender, message }) => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${sender}:</strong> ${message}`;
        messagesDiv.appendChild(p);
      });
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    // Receive new messages
    socket.on("groupMessage", ({ sender, message }) => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${sender}:</strong> ${message}`;
      messagesDiv.appendChild(p);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    // Send message
    sendBtn.addEventListener("click", () => {
      const msg = msgInput.value.trim();
      if(msg){
        socket.emit("groupMessage", { message: msg });
        msgInput.value = "";
      }
    });

    msgInput.addEventListener("keypress", (e) => {
      if(e.key === "Enter") sendBtn.click();
    });
  }
});