const API_URL = "http://localhost:3000/api/users";

async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error al registrarse");
      return;
    }

    alert("Registro exitoso");
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert("Error conectando con el servidor");
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Credenciales incorrectas");
      return;
    }

    localStorage.setItem("sessionUser", JSON.stringify(data));

    window.location.href = "principal.html";

  } catch (error) {
    console.error(error);
    alert("Error conectando con el servidor");
  }
}
