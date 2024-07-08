document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Basic validation
  if (!username || !password) {
    alert("Username dan password wajib diisi.");
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Username: username, Password: password }),
    });

    if (response.ok) {
      const result = await response.json();
      alert(result.message);
      window.location.href = result.redirectUrl;
    } else {
      const result = await response.json();
      alert(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  }
});
