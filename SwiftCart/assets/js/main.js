// ==========================
// STATE
// ==========================
const state = {
    products: [],
    cart: JSON.parse(localStorage.getItem("cart")) || []
};

// ==========================
// ELEMENTS
// ==========================
const elements = {
    productGrid: document.getElementById("productGrid") || document.getElementById("allProductGrid"),
    loader: document.getElementById("loader"),

    cartCount: document.getElementById("cartCount"),
    cartSidebar: document.getElementById("cartSidebar"),
    cartItemsContainer: document.getElementById("cartItemsContainer"),
    cartTotal: document.getElementById("cartTotal"),

    modal: document.getElementById("productModal"),
    mTitle: document.getElementById("modalTitle"),
    mImage: document.getElementById("modalImage"),
    mCategory: document.getElementById("modalCategory"),
    mPrice: document.getElementById("modalPrice"),
    mRating: document.getElementById("modalRating"),
    mDesc: document.getElementById("modalDesc")
};

// ==========================
// LOADER
// ==========================
function showLoader(show) {
    if (!elements.loader) return;
    elements.loader.classList.toggle("hidden", !show);
}

// ==========================
// FETCH PRODUCTS
// ==========================
function fetchProducts(category) {
    if (!elements.productGrid) return;

    showLoader(true);
    elements.productGrid.classList.add("hidden");

    let url = "https://fakestoreapi.com/products";
    if (category && category !== "All") url = `https://fakestoreapi.com/products/category/${category}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            state.products = data;

            // Index page shows 3 products only
            if (document.getElementById("productGrid")) {
                renderProducts(data.slice(0, 3));
            } else {
                renderProducts(data);
            }

            showLoader(false);
        })
        .catch(err => {
            console.error("Error fetching products:", err);
            showLoader(false);
        });
}

// ==========================
// RENDER PRODUCTS
// ==========================
function renderProducts(products) {
    const grid = elements.productGrid;
    if (!grid) return;

    grid.innerHTML = '';
    grid.classList.remove('hidden');

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col";
        card.innerHTML = `
            <div class="flex justify-center items-center h-48 mb-4">
                <img src="${product.image}" alt="${product.title}" class="object-contain h-full">
            </div>
            <div class="flex items-center justify-between mb-3">
                <p class="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg mb-2">${product.category}</p>
                <p class="text-yellow-400 text-sm">⭐ ${product.rating.rate}</p>
            </div>
            <h3 class="text-sm font-semibold mb-1 line-clamp-2">${product.title}</h3>
            <div class="flex items-center justify-between mb-3">
                <p class="text-indigo-600 font-bold text-base">$${product.price}</p>
            </div>
            <div class="flex gap-2 mt-auto">
                <button onclick="showDetails(${product.id})" class="flex-1 border border-gray-300 rounded py-2 text-sm hover:bg-gray-100 transition"><i class="fa-solid fa-eye m-1"></i>Details</button>
                <button onclick="addToCart(${product.id})" class="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"><i class="fa-solid fa-cart-arrow-down m-1"></i>Add</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================
// MODAL
// ==========================
function showDetails(id) {
    const product = state.products.find(p => p.id === id);
    if (!product || !elements.modal) return;

    elements.mTitle.textContent = product.title;
    elements.mImage.src = product.image;
    elements.mCategory.textContent = product.category;
    elements.mPrice.textContent = `$${product.price}`;
    elements.mRating.innerHTML = `⭐ ${product.rating.rate}`;
    elements.mDesc.textContent = product.description;

    elements.modal.classList.remove("hidden");
}

function closeModal() {
    if (!elements.modal) return;
    elements.modal.classList.add("hidden");
}

function addToCartFromModal() {
    const title = elements.mTitle.textContent;
    const product = state.products.find(p => p.title === title);
    if (product) {
        addToCart(product.id);
        closeModal();
    }
}

// ==========================
// CART
// ==========================
function addToCart(id) {
    const product = state.products.find(p => p.id === id);
    if (!product) return;

    const existing = state.cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    state.cart = state.cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(state.cart));
}

function updateCartUI() {
    if (!elements.cartItemsContainer) return;

    elements.cartItemsContainer.innerHTML = "";

    if (state.cart.length === 0) {
        elements.cartItemsContainer.innerHTML = `<li class="py-6 flex flex-col items-center justify-center h-64 text-gray-500">
            <i class="fa-solid fa-basket-shopping text-4xl mb-4"></i>
            <p>Your cart is empty.</p>
        </li>`;
    }

    let total = 0;

    state.cart.forEach(item => {
        total += item.price * item.qty;

        const div = document.createElement("div");
        div.className = "flex justify-between items-center mb-3";

        div.innerHTML = `
            <div>
                <p class="text-sm font-semibold">${item.title}</p>
                <p class="text-xs text-gray-500">Qty: ${item.qty}</p>
            </div>
            <div class="flex gap-2 items-center">
                <p class="text-sm font-bold">$${(item.price * item.qty).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        elements.cartItemsContainer.appendChild(div);
    });

    if (elements.cartTotal) elements.cartTotal.textContent = `$${total.toFixed(2)}`;
    if (elements.cartCount) elements.cartCount.textContent = state.cart.reduce((a, b) => a + b.qty, 0);

    if (elements.cartCount) {
        elements.cartCount.classList.toggle("opacity-0", state.cart.length === 0);
    }
}

function toggleCart() {
    if (!elements.cartSidebar) return;
    elements.cartSidebar.classList.toggle("hidden");
}

// ==========================
// NAV HIGHLIGHT
// ==========================
function highlightNav() {
    const links = document.querySelectorAll(".nav-link");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("text-indigo-600");
            link.classList.remove("text-gray-600");
        } else {
            link.classList.add("text-gray-600");
            link.classList.remove("text-indigo-600");
        }
    });
}

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    updateCartUI();
    highlightNav();
});
