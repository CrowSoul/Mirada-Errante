const storageKeys = {
  posts: 'miradaErrantePosts',
  comments: 'miradaErranteComments',
  users: 'miradaErranteUsers',
  admin: 'miradaErranteAdminSession'
};

const defaultPosts = [
  {
    id: 'post-1',
    title: 'Luz entre los libros',
    excerpt: 'Una breve exposición sobre el tránsito entre la lectura y la mirada errante.',
    tag: 'Literatura'
  },
  {
    id: 'post-2',
    title: 'Arte que susurra',
    excerpt: 'Reflexiones sobre piezas artesanales que dialogan con la oscuridad elegante.',
    tag: 'Artesanía'
  },
  {
    id: 'post-3',
    title: 'Navegando el silencio',
    excerpt: 'Un recorrido visual y literario que invita a explorar cada rincón de la exposición.',
    tag: 'Exposición'
  }
];

const adminCredentials = {
  username: 'miradaadmin',
  password: 'Errante2026!'
};

function getStorage(key, fallback) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getPosts() {
  return getStorage(storageKeys.posts, defaultPosts);
}

function getComments() {
  return getStorage(storageKeys.comments, []);
}

function getUsers() {
  return getStorage(storageKeys.users, []);
}

function getCurrentUser() {
  return getStorage('miradaErranteCurrentUser', null);
}

function setCurrentUser(user) {
  setStorage('miradaErranteCurrentUser', user);
}

function clearCurrentUser() {
  localStorage.removeItem('miradaErranteCurrentUser');
}

function isAdminAuthenticated() {
  return localStorage.getItem(storageKeys.admin) === 'true';
}

function setAdminAuthenticated(value) {
  localStorage.setItem(storageKeys.admin, value ? 'true' : 'false');
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderHome() {
  const postsGrid = document.getElementById('postsGrid');
  const authPanel = document.getElementById('authPanel');
  const commentFeed = document.getElementById('commentFeed');

  if (!postsGrid || !authPanel || !commentFeed) return;

  const posts = getPosts();
  const comments = getComments();
  const currentUser = getCurrentUser();

  postsGrid.innerHTML = posts
    .map(post => {
      const count = comments.filter(comment => comment.postId === post.id).length;
      return `
        <article class="post-card hover-float">
          <img class="post-thumb" src="logo.svg" alt="Miniatura ${post.title}" />
          <span class="post-meta">${post.tag}</span>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <p class="post-meta">Comentarios: ${count}</p>
        </article>
      `;
    })
    .join('');

  authPanel.innerHTML = currentUser
    ? `
      <div class="auth-card">
        <h3>Bienvenido, ${currentUser.username}</h3>
        <p>Puedes dejar un comentario en cualquiera de las publicaciones.</p>
        <button class="btn btn-secondary" id="logoutBtn">Cerrar sesión</button>
      </div>
    `
    : `
      <div class="auth-card">
        <h3>Iniciar sesión</h3>
        <form id="loginForm">
          <label>Usuario<input type="text" name="username" required></label>
          <label>Contraseña<input type="password" name="password" required></label>
          <button class="btn btn-primary" type="submit">Ingresar</button>
        </form>
      </div>
      <div class="auth-card">
        <h3>Crear usuario</h3>
        <form id="registerForm">
          <label>Usuario<input type="text" name="username" required></label>
          <label>Contraseña<input type="password" name="password" required></label>
          <button class="btn btn-secondary" type="submit">Registrar</button>
        </form>
      </div>
    `;

  commentFeed.innerHTML = posts
    .map(post => {
      const postComments = comments
        .filter(comment => comment.postId === post.id)
        .map(comment => `
          <div class="comment-card">
            <p>${comment.text}</p>
            <span class="comment-meta">${comment.username} · ${formatDate(comment.createdAt)}</span>
          </div>
        `)
        .join('') || '<p>No hay comentarios todavía.</p>';

      return `
        <section class="comment-box">
          <h3>${post.title}</h3>
          <span class="tag">${post.tag}</span>
          <p>${post.excerpt}</p>
          ${currentUser ? `
            <form class="form-card" data-post-id="${post.id}">
              <label>Tu comentario<textarea name="comment" required placeholder="Escribe tu reflexión..."></textarea></label>
              <button class="btn btn-primary" type="submit">Enviar comentario</button>
            </form>
          ` : '<p class="comment-meta">Inicia sesión para publicar un comentario.</p>'}
          ${postComments}
        </section>
      `;
    })
    .join('');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(loginForm);
      const username = form.get('username').trim();
      const password = form.get('password').trim();
      const user = getUsers().find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        renderHome();
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(registerForm);
      const username = form.get('username').trim();
      const password = form.get('password').trim();
      const users = getUsers();
      if (users.some(u => u.username === username)) {
        alert('El nombre de usuario ya existe.');
        return;
      }
      const newUser = { id: `user-${Date.now()}`, username, password };
      users.push(newUser);
      setStorage(storageKeys.users, users);
      setCurrentUser(newUser);
      renderHome();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearCurrentUser();
      renderHome();
    });
  }

  document.querySelectorAll('.form-card').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const postId = form.dataset.postId;
      const text = form.comment.value.trim();
      if (!text) return;
      const currentUser = getCurrentUser();
      const comments = getComments();
      comments.unshift({
        id: `comment-${Date.now()}`,
        postId,
        username: currentUser.username,
        text,
        createdAt: Date.now()
      });
      setStorage(storageKeys.comments, comments);
      renderHome();
    });
  });
}

function renderAdmin() {
  const adminArea = document.getElementById('admin-area');
  if (!adminArea) return;

  if (!isAdminAuthenticated()) {
    adminArea.innerHTML = `
      <div class="auth-card">
        <h3>Acceso de administrador</h3>
        <form id="adminLoginForm">
          <label>Usuario<input type="text" name="username" required></label>
          <label>Contraseña<input type="password" name="password" required></label>
          <button class="btn btn-primary" type="submit">Ingresar</button>
        </form>
      </div>
    `;
    document.getElementById('adminLoginForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.target);
      const username = form.get('username').trim();
      const password = form.get('password').trim();
      if (username === adminCredentials.username && password === adminCredentials.password) {
        setAdminAuthenticated(true);
        renderAdmin();
      } else {
        alert('Credenciales de administrador incorrectas.');
      }
    });
    return;
  }

  const posts = getPosts();
  const comments = getComments();

  adminArea.innerHTML = `
    <div class="admin-actions">
      <div class="form-card">
        <h3>Agregar nueva publicación</h3>
        <form id="addPostForm">
          <label>Título<input type="text" name="title" required></label>
          <label>Etiqueta<input type="text" name="tag" required></label>
          <label>Descripción<textarea name="excerpt" required></textarea></label>
          <button class="btn btn-primary" type="submit">Guardar publicación</button>
        </form>
      </div>
      <div class="card">
        <h3>Publicaciones</h3>
        <table class="admin-table">
          <thead>
            <tr><th>Título</th><th>Etiqueta</th><th>Acción</th></tr>
          </thead>
          <tbody>
            ${posts
              .map(
                post => `
                <tr>
                  <td>${post.title}</td>
                  <td>${post.tag}</td>
                  <td><button class="btn btn-secondary delete-post" data-id="${post.id}">Eliminar</button></td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      </div>
      <div class="card">
        <h3>Comentarios recientes</h3>
        <table class="admin-table">
          <thead>
            <tr><th>Usuario</th><th>Publicación</th><th>Comentario</th><th>Acción</th></tr>
          </thead>
          <tbody>
            ${comments
              .slice(0, 12)
              .map(
                comment => `
                  <tr>
                    <td>${comment.username}</td>
                    <td>${posts.find(post => post.id === comment.postId)?.title || 'N/A'}</td>
                    <td>${comment.text}</td>
                    <td><button class="btn btn-secondary delete-comment" data-id="${comment.id}">Eliminar</button></td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>
      </div>
      <button class="btn btn-secondary" id="adminLogout">Cerrar sesión</button>
    </div>
  `;

  document.getElementById('addPostForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.target);
    const title = form.get('title').trim();
    const tag = form.get('tag').trim();
    const excerpt = form.get('excerpt').trim();
    if (!title || !tag || !excerpt) return;
    const updatedPosts = [{ id: `post-${Date.now()}`, title, tag, excerpt }, ...posts];
    setStorage(storageKeys.posts, updatedPosts);
    renderAdmin();
  });

  document.querySelectorAll('.delete-post').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const updatedPosts = posts.filter(post => post.id !== id);
      const updatedComments = comments.filter(comment => comment.postId !== id);
      setStorage(storageKeys.posts, updatedPosts);
      setStorage(storageKeys.comments, updatedComments);
      renderAdmin();
    });
  });

  document.querySelectorAll('.delete-comment').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const updatedComments = comments.filter(comment => comment.id !== id);
      setStorage(storageKeys.comments, updatedComments);
      renderAdmin();
    });
  });

  document.getElementById('adminLogout').addEventListener('click', () => {
    setAdminAuthenticated(false);
    renderAdmin();
  });
}

function activateHoverAnimations() {
  document.querySelectorAll('.hover-float, .post-card, .comment-card, .card').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(18px)';
    setTimeout(() => {
      element.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 80 + 120);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('page-home')) {
    renderHome();
  }

  if (document.body.classList.contains('page-admin')) {
    renderAdmin();
  }

  activateHoverAnimations();
});
