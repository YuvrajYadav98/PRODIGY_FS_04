const form = document.getElementById("registerForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if(res.ok){
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      window.location.href = "/chat.html";
    } else {
      errorMsg.textContent = data.message;
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Something went wrong";
  }
});