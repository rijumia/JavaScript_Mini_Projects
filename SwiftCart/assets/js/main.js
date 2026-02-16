const state = {
    products: [],
    cart: [],
    categories: [],
    currentModalProductId: null
};

const elements = {
    productGrid: document.getElementById('productGrid'),
    categoryContainer: document.getElementById('categoryContainer'),
    loader: document.getElementById('loader'),
    cartCount: document.getElementById('cartCount'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    cartTotal: document.getElementById('cartTotal'),
    // Modal Elements
    modal: document.getElementById('productModal'),
    mTitle: document.getElementById('modalTitle'),
    mImage: document.getElementById('modalImage'),
    mCategory: document.getElementById('modalCategory'),
    mPrice: document.getElementById('modalPrice'),
    mRating: document.getElementById('modalRating'),
    mDesc: document.getElementById('modalDesc')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchProducts();
    highlightNav();
});

// Navbar highlight
function highlightNav() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === '#' + location.hash.slice(1)) {
            link.classList.add('text-indigo-600');
        }
    });
}

// Fetch Categories
function fetchCategories() {
    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(data => {
            state.categories = data;
            renderCategories(data);
        });
}

function renderCategories(categories) {
    // Note: The HTML structure for categoryContainer wasn't in the provided HTML, 
    // so this function won't render anything visible unless you add the container div.
    // Kept for logic consistency.
    if (!elements.categoryContainer) return;

    elements.categoryContainer.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = 'px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-indigo-600 hover:text-white';
    allBtn.onclick = () => { fetchProducts(); setActiveCategory(allBtn); }
    elements.categoryContainer.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.className = 'px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-indigo-600 hover:text-white';
        btn.onclick = () => { fetchProducts(cat); setActiveCategory(btn); }
        elements.categoryContainer.appendChild(btn);
    });
}

// Active Category
function setActiveCategory(button) {
    if (!elements.categoryContainer) return;
    document.querySelectorAll('#categoryContainer button').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
    });
    button.classList.add('bg-indigo-600', 'text-white');
}

// Fetch Products
function fetchProducts(category) {
    showLoader(true);
    elements.productGrid.classList.add('hidden');
    let url = 'https://fakestoreapi.com/products';
    if (category && category !== 'All') url = `https://fakestoreapi.com/products/category/${category}`;

    fetch(url).then(res => res.json())
        .then(data => {
            state.products = data;
            // show top 3 for trending
            renderProducts(data.slice(0, 3));
            showLoader(false);
        });
}

// Render Products
// function renderProducts(products) {
//     elements.productGrid.innerHTML = '';
//     elements.productGrid.classList.remove('hidden');

//     products.forEach(product => {
//         const card = document.createElement('div');
//         card.className = 'bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-lg transition duration-300';

//         // UPDATED: Icons instead of text for buttons
//         card.innerHTML = `
//                 <div class="h-40 w-full flex items-center justify-center mb-4">
//                     <img src="${product.image}" class="max-h-full object-contain" alt="${product.title}">
//                 </div>
//                 <h3 class="font-semibold text-sm mb-2 line-clamp-1 h-5" title="${product.title}">${product.title}</h3>
//                 <p class="text-indigo-600 font-bold mb-2">$${product.price}</p>
//                 <span class="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 mb-2">${product.category}</span>
//                 <p class="text-sm mb-3 text-yellow-500">⭐ ${product.rating.rate}</p>
                
//                 <div class="flex gap-2 w-full mt-auto">
//                     <button onclick="showDetails(${product.id})" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition flex items-center justify-center" title="Details">
//                         <i class="fa-solid fa-circle-info"></i>
//                     </button>
//                     <button onclick="addToCart(${product.id})" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition flex items-center justify-center" title="Add to Cart">
//                         <i class="fa-solid fa-cart-plus"></i>
//                     </button>
//                 </div>
//             `;
//         elements.productGrid.appendChild(card);
//     });
// }
function renderProducts(products){
    const grid = document.getElementById('productGrid');
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

// Loader
function showLoader(show) {
    elements.loader.classList.toggle('hidden', !show);
}

// --- MODAL LOGIC ---
function showDetails(id) {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(product => {
            state.currentModalProductId = product.id;

            elements.mTitle.innerText = product.title;
            elements.mImage.src = product.image;
            elements.mCategory.innerText = product.category;
            elements.mPrice.innerText = '$' + product.price;
            elements.mDesc.innerText = product.description;

            // Generate Stars
            let stars = '';
            for (let i = 0; i < 5; i++) {
                if (i < Math.round(product.rating.rate)) stars += '<i class="fa-solid fa-star"></i>';
                else stars += '<i class="fa-regular fa-star"></i>';
            }
            elements.mRating.innerHTML = stars + ` <span class="text-gray-500 text-sm ml-2">(${product.rating.count})</span>`;

            elements.modal.classList.remove('hidden');
        });
}

function closeModal() {
    elements.modal.classList.add('hidden');
}

function addToCartFromModal() {
    if (state.currentModalProductId) {
        addToCart(state.currentModalProductId);
        closeModal();
    }
}

// --- CART LOGIC ---
function toggleCart() {
    elements.cartSidebar.classList.toggle('hidden');
}

function addToCart(id) {
    // Check if already in cart
    const existing = state.cart.find(p => p.id === id);
    if (existing) {
        alert("This item is already in your cart!");
        return;
    }

    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(product => {
            state.cart.push(product);
            updateCart();
        });
}

function updateCart() {
    const cart = state.cart;
    elements.cartCount.textContent = cart.length;
    elements.cartCount.classList.add('opacity-100');

    if (cart.length === 0) {
        elements.cartItemsContainer.innerHTML = `<li class="py-6 flex flex-col items-center justify-center h-64 text-gray-500">
                <i class="fa-solid fa-basket-shopping text-4xl mb-4"></i>
                <p>Your cart is empty.</p>
            </li>`;
        elements.cartTotal.textContent = '$0.00';
        return;
    }

    elements.cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');
        li.className = 'py-6 flex items-center justify-between';
        li.innerHTML = `
                <img src="${item.image}" class="h-16 w-16 object-contain rounded mr-4 border p-1">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm text-gray-800">${item.title.substring(0, 30)}...</h4>
                    <p class="text-indigo-600 font-bold text-sm">$${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 p-2"><i class="fa-solid fa-trash"></i></button>
            `;
        elements.cartItemsContainer.appendChild(li);
    });

    elements.cartTotal.textContent = '$' + total.toFixed(2);
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    updateCart();
}