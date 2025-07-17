// Estado global
let currentUser = null;
let cart = [];
let productosFiltrados = productos;

// Funciones de navegación
function navigateTo(page) {
    const content = document.getElementById('content');
    
    switch(page) {
        case 'home':
            renderHome();
            break;
        case 'menu':
            renderMenu();
            break;
        case 'cart':
            renderCart();
            break;
        case 'login':
            renderLogin();
            break;
        case 'register':
            renderRegister();
            break;
    }
    
    // Actualizar la clase active en el menú
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${page}`) {
            link.classList.add('active');
        }
    });
    
    // Asegurar que el botón de registro siempre esté visible
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
        registerBtn.style.display = 'inline-block';
    }
}

// Renderizado de páginas
function renderHome() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <!-- Hero principal -->
        <div class="hero">
            <div class="hero-content">
                <h1 class="welcome-title">Bienvenido a Nuestra Pizzería</h1>
                <p class="welcome-subtitle">Las mejores pizzas artesanales de la ciudad</p>
                <button class="menu-button" onclick="navigateTo('menu')">Ver Menú Completo</button>
            </div>
            <div class="hero-image">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800" alt="Pizza">
            </div>
        </div>

        <!-- Beneficios -->
        <div class="benefits">
            <h2>Nuestros Beneficios</h2>
            <div class="benefits-grid">
                ${beneficios.map(b => `
                    <div class="benefit-card">
                        <div class="benefit-icon">${b.icono}</div>
                        <h3>${b.titulo}</h3>
                        <p>${b.descripcion}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Productos Destacados -->
        <div class="products-featured">
            <h2>Productos Destacados</h2>
            <div class="products-grid">
                ${productos.filter(p => p.destacado).map(p => `
                    <div class="product-card" onclick="addToCart(${p.id})">
                        <img src="${p.imagen}" alt="${p.nombre}">
                        <h3>${p.nombre}</h3>
                        <p>${p.descripcion}</p>
                        <p>${p.precio.toLocaleString()} RD$</p>
                    </div>
                `).join('')}
            </div>
            <button class="menu-button" onclick="navigateTo('menu')">Ver todos los productos →</button>
        </div>

        <!-- CTA Final -->
        <div class="cta-final">
            <h2>¿Listo para ordenar?</h2>
            <p>Regístrate ahora y obtén un 10% de descuento en tu primera orden</p>
            <button class="menu-button" onclick="navigateTo('register')">Registrarse Ahora</button>
        </div>
    `;
}

function renderMenu() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="menu">
            <h1>Nuestro Menú</h1>
            <p>Descubre nuestra deliciosa variedad de pizzas y bebidas</p>

            <div class="search-filter">
                <input type="text" id="searchInput" placeholder="Buscar productos...">
                <div class="filters">
                    <button class="filter-btn active" onclick="filterProducts('todos')">Todos</button>
                    <button class="filter-btn" onclick="filterProducts('pizzas')">Pizzas</button>
                    <button class="filter-btn" onclick="filterProducts('bebidas')">Bebidas</button>
                </div>
            </div>
        </div>
    `;
}

function renderCart() {
    const content = document.getElementById('content');
    const total = cart.reduce((sum, item) => sum + (item.producto.precio * item.quantity), 0);
    
    content.innerHTML = `
        <div class="cart">
            <h1>Tu Carrito</h1>
            ${cart.length === 0 ? `
                <div class="cart-empty">
                    <p>Tu carrito está vacío</p>
                    <p>Agrega algunos productos deliciosos</p>
                    <button class="menu-button" onclick="navigateTo('menu')">Ver Menú 🔍</button>
                </div>
            ` : `
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <h3>${item.producto.nombre}</h3>
                                <p>Cantidad: ${item.quantity}</p>
                                <p>${(item.producto.precio * item.quantity).toLocaleString()} RD$</p>
                            </div>
                            <button onclick="removeFromCart(${item.producto.id})" class="button">Eliminar</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-total">
                    <h2>Total: ${total.toLocaleString()} RD$</h2>
                    ${currentUser ? `
                        <button onclick="checkout()" class="menu-button">Realizar Pedido</button>
                    ` : `
                        <p>Debes iniciar sesión para realizar el pedido</p>
                        <button onclick="navigateTo('login')" class="menu-button">Iniciar Sesión</button>
                    `}
                </div>
            `}
        </div>
    `;
}

function renderLogin() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="auth-form">
            <h1>Iniciar Sesión</h1>
            <p>Bienvenido de vuelta</p>
            <form id="loginForm" class="auth-form-center">
                <div class="form-group">
                    <i class="fas fa-user"></i>
                    <input type="text" class="input" placeholder="Usuario" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" class="input" placeholder="Contraseña" required>
                </div>
                <button type="submit" class="button">Iniciar Sesión</button>
            </form>
            <div class="auth-alt">
                <p>¿No tienes una cuenta?</p>
                <a href="#" onclick="navigateTo('register')" class="auth-link">Regístrate aquí</a>
            </div>
        </div>
    `;
    
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function renderRegister() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="auth-form">
            <h1>Crear Cuenta</h1>
            <p>Únete a nuestra pizzería</p>
            <form id="registerForm" class="auth-form-center">
                <div class="form-group">
                    <i class="fas fa-user"></i>
                    <input type="text" class="input" placeholder="Usuario" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-envelope"></i>
                    <input type="email" class="input" placeholder="Email" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-user"></i>
                    <input type="text" class="input" placeholder="Nombre Completo" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" class="input" placeholder="Contraseña" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" class="input" placeholder="Confirmar Contraseña" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-phone"></i>
                    <input type="tel" class="input" placeholder="Teléfono" required>
                </div>
                <button type="submit" class="button">Registrarse</button>
            </form>
        </div>
    `;
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// Funciones de carrito
function addToCart(pizzaId) {
    const pizza = pizzas.find(p => p.id === pizzaId);
    const existingItem = cart.find(item => item.pizza.id === pizzaId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ pizza, quantity: 1 });
    }
    
    navigateTo('cart');
}

function removeFromCart(pizzaId) {
    cart = cart.filter(item => item.pizza.id !== pizzaId);
    navigateTo('cart');
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    if (!currentUser) {
        alert('Debes iniciar sesión para realizar el pedido');
        navigateTo('login');
        return;
    }
    
    alert('¡Pedido realizado con éxito!');
    cart = [];
    navigateTo('home');
}

// Funciones de autenticación
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    const user = usuarios.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        alert('¡Bienvenido, ' + user.nombre + '!');
        navigateTo('home');
    } else {
        alert('Correo o contraseña incorrectos');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const nombre = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    // Verificar si el email ya existe
    if (usuarios.some(u => u.email === email)) {
        alert('Este correo ya está registrado');
        return;
    }
    
    // Agregar nuevo usuario
    usuarios.push({
        id: usuarios.length + 1,
        email,
        password,
        nombre
    });
    
    alert('¡Registro exitoso!');
    navigateTo('login');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });
    
    // Mostrar página de inicio por defecto
    navigateTo('home');
});
