const API_URL = "http://localhost:3000/api";

const container = document.getElementById("contenedor-peliculas");

let usersList = [];

// =========================
// REGISTRAR USUARIO
// =========================
async function registerUser() {
  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;

  if (!name || !email) {
    alert("Completa todos los campos");
    return;
  }

  await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, email })
  });

  alert("Usuario registrado");
  loadUsers();
}

// =========================
// CARGAR USUARIOS
// =========================
async function loadUsers() {
  const res = await fetch(`${API_URL}/users`);
  usersList = await res.json();
}

// =========================
// OBTENER PELÍCULAS
// =========================
async function loadMovies() {
  const res = await fetch(`${API_URL}/movies`);
  const movies = await res.json();

  container.innerHTML = "";

  movies.forEach(movie => {
    const userOptions = usersList
      .map(u => `<option value="${u._id}">${u.name}</option>`)
      .join("");

    const card = document.createElement("div");
    card.classList.add("peliculasCard");

    card.innerHTML = `
      <h3>${movie.title}</h3>
      <p><strong>Género:</strong> ${movie.genre}</p>
      <p><strong>Año:</strong> ${movie.year}</p>
      <p><strong>Promedio:</strong> ${movie.averageRating.toFixed(1)}</p>

      <button onclick="loadReviews('${movie._id}')">
        Ver Reseñas
      </button>

      <div id="reviews-${movie._id}" class="seccionReseñas"></div>

      <h4>Agregar Reseña</h4>

      <select id="user-${movie._id}">
        <option value="">Selecciona usuario</option>
        ${userOptions}
      </select>

      <input type="number" id="rating-${movie._id}" min="1" max="5" placeholder="Calificación (1-5)">
      <input type="text" id="comment-${movie._id}" placeholder="Comentario">

      <button onclick="addReview('${movie._id}')">Enviar</button>
    `;

    container.appendChild(card);
  });
}

// =========================
// CARGAR RESEÑAS
// =========================
async function loadReviews(movieId) {
  const res = await fetch(`${API_URL}/reviews/movie/${movieId}`);
  const reviews = await res.json();

  const section = document.getElementById(`reviews-${movieId}`);
  section.innerHTML = "<h4>Reseñas:</h4>";

  reviews.forEach(review => {
    section.innerHTML += `
      <p><strong>${review.user.name}</strong>: ${review.rating}<br>
      ${review.comment}</p>
    `;
  });
}

// =========================
// AGREGAR RESEÑA
// =========================
async function addReview(movieId) {
  const user = document.getElementById(`user-${movieId}`).value;
  const rating = document.getElementById(`rating-${movieId}`).value;
  const comment = document.getElementById(`comment-${movieId}`).value;

  if (!user || !rating) {
    alert("Completa los campos");
    return;
  }

  await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      movie: movieId,
      user,
      rating: Number(rating),
      comment
    })
  });

  alert("Reseña agregada");
  loadMovies();
}

// =========================
// INIT
// =========================
async function init() {
  await loadUsers();
  await loadMovies();
}

init();
