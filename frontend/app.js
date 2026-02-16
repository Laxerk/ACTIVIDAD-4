const API_URL = "http://localhost:3000/api";
const container = document.getElementById("contenedor-peliculas");

const session = JSON.parse(localStorage.getItem("sessionUser"));

if (!session) {
  window.location.href = "index.html";
}

function loadUser() {
  const label = document.getElementById("welcomeUser");
  if (label) {
    label.textContent = `${session.user?.name || session.name}`;
  }
}

function logout() {
  localStorage.removeItem("sessionUser");
  window.location.href = "index.html";
}

function getStars(rating) {
  const rounded = Math.round(rating);
  let stars = "";

  for (let i = 0; i < 5; i++) {
    stars += i < rounded ? "⭐" : "☆";
  }

  return `<span class="stars">${stars} (${rating.toFixed(1)})</span>`;
}

async function toggleReviews(movieId, btn) {
  const section = document.getElementById(`reviews-${movieId}`);

  if (section.classList.contains("mostrar")) {
    section.classList.remove("mostrar");
    btn.textContent = "Ver reseñas";
    return;
  }

  if (!section.dataset.loaded) {
    const res = await fetch(`${API_URL}/reviews/movie/${movieId}`);
    const reviews = await res.json();

    section.innerHTML = "<h4>Reseñas:</h4>";

    reviews.forEach(review => {
      section.innerHTML += `
        <p><strong>${review.user.name}</strong>: ${getStars(review.rating)}<br>
        ${review.comment}</p>
      `;
    });

    section.dataset.loaded = "true";
  }

  section.classList.add("mostrar");
  btn.textContent = "Ocultar reseñas";
}

async function userAlreadyReviewed(movieId, userId) {
  const res = await fetch(`${API_URL}/reviews/movie/${movieId}`);
  const reviews = await res.json();

  return reviews.some(r => r.user._id === userId);
}

async function deleteReview(movieId) {
  const userId = session.user?._id || session._id;

  if (!confirm("¿Seguro que quieres eliminar tu reseña?")) return;

  const res = await fetch(
    `${API_URL}/reviews/${movieId}/${userId}`,
    { method: "DELETE" }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "No se pudo eliminar");
    return;
  }

  alert("Reseña eliminada");
  loadMovies();
}


async function loadMovies() {
  const res = await fetch(`${API_URL}/movies`);
  const movies = await res.json();

  container.innerHTML = "";

  for (const movie of movies) {
    const card = document.createElement("div");
    card.classList.add("peliculasCard", "card-animada");
    const userId = session.user?._id || session._id;
    const alreadyReviewed = await userAlreadyReviewed(movie._id, userId);


    card.innerHTML = `
      <h3>${movie.title}</h3>
      <p><strong>Género:</strong> ${movie.genre}</p>
      <p><strong>Año:</strong> ${movie.year}</p>
      <p class="rating">Promedio: ${getStars(movie.averageRating)}</p>

      <button onclick="toggleReviews('${movie._id}', this)" class="btn-resenas">
        Ver reseñas
      </button>

      <div id="reviews-${movie._id}" class="seccionReseñas"></div>

      <h4>Agregar Reseña</h4>

      <input type="number" id="rating-${movie._id}" min="1" max="5" placeholder="Calificación (1-5)">
      <input type="text" id="comment-${movie._id}" placeholder="Comentario">

      ${
        alreadyReviewed
          ? `<button onclick="deleteReview('${movie._id}')" class="btn-delete">
              Eliminar mi reseña
            </button>`
          : `<button onclick="addReview('${movie._id}')">
              Enviar
            </button>`
      }

    `;

    container.appendChild(card);
  };
}

async function loadReviews(movieId) {
  const res = await fetch(`${API_URL}/reviews/movie/${movieId}`);
  const reviews = await res.json();

  const section = document.getElementById(`reviews-${movieId}`);
  section.innerHTML = "<h4>Reseñas:</h4>";

  reviews.forEach(review => {
    section.innerHTML += `
      <p><strong>${review.user.name}</strong>: ${getStars(review.rating)}<br>
      ${review.comment}</p>
    `;
  });
}

async function addReview(movieId) {
  const rating = document.getElementById(`rating-${movieId}`).value;
  const comment = document.getElementById(`comment-${movieId}`).value;

  if (!rating) {
    alert("Ingresa una calificación");
    return;
  }

  const userId = session.user?._id || session._id;

  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      movie: movieId,
      user: userId,
      rating: Number(rating),
      comment
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "No se pudo agregar la reseña");
    return;
  }

  alert("Reseña agregada");
  loadMovies();
}


async function init() {
  loadUser();
  await loadMovies();
}

init();
