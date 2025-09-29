// Global variables
let cart = [];
let currentStep = 'food';
const TAX_RATE = 0.085; // 8.5% tax

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    renderFoodItems();
    renderDrinkItems();
    updateCartDisplay();
    updateStepNavigation();
}

function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.section');
            const category = this.dataset.category;
            
            // Update active category button
            section.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            if (section.id === 'food-section') {
                renderFoodItems(category);
            } else {
                renderDrinkItems(category);
            }
        });
    });

    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            const method = this.dataset.method;
            togglePaymentForm(method);
        });
    });

    // Step navigation clicks
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', function() {
            const stepName = this.dataset.step;
            if (canNavigateToStep(stepName)) {
                navigateToStep(stepName);
            }
        });
    });

    // Card number formatting
    const cardInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = formatted;
        });
    }

    // Expiry date formatting
    const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
}

function renderFoodItems(category = 'all') {
    const grid = document.getElementById('food-grid');
    let items = restaurantData.foodItems;
    
    if (category !== 'all') {
        items = items.filter(item => item.category === category);
    }
    
    grid.innerHTML = items.map(item => createMenuItemHTML(item)).join('');
}

function renderDrinkItems(category = 'all') {
    const grid = document.getElementById('drinks-grid');
    let items = restaurantData.drinkItems;
    
    if (category !== 'all') {
        items = items.filter(item => item.category === category);
    }
    
    grid.innerHTML = items.map(item => createMenuItemHTML(item)).join('');
}

function createMenuItemHTML(item) {
    return `
        <div class="menu-item" onclick="addToCart(${item.id})">
            <img src="${item.image}" alt="${item.name}" class="item-image" loading="lazy">
            <div class="item-info">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${item.id})">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addToCart(itemId) {
    const allItems = [...restaurantData.foodItems, ...restaurantData.drinkItems];
    const item = allItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showAddToCartAnimation();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateOrderReview();
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartDisplay();
        updateOrderReview();
    }
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total');
    const sidebarTotal = document.getElementById('sidebar-total');
    const cartItems = document.getElementById('cart-items');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    if (sidebarTotal) sidebarTotal.textContent = totalPrice.toFixed(2);
    
    // Update cart items display
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <p>$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    updateOrderReview();
    updatePaymentTotal();
}

function updateOrderReview() {
    const orderItems = document.getElementById('order-items');
    const subtotal = document.getElementById('subtotal');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');
    
    if (!orderItems) return;
    
    if (cart.length === 0) {
        orderItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No items in your order</p>
            </div>
        `;
        if (subtotal) subtotal.textContent = '$0.00';
        if (tax) tax.textContent = '$0.00';
        if (total) total.textContent = '$0.00';
        return;
    }
    
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotalAmount * TAX_RATE;
    const totalAmount = subtotalAmount + taxAmount;
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
            <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    if (subtotal) subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
    if (tax) tax.textContent = `$${taxAmount.toFixed(2)}`;
    if (total) total.textContent = `$${totalAmount.toFixed(2)}`;
}

function updatePaymentTotal() {
    const paymentTotal = document.getElementById('payment-total');
    if (!paymentTotal) return;
    
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotalAmount * TAX_RATE;
    const totalAmount = subtotalAmount + taxAmount;
    
    paymentTotal.textContent = `$${totalAmount.toFixed(2)}`;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function clearCart() {
    cart = [];
    updateCartDisplay();
}

function showAddToCartAnimation() {
    // Simple notification - could be enhanced with a toast notification
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

// Navigation functions
function nextStep(step) {
    if (canNavigateToStep(step)) {
        navigateToStep(step);
    }
}

function prevStep(step) {
    navigateToStep(step);
}

function canNavigateToStep(step) {
    // Add validation logic here if needed
    // For example, require items in cart before proceeding to review
    if (step === 'review' && cart.length === 0) {
        alert('Please add some items to your cart before proceeding.');
        return false;
    }
    return true;
}

function navigateToStep(step) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${step}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update step navigation
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    const activeStep = document.querySelector(`[data-step="${step}"]`);
    if (activeStep) {
        activeStep.classList.add('active');
    }
    
    currentStep = step;
    
    // Update displays when entering review or payment
    if (step === 'review') {
        updateOrderReview();
    } else if (step === 'payment') {
        updatePaymentTotal();
    }
}

function updateStepNavigation() {
    // This function can be used to enable/disable steps based on state
}

function togglePaymentForm(method) {
    const cardForm = document.getElementById('card-form');
    
    if (method === 'card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
}

function completeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items before completing your order.');
        return;
    }
    
    // Validate payment form if card is selected
    const activePaymentMethod = document.querySelector('.payment-option.active');
    if (activePaymentMethod && activePaymentMethod.dataset.method === 'card') {
        const cardNumber = document.querySelector('input[placeholder="1234 5678 9012 3456"]').value;
        const expiry = document.querySelector('input[placeholder="MM/YY"]').value;
        const cvv = document.querySelector('input[placeholder="123"]').value;
        const name = document.querySelector('input[placeholder="John Doe"]').value;
        
        if (!cardNumber || !expiry || !cvv || !name) {
            alert('Please fill in all payment details.');
            return;
        }
    }
    
    // Calculate order total
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotalAmount * TAX_RATE;
    const totalAmount = subtotalAmount + taxAmount;
    
    // Show order confirmation
    const orderNumber = Math.floor(Math.random() * 10000) + 1000;
    
    alert(`Order Completed Successfully!
    
Order Number: #${orderNumber}
Total Amount: $${totalAmount.toFixed(2)}
    
Thank you for your order! Please wait for your order to be prepared.`);
    
    // Reset the system
    cart = [];
    updateCartDisplay();
    navigateToStep('food');
    
    // Reset forms
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    document.querySelector('.payment-option[data-method="card"]').classList.add('active');
    
    // Re-render items
    renderFoodItems();
    renderDrinkItems();
}

// Utility functions
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Add any responsive adjustments if needed
});

// Initialize payment form display
document.addEventListener('DOMContentLoaded', function() {
    togglePaymentForm('card');
});