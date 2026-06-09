const storageKeys = {
  posts: 'miradaErrantePosts',
  comments: 'miradaErranteComments',
  users: 'miradaErranteUsers',
  admin: 'miradaErranteAdminSession',
  crafts: 'miradaErranteCrafts',
  books: 'miradaErranteBooks'
};

const defaultPosts = [
  {
    id: 'post-1',
    title: 'Luz entre los libros',
    excerpt: 'Una breve exposición sobre el tránsito entre la lectura y la mirada errante.',
    tag: 'Literatura',
    image: 'logo.svg',
    buttonEnabled: false,
    buttonText: '',
    buttonUrl: ''
  },
  {
    id: 'post-2',
    title: 'Arte que susurra',
    excerpt: 'Reflexiones sobre piezas artesanales que dialogan con la oscuridad elegante.',
    tag: 'Artesanía',
    image: 'logo.svg',
    buttonEnabled: false,
    buttonText: '',
    buttonUrl: ''
  },
  {
    id: 'post-3',
    title: 'Navegando el silencio',
    excerpt: 'Un recorrido visual y literario que invita a explorar cada rincón de la exposición.',
    tag: 'Exposición',
    image: 'logo.svg',
    buttonEnabled: false,
    buttonText: '',
    buttonUrl: ''
  }
];

const defaultCrafts = [
  {
    id: 'craft-1',
    title: 'Vaso lunar',
    description: 'Escultura utilitaria con esmalte profundo y diseño artesanal.',
    tag: 'Cerámica',
    price: 45,
    image: 'logo.svg'
  },
  {
    id: 'craft-2',
    title: 'Pañuelo de memoria',
    description: 'Accesorio textil bordado para prendas con estilo sobrio y elegante.',
    tag: 'Joyería',
    price: 35,
    image: 'logo.svg'
  },
  {
    id: 'craft-3',
    title: 'Relato en tinta',
    description: 'Obra original en papel con trazos y sombras inspiracionales.',
    tag: 'Ilustración',
    price: 60,
    image: 'logo.svg'
  },
  {
    id: 'craft-4',
    title: 'Caja de sal',
    description: 'Contenedor artesanal con textura y detalles en tono oscuro.',
    tag: 'Decoración',
    price: 25,
    image: 'logo.svg'
  }
];

const defaultBooks = [
  {
    id: 'book-1',
    title: 'El mapa de las sombras',
    description: 'Una novela intensa sobre viajes interiores y secretos que no quieren ser descubiertos.',
    tag: 'Literatura',
    price: 28.99,
    image: 'logo.svg'
  },
  {
    id: 'book-2',
    title: 'Balance de instantes',
    description: 'Reflexiones elegantes sobre arte, memoria y los silencios que llenan las calles nocturnas.',
    tag: 'Ensayo',
    price: 24.99,
    image: 'logo.svg'
  },
  {
    id: 'book-3',
    title: 'Rituales de papel',
    description: 'Poemas que se deslizan entre la nostalgia, la belleza urbana y la intemperie del tiempo.',
    tag: 'Poesía',
    price: 19.99,
    image: 'logo.svg'
  },
  {
    id: 'book-4',
    title: 'Crónicas de un paisaje',
    description: 'Relatos visuales y voces antiguas que reconstruyen el pasado desde el presente.',
    tag: 'Historia',
    price: 32.99,
    image: 'logo.svg'
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

function getCrafts() {
  return getStorage(storageKeys.crafts, defaultCrafts);
}

function getBooks() {
  return getStorage(storageKeys.books, defaultBooks);
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

function truncateText(text, maxLength = 120) {
  if (!text) return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}...`;
}

function renderHome() {
  const postsGrid = document.getElementById('postsGrid');

  if (!postsGrid) return;

  const posts = getPosts();
  const comments = getComments();

  postsGrid.innerHTML = posts
    .map(post => {
      const count = comments.filter(comment => comment.postId === post.id).length;
      const imageUrl = post.image || 'logo.svg';
      const buttonHTML = post.buttonEnabled && post.buttonText && post.buttonUrl
        ? `<a href="${post.buttonUrl}" target="_blank" class="btn btn-custom-post">${post.buttonText}</a>`
        : '';
      const shortExcerpt = truncateText(post.excerpt, 100);
      return `
        <article class="post-card hover-float">
          <img class="post-thumb zoomable-image" src="${imageUrl}" alt="Miniatura ${post.title}" data-title="${post.title}" data-caption="${post.excerpt}" data-post-id="${post.id}" />
          <span class="post-meta">${post.tag}</span>
          <h3>${post.title}</h3>
          <p>${shortExcerpt}</p>
          <p class="image-hint">Haz clic en la imagen para ver la descripción completa y comentarios.</p>
          <p class="post-meta">Comentarios: ${count}</p>
          ${buttonHTML}
        </article>
      `;
    })
    .join('');

  attachImageModalListeners();
}

function renderAdmin() {
  const adminArea = document.getElementById('admin-area');
  if (!adminArea) return;

  const currentUser = getCurrentUser();
  const adminAuth = isAdminAuthenticated();
  const posts = getPosts();
  const comments = getComments();
  const crafts = getCrafts();
  const books = getBooks();

  const userPanel = currentUser
    ? `
      <div class="auth-card">
        <h3>Usuario conectado</h3>
        <p class="auth-note">Has iniciado sesión como <strong>${currentUser.username}</strong>. Puedes publicar comentarios en el sitio o cerrar sesión.</p>
        <button class="btn btn-secondary" id="logoutUserBtn">Cerrar sesión de usuario</button>
      </div>
    `
    : `
      <div class="auth-card">
        <h3>Ingresar usuario</h3>
        <p class="auth-note">Si ya tienes una cuenta, inicia sesión para usar el sitio y comentar.</p>
        <form id="loginUserForm">
          <label>Usuario<input type="text" name="username" required></label>
          <label>Contraseña<input type="password" name="password" required></label>
          <button class="btn btn-primary" type="submit">Ingresar</button>
        </form>
      </div>
      <div class="auth-card">
        <h3>Crear nuevo usuario</h3>
        <p class="auth-note">Regístrate ahora para acceder a contenido y comentar con tu perfil personal.</p>
        <form id="registerUserForm">
          <label>Usuario<input type="text" name="username" required></label>
          <label>Contraseña<input type="password" name="password" required></label>
          <button class="btn btn-secondary" type="submit">Registrar</button>
        </form>
      </div>
    `;

  const adminPanel = adminAuth
    ? `
      <div class="admin-profile-card">
        <h3>Perfil de administrador</h3>
        <p class="auth-note">Has ingresado como <strong>${adminCredentials.username}</strong>. El panel de administración está activo y listo para gestionar contenido.</p>
        <p>Rol: Administrador</p>
        <button class="btn btn-secondary" id="adminLogout">Cerrar sesión de administrador</button>
      </div>
    `
    : `
      <div class="auth-card">
        <h3>Acceso de administrador</h3>
        <p class="auth-note">Ingrese las credenciales de administrador para activar las herramientas de gestión.</p>
        <form id="adminLoginForm">
          <label>Usuario<input type="text" name="username" required></label>
          <label>Contraseña<input type="password" name="password" required></label>
          <button class="btn btn-primary" type="submit">Ingresar</button>
        </form>
      </div>
    `;

  adminArea.innerHTML = `
    <div class="admin-grid">
      <div class="card">
        <h2>Acceso de usuarios</h2>
        ${userPanel}
      </div>
      <div class="card">
        <h2>Administración</h2>
        ${adminPanel}
      </div>
    </div>
    ${adminAuth ? `
      <div class="admin-actions">
        <div class="form-card">
          <h3>Agregar nueva publicación</h3>
          <form id="addPostForm">
            <label>Título<input type="text" name="title" required></label>
            <label>Etiqueta<input type="text" name="tag" required></label>
            <label>Descripción<textarea name="excerpt" required></textarea></label>
            <label>URL de imagen
              <input type="text" name="imageUrl" placeholder="https://ejemplo.com/imagen.jpg">
            </label>
            <label>O subir imagen
              <input type="file" name="imageFile" accept="image/*">
            </label>
            <p style="font-size: 0.85rem; color: #999;">Ingresa una URL o sube un archivo. Si ambos están presentes, se usa la imagen subida.</p>
            <button class="btn btn-primary" type="submit">Guardar publicación</button>
          </form>
        </div>

        <div class="form-card">
          <h3>Agregar nuevo artículo (Artesanía)</h3>
          <form id="addCraftForm">
            <label>Título<input type="text" name="title" required></label>
            <label>Categoría<input type="text" name="tag" required></label>
            <label>Descripción<textarea name="description" required></textarea></label>
            <label>Precio<input type="number" name="price" step="0.01" min="0" required></label>
            <label>URL de imagen
              <input type="text" name="imageUrl" placeholder="https://ejemplo.com/imagen.jpg">
            </label>
            <label>O subir imagen
              <input type="file" name="imageFile" accept="image/*">
            </label>
            <p style="font-size: 0.85rem; color: #999;">Ingresa una URL o sube un archivo. Si ambos están presentes, se usa la imagen subida.</p>
            <button class="btn btn-primary" type="submit">Guardar artículo</button>
          </form>
        </div>

        <div class="form-card">
          <h3>Agregar nuevo libro</h3>
          <form id="addBookForm">
            <label>Título<input type="text" name="title" required></label>
            <label>Categoría<input type="text" name="tag" required></label>
            <label>Descripción<textarea name="description" required></textarea></label>
            <label>Precio<input type="number" name="price" step="0.01" min="0" required></label>
            <label>URL de imagen
              <input type="text" name="imageUrl" placeholder="https://ejemplo.com/imagen.jpg">
            </label>
            <label>O subir imagen
              <input type="file" name="imageFile" accept="image/*">
            </label>
            <p style="font-size: 0.85rem; color: #999;">Ingresa una URL o sube un archivo. Si ambos están presentes, se usa la imagen subida.</p>
            <button class="btn btn-primary" type="submit">Guardar libro</button>
          </form>
        </div>

        <div class="card">
          <h3>Publicaciones</h3>
          <table class="admin-table">
            <thead>
              <tr><th>Título</th><th>Etiqueta</th><th>Imagen</th><th>Editar</th><th>Acción</th></tr>
            </thead>
            <tbody>
              ${posts
                .map(
                  post => `
                  <tr>
                    <td>${post.title}</td>
                    <td>${post.tag}</td>
                    <td>${post.image ? '✓' : 'Sin imagen'}</td>
                    <td><button class="btn btn-secondary btn-sm edit-post-button" data-id="${post.id}">Editar</button></td>
                    <td><button class="btn btn-secondary delete-post" data-id="${post.id}">Eliminar</button></td>
                  </tr>
                `
                )
                .join('')}
            </tbody>
          </table>
          <div id="editPostFormContainer" style="display: none; margin-top: 2rem; padding: 1.5rem; background: var(--surface-2); border-radius: 0.75rem;">
            <h4>Editar publicación</h4>
            <form id="editPostForm">
              <input type="hidden" name="postId" id="editPostId">
              <label>Título<input type="text" name="title" id="editPostTitle" required></label>
              <label>Etiqueta<input type="text" name="tag" id="editPostTag" required></label>
              <label>Descripción<textarea name="excerpt" id="editPostExcerpt" required></textarea></label>
              <label>URL de imagen<input type="text" name="imageUrl" id="editPostImageUrl" placeholder="https://ejemplo.com/imagen.jpg"></label>
              <label>O subir imagen<input type="file" name="imageFile" id="editPostImageFile" accept="image/*"></label>
              <h4>Opciones de botón</h4>
              <label>Habilitar botón<input type="checkbox" name="buttonEnabled" id="editButtonEnabled"></label>
              <label>Texto del botón<input type="text" name="buttonText" id="editButtonText" placeholder="Ej: Leer más, Visitar, etc."></label>
              <label>URL del botón<input type="url" name="buttonUrl" id="editButtonUrl" placeholder="https://ejemplo.com"></label>
              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-primary" type="submit">Guardar cambios</button>
                <button class="btn btn-secondary" type="button" id="cancelEditPostForm">Cancelar</button>
              </div>
            </form>
          </div>
        </div>

        <div class="card">
          <h3>Artículos (Artesanías)</h3>
          <table class="admin-table">
            <thead>
              <tr><th>Título</th><th>Categoría</th><th>Precio</th><th>Imagen</th><th>Editar</th><th>Acción</th></tr>
            </thead>
            <tbody>
              ${crafts
                .map(
                  craft => `
                  <tr>
                    <td>${craft.title}</td>
                    <td>${craft.tag}</td>
                    <td>$${craft.price}</td>
                    <td>${craft.image ? '✓' : 'Sin imagen'}</td>
                    <td><button class="btn btn-secondary btn-sm edit-craft-button" data-id="${craft.id}">Editar</button></td>
                    <td><button class="btn btn-secondary delete-craft" data-id="${craft.id}">Eliminar</button></td>
                  </tr>
                `
                )
                .join('')}
            </tbody>
          </table>
          <div id="editCraftFormContainer" style="display: none; margin-top: 2rem; padding: 1.5rem; background: var(--surface-2); border-radius: 0.75rem;">
            <h4>Editar artículo</h4>
            <form id="editCraftForm">
              <input type="hidden" name="craftId" id="editCraftId">
              <label>Título<input type="text" name="title" id="editCraftTitle" required></label>
              <label>Categoría<input type="text" name="tag" id="editCraftTag" required></label>
              <label>Descripción<textarea name="description" id="editCraftDescription" required></textarea></label>
              <label>Precio<input type="number" name="price" id="editCraftPrice" step="0.01" min="0" required></label>
              <label>URL de imagen<input type="text" name="imageUrl" id="editCraftImageUrl" placeholder="https://ejemplo.com/imagen.jpg"></label>
              <label>O subir imagen<input type="file" name="imageFile" id="editCraftImageFile" accept="image/*"></label>
              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-primary" type="submit">Guardar cambios</button>
                <button class="btn btn-secondary" type="button" id="cancelEditCraftForm">Cancelar</button>
              </div>
            </form>
          </div>
        </div>

        <div class="card">
          <h3>Libros</h3>
          <table class="admin-table">
            <thead>
              <tr><th>Título</th><th>Categoría</th><th>Precio</th><th>Imagen</th><th>Editar</th><th>Acción</th></tr>
            </thead>
            <tbody>
              ${books
                .map(
                  book => `
                  <tr>
                    <td>${book.title}</td>
                    <td>${book.tag}</td>
                    <td>$${book.price}</td>
                    <td>${book.image ? '✓' : 'Sin imagen'}</td>
                    <td><button class="btn btn-secondary btn-sm edit-book-button" data-id="${book.id}">Editar</button></td>
                    <td><button class="btn btn-secondary delete-book" data-id="${book.id}">Eliminar</button></td>
                  </tr>
                `
                )
                .join('')}
            </tbody>
          </table>
          <div id="editBookFormContainer" style="display: none; margin-top: 2rem; padding: 1.5rem; background: var(--surface-2); border-radius: 0.75rem;">
            <h4>Editar libro</h4>
            <form id="editBookForm">
              <input type="hidden" name="bookId" id="editBookId">
              <label>Título<input type="text" name="title" id="editBookTitle" required></label>
              <label>Categoría<input type="text" name="tag" id="editBookTag" required></label>
              <label>Descripción<textarea name="description" id="editBookDescription" required></textarea></label>
              <label>Precio<input type="number" name="price" id="editBookPrice" step="0.01" min="0" required></label>
              <label>URL de imagen<input type="text" name="imageUrl" id="editBookImageUrl" placeholder="https://ejemplo.com/imagen.jpg"></label>
              <label>O subir imagen<input type="file" name="imageFile" id="editBookImageFile" accept="image/*"></label>
              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-primary" type="submit">Guardar cambios</button>
                <button class="btn btn-secondary" type="button" id="cancelEditBookForm">Cancelar</button>
              </div>
            </form>
          </div>
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
      </div>
    ` : ''}
  `;

  if (!adminAuth) {
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
  }

  if (currentUser && document.getElementById('logoutUserBtn')) {
    document.getElementById('logoutUserBtn').addEventListener('click', () => {
      clearCurrentUser();
      renderAdmin();
    });
  }

  if (!currentUser && document.getElementById('loginUserForm')) {
    document.getElementById('loginUserForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.target);
      const username = form.get('username').trim();
      const password = form.get('password').trim();
      const user = getUsers().find(u => u.username === username && u.password === password);
      if (user) {
        setCurrentUser(user);
        renderAdmin();
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    });
  }

  if (!currentUser && document.getElementById('registerUserForm')) {
    document.getElementById('registerUserForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.target);
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
      renderAdmin();
    });
  }

  if (adminAuth) {
    document.getElementById('adminLogout').addEventListener('click', () => {
      setAdminAuthenticated(false);
      renderAdmin();
    });

    document.getElementById('addPostForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.target;
      const title = form.title.value.trim();
      const tag = form.tag.value.trim();
      const excerpt = form.excerpt.value.trim();
      const imageUrl = form.imageUrl.value.trim();
      const imageFile = form.imageFile.files[0];

      if (!title || !tag || !excerpt) return;

      let imageData = imageUrl || 'logo.svg';

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imageData = e.target.result;
          const updatedPosts = [{ id: `post-${Date.now()}`, title, tag, excerpt, image: imageData, buttonEnabled: false, buttonText: '', buttonUrl: '' }, ...posts];
          setStorage(storageKeys.posts, updatedPosts);
          renderAdmin();
          form.reset();
        };
        reader.readAsDataURL(imageFile);
      } else {
        const updatedPosts = [{ id: `post-${Date.now()}`, title, tag, excerpt, image: imageData, buttonEnabled: false, buttonText: '', buttonUrl: '' }, ...posts];
        setStorage(storageKeys.posts, updatedPosts);
        renderAdmin();
        form.reset();
      }
    });

    document.getElementById('addCraftForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.target;
      const title = form.title.value.trim();
      const tag = form.tag.value.trim();
      const description = form.description.value.trim();
      const price = parseFloat(form.price.value);
      const imageUrl = form.imageUrl.value.trim();
      const imageFile = form.imageFile.files[0];

      if (!title || !tag || !description || price < 0) return;

      let imageData = imageUrl || 'logo.svg';

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imageData = e.target.result;
          const updatedCrafts = [{ id: `craft-${Date.now()}`, title, tag, description, price, image: imageData }, ...crafts];
          setStorage(storageKeys.crafts, updatedCrafts);
          renderAdmin();
          form.reset();
        };
        reader.readAsDataURL(imageFile);
      } else {
        const updatedCrafts = [{ id: `craft-${Date.now()}`, title, tag, description, price, image: imageData }, ...crafts];
        setStorage(storageKeys.crafts, updatedCrafts);
        renderAdmin();
        form.reset();
      }
    });

    document.getElementById('addBookForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.target;
      const title = form.title.value.trim();
      const tag = form.tag.value.trim();
      const description = form.description.value.trim();
      const price = parseFloat(form.price.value);
      const imageUrl = form.imageUrl.value.trim();
      const imageFile = form.imageFile.files[0];

      if (!title || !tag || !description || price < 0) return;

      let imageData = imageUrl || 'logo.svg';

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imageData = e.target.result;
          const updatedBooks = [{ id: `book-${Date.now()}`, title, tag, description, price, image: imageData }, ...books];
          setStorage(storageKeys.books, updatedBooks);
          renderAdmin();
          form.reset();
        };
        reader.readAsDataURL(imageFile);
      } else {
        const updatedBooks = [{ id: `book-${Date.now()}`, title, tag, description, price, image: imageData }, ...books];
        setStorage(storageKeys.books, updatedBooks);
        renderAdmin();
        form.reset();
      }
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

    document.querySelectorAll('.edit-post-button').forEach(button => {
      button.addEventListener('click', () => {
        const postId = button.dataset.id;
        const post = posts.find(p => p.id === postId);
        if (!post) return;

        document.getElementById('editPostId').value = postId;
        document.getElementById('editPostTitle').value = post.title;
        document.getElementById('editPostTag').value = post.tag;
        document.getElementById('editPostExcerpt').value = post.excerpt;
        document.getElementById('editPostImageUrl').value = post.image && post.image.startsWith('http') ? post.image : '';
        document.getElementById('editButtonEnabled').checked = post.buttonEnabled || false;
        document.getElementById('editButtonText').value = post.buttonText || '';
        document.getElementById('editButtonUrl').value = post.buttonUrl || '';
        document.getElementById('editPostFormContainer').style.display = 'block';
      });
    });

    document.getElementById('editPostForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.target;
      const postId = form.postId.value;
      const title = form.title.value.trim();
      const tag = form.tag.value.trim();
      const excerpt = form.excerpt.value.trim();
      const imageUrl = form.imageUrl.value.trim();
      const imageFile = form.imageFile.files[0];
      const buttonEnabled = form.buttonEnabled.checked;
      const buttonText = form.buttonText.value.trim();
      const buttonUrl = form.buttonUrl.value.trim();

      if (!title || !tag || !excerpt) return;

      const selectedPost = posts.find(post => post.id === postId);
      if (!selectedPost) return;

      const saveUpdatedPost = imageData => {
        const updatedPosts = posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              title,
              tag,
              excerpt,
              image: imageData,
              buttonEnabled,
              buttonText,
              buttonUrl
            };
          }
          return post;
        });
        setStorage(storageKeys.posts, updatedPosts);
        document.getElementById('editPostFormContainer').style.display = 'none';
        renderAdmin();
      };

      let imageData = selectedPost.image || 'logo.svg';
      if (imageUrl) imageData = imageUrl;

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          saveUpdatedPost(e.target.result);
        };
        reader.readAsDataURL(imageFile);
      } else {
        saveUpdatedPost(imageData);
      }
    });

    document.getElementById('cancelEditPostForm').addEventListener('click', () => {
      document.getElementById('editPostFormContainer').style.display = 'none';
    });

    document.querySelectorAll('.edit-craft-button').forEach(button => {
      button.addEventListener('click', () => {
        const craftId = button.dataset.id;
        const craft = crafts.find(c => c.id === craftId);
        if (!craft) return;

        document.getElementById('editCraftId').value = craftId;
        document.getElementById('editCraftTitle').value = craft.title;
        document.getElementById('editCraftTag').value = craft.tag;
        document.getElementById('editCraftDescription').value = craft.description;
        document.getElementById('editCraftPrice').value = craft.price;
        document.getElementById('editCraftImageUrl').value = craft.image && craft.image.startsWith('http') ? craft.image : '';
        document.getElementById('editCraftFormContainer').style.display = 'block';
      });
    });

    document.getElementById('editCraftForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.target;
      const craftId = form.craftId.value;
      const title = form.title.value.trim();
      const tag = form.tag.value.trim();
      const description = form.description.value.trim();
      const price = parseFloat(form.price.value);
      const imageUrl = form.imageUrl.value.trim();
      const imageFile = form.imageFile.files[0];

      if (!title || !tag || !description || price < 0) return;

      const selectedCraft = crafts.find(craft => craft.id === craftId);
      if (!selectedCraft) return;

      const saveUpdatedCraft = imageData => {
        const updatedCrafts = crafts.map(craft => {
          if (craft.id === craftId) {
            return { ...craft, title, tag, description, price, image: imageData };
          }
          return craft;
        });
        setStorage(storageKeys.crafts, updatedCrafts);
        document.getElementById('editCraftFormContainer').style.display = 'none';
        renderAdmin();
      };

      let imageData = selectedCraft.image || 'logo.svg';
      if (imageUrl) imageData = imageUrl;

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          saveUpdatedCraft(e.target.result);
        };
        reader.readAsDataURL(imageFile);
      } else {
        saveUpdatedCraft(imageData);
      }
    });

    document.getElementById('cancelEditCraftForm').addEventListener('click', () => {
      document.getElementById('editCraftFormContainer').style.display = 'none';
    });

    document.querySelectorAll('.edit-book-button').forEach(button => {
      button.addEventListener('click', () => {
        const bookId = button.dataset.id;
        const book = books.find(b => b.id === bookId);
        if (!book) return;

        document.getElementById('editBookId').value = bookId;
        document.getElementById('editBookTitle').value = book.title;
        document.getElementById('editBookTag').value = book.tag;
        document.getElementById('editBookDescription').value = book.description;
        document.getElementById('editBookPrice').value = book.price;
        document.getElementById('editBookImageUrl').value = book.image && book.image.startsWith('http') ? book.image : '';
        document.getElementById('editBookFormContainer').style.display = 'block';
      });
    });

    document.getElementById('editBookForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.target;
      const bookId = form.bookId.value;
      const title = form.title.value.trim();
      const tag = form.tag.value.trim();
      const description = form.description.value.trim();
      const price = parseFloat(form.price.value);
      const imageUrl = form.imageUrl.value.trim();
      const imageFile = form.imageFile.files[0];

      if (!title || !tag || !description || price < 0) return;

      const selectedBook = books.find(book => book.id === bookId);
      if (!selectedBook) return;

      const saveUpdatedBook = imageData => {
        const updatedBooks = books.map(book => {
          if (book.id === bookId) {
            return { ...book, title, tag, description, price, image: imageData };
          }
          return book;
        });
        setStorage(storageKeys.books, updatedBooks);
        document.getElementById('editBookFormContainer').style.display = 'none';
        renderAdmin();
      };

      let imageData = selectedBook.image || 'logo.svg';
      if (imageUrl) imageData = imageUrl;

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          saveUpdatedBook(e.target.result);
        };
        reader.readAsDataURL(imageFile);
      } else {
        saveUpdatedBook(imageData);
      }
    });

    document.getElementById('cancelEditBookForm').addEventListener('click', () => {
      document.getElementById('editBookFormContainer').style.display = 'none';
    });

    document.querySelectorAll('.delete-craft').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        const updatedCrafts = crafts.filter(craft => craft.id !== id);
        setStorage(storageKeys.crafts, updatedCrafts);
        renderAdmin();
      });
    });

    document.querySelectorAll('.delete-book').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        const updatedBooks = books.filter(book => book.id !== id);
        setStorage(storageKeys.books, updatedBooks);
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
  }
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

function renderCrafts() {
  const cardsGrid = document.querySelector('.cards-grid');
  if (!cardsGrid || !document.body.classList.contains('page-crafts')) return;

  const crafts = getCrafts();

  cardsGrid.innerHTML = crafts
    .map(craft => {
      const imageUrl = craft.image || 'logo.svg';
      const whatsappLink = generateWhatsAppLink(craft.title);
      return `
        <article class="craft-card hover-float">
          <img class="zoomable-image" src="${imageUrl}" alt="${craft.title}" data-title="${craft.title}" data-caption="${craft.description}" style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 1rem; border-radius: 4px;">
          <span class="tag">${craft.tag}</span>
          <h3>${craft.title}</h3>
          <p>${craft.description}</p>
          <p style="font-weight: bold; color: #d4a574;">$${craft.price.toFixed(2)}</p>
          <a href="${whatsappLink}" target="_blank" class="btn btn-primary" style="display: inline-block; text-align: center; margin-top: 1rem; text-decoration: none;">Comprar</a>
        </article>
      `;
    })
    .join('');
  attachImageModalListeners();
}

function renderBooks() {
  const cardsGrid = document.querySelector('.cards-grid');
  if (!cardsGrid || !document.body.classList.contains('page-library')) return;

  const books = getBooks();

  cardsGrid.innerHTML = books
    .map(book => {
      const imageUrl = book.image || 'logo.svg';
      const whatsappLink = generateWhatsAppLink(book.title);
      return `
        <article class="book-card hover-float">
          <img class="zoomable-image" src="${imageUrl}" alt="${book.title}" data-title="${book.title}" data-caption="${book.description}" style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 1rem; border-radius: 4px;">
          <span class="tag">${book.tag}</span>
          <h3>${book.title}</h3>
          <p>${book.description}</p>
          <p style="font-weight: bold; color: #d4a574;">$${book.price.toFixed(2)}</p>
          <a href="${whatsappLink}" target="_blank" class="btn btn-primary" style="display: inline-block; text-align: center; margin-top: 1rem; text-decoration: none;">Comprar</a>
        </article>
      `;
    })
    .join('');
  attachImageModalListeners();
}

function createImageModal() {
  if (document.getElementById('imageModalOverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'imageModalOverlay';
  overlay.className = 'image-modal-overlay';
  overlay.innerHTML = `
    <div class="image-modal">
      <button class="image-modal-close" aria-label="Cerrar imagen">×</button>
      <img class="image-modal-img" src="" alt="" />
      <div class="image-modal-caption"></div>
      <div class="image-modal-comments"></div>
      <div class="image-modal-comment-form"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', event => {
    if (event.target === overlay || event.target.closest('.image-modal-close')) {
      overlay.classList.remove('visible');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overlay.classList.contains('visible')) {
      overlay.classList.remove('visible');
    }
  });
}

function attachImageModalListeners() {
  createImageModal();
  const overlay = document.getElementById('imageModalOverlay');
  const modalImg = overlay.querySelector('.image-modal-img');
  const captionEl = overlay.querySelector('.image-modal-caption');
  const commentsEl = overlay.querySelector('.image-modal-comments');
  const formEl = overlay.querySelector('.image-modal-comment-form');

  document.querySelectorAll('.zoomable-image').forEach(img => {
    if (img.dataset.modalAttached === 'true') return;
    img.dataset.modalAttached = 'true';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const currentUser = getCurrentUser();
      const postId = img.dataset.postId;
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      const title = img.dataset.title ? `<strong>${img.dataset.title}</strong>` : '';
      const caption = img.dataset.caption ? `<p>${img.dataset.caption}</p>` : '';
      captionEl.innerHTML = `${title}${caption}` || img.alt;

      if (postId) {
        const postComments = getComments().filter(comment => comment.postId === postId);
        commentsEl.innerHTML = `
          <div class="image-modal-comments-heading"><h4>Comentarios</h4></div>
          ${
            postComments.length
              ? postComments
                  .map(
                    comment => `
                      <div class="comment-card">
                        <p>${comment.text}</p>
                        <span class="comment-meta">${comment.username} · ${formatDate(comment.createdAt)}</span>
                      </div>
                    `
                  )
                  .join('')
              : '<p>No hay comentarios todavía.</p>'
          }
        `;

        if (currentUser) {
          formEl.innerHTML = `
            <form id="modalCommentForm" data-post-id="${postId}">
              <label>Tu comentario<textarea name="comment" required placeholder="Escribe tu reflexión..."></textarea></label>
              <button class="btn btn-primary" type="submit">Enviar comentario</button>
            </form>
          `;
          const modalForm = overlay.querySelector('#modalCommentForm');
          modalForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(modalForm);
            const text = formData.get('comment').trim();
            if (!text) return;
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
            const updatedComments = getComments().filter(comment => comment.postId === postId);
            commentsEl.innerHTML = `
              <div class="image-modal-comments-heading"><h4>Comentarios</h4></div>
              ${updatedComments
                .map(
                  comment => `
                    <div class="comment-card">
                      <p>${comment.text}</p>
                      <span class="comment-meta">${comment.username} · ${formatDate(comment.createdAt)}</span>
                    </div>
                  `
                )
                .join('')}
            `;
            modalForm.reset();
          });
        } else {
          formEl.innerHTML = `
            <p class="auth-note">Inicia sesión en <a href="admin.html">Inicio de Sesión</a> para comentar.</p>
          `;
        }
      } else {
        commentsEl.innerHTML = '';
        formEl.innerHTML = '';
      }

      overlay.classList.add('visible');
    });
  });
}

function generateWhatsAppLink(productName) {
  const phoneNumber = '529711689009';
  const message = `Hola, quiero comprar ${productName}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('page-home')) {
    renderHome();
  }

  if (document.body.classList.contains('page-admin')) {
    renderAdmin();
  }

  if (document.body.classList.contains('page-crafts')) {
    renderCrafts();
  }

  if (document.body.classList.contains('page-library')) {
    renderBooks();
  }

  activateHoverAnimations();
});
