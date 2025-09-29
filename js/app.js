// Global variables
let cart = [];
let currentStep = 'food';
const TAX_RATE = 0.085; // 8.5% tax

// Enhanced Filtering System
class FilterManager {
    constructor() {
        this.filters = {
            food: {
                category: 'all',
                priceMin: 0,
                priceMax: 30,
                priceRange: 'all'
            },
            drinks: {
                category: 'all',
                priceMin: 0,
                priceMax: 15,
                priceRange: 'all'
            }
        };
        
        // Debounce timer for price range inputs
        this.debounceTimer = null;
        this.debounceDelay = 300;
        
        // Cache for filtered results to improve performance
        this.cachedResults = new Map();
    }
    
    // Debounced filter function for smooth UX
    debounceFilter(type, callback) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            callback();
            this.updateURL();
        }, this.debounceDelay);
    }
    
    // Update browser URL to maintain filter state (best practice)
    updateURL() {
        const params = new URLSearchParams();
        Object.keys(this.filters).forEach(type => {
            const filter = this.filters[type];
            if (filter.category !== 'all') params.set(`${type}Category`, filter.category);
            if (filter.priceMin > 0 || filter.priceMax < (type === 'food' ? 30 : 15)) {
                params.set(`${type}PriceMin`, filter.priceMin);
                params.set(`${type}PriceMax`, filter.priceMax);
            }
            if (filter.priceRange !== 'all') params.set(`${type}PriceRange`, filter.priceRange);
        });
        
        const newUrl = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
        history.replaceState(null, '', newUrl);
    }
    
    // Load filters from URL on page load
    loadFiltersFromURL() {
        const params = new URLSearchParams(location.search);
        
        ['food', 'drinks'].forEach(type => {
            const categoryParam = params.get(`${type}Category`);
            const priceMinParam = params.get(`${type}PriceMin`);
            const priceMaxParam = params.get(`${type}PriceMax`);
            const priceRangeParam = params.get(`${type}PriceRange`);
            
            if (categoryParam) this.filters[type].category = categoryParam;
            if (priceMinParam) this.filters[type].priceMin = parseFloat(priceMinParam);
            if (priceMaxParam) this.filters[type].priceMax = parseFloat(priceMaxParam);
            if (priceRangeParam) this.filters[type].priceRange = priceRangeParam;
        });
    }
    
    // Apply all filters to items with caching
    filterItems(items, type) {
        const filter = this.filters[type];
        const cacheKey = JSON.stringify(filter);
        
        if (this.cachedResults.has(cacheKey)) {
            return this.cachedResults.get(cacheKey);
        }
        
        let filteredItems = [...items];
        
        // Category filter
        if (filter.category !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === filter.category);
        }
        
        // Price range filter
        filteredItems = filteredItems.filter(item => 
            item.price >= filter.priceMin && item.price <= filter.priceMax
        );
        
        // Cache the result
        this.cachedResults.set(cacheKey, filteredItems);
        
        // Clear cache if it gets too large (memory management)
        if (this.cachedResults.size > 50) {
            const firstKey = this.cachedResults.keys().next().value;
            this.cachedResults.delete(firstKey);
        }
        
        return filteredItems;
    }
    
    // Reset filters for a specific type
    resetFilters(type) {
        const defaults = type === 'food' 
            ? { category: 'all', priceMin: 0, priceMax: 30, priceRange: 'all' }
            : { category: 'all', priceMin: 0, priceMax: 15, priceRange: 'all' };
        
        this.filters[type] = { ...defaults };
        this.cachedResults.clear(); // Clear cache when filters reset
        this.updateFilterUI(type);
        this.updateURL();
    }
    
    // Update UI elements to reflect current filter state
    updateFilterUI(type) {
        const filter = this.filters[type];
        
        // Update category buttons
        document.querySelectorAll(`#${type}-section .category-btn`).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === filter.category);
        });
        
        // Update price range sliders
        const minSlider = document.getElementById(`${type}-price-min`);
        const maxSlider = document.getElementById(`${type}-price-max`);
        const minDisplay = document.getElementById(`${type}-price-min-value`);
        const maxDisplay = document.getElementById(`${type}-price-max-value`);
        
        if (minSlider) minSlider.value = filter.priceMin;
        if (maxSlider) maxSlider.value = filter.priceMax;
        if (minDisplay) minDisplay.textContent = filter.priceMin.toFixed(0);
        if (maxDisplay) maxDisplay.textContent = filter.priceMax.toFixed(0);
        
        // Update quick price filter buttons
        document.querySelectorAll(`[data-type="${type}"].price-filter-btn`).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.range === filter.priceRange);
        });
    }
    
    // Set quick price range
    setQuickPriceRange(type, range) {
        const maxPrice = type === 'food' ? 30 : 15;
        
        switch (range) {
            case 'all':
                this.filters[type].priceMin = 0;
                this.filters[type].priceMax = maxPrice;
                break;
            case 'budget':
                this.filters[type].priceMin = 0;
                this.filters[type].priceMax = type === 'food' ? 15 : 5;
                break;
            case 'mid':
                this.filters[type].priceMin = type === 'food' ? 15 : 5;
                this.filters[type].priceMax = type === 'food' ? 20 : 8;
                break;
            case 'premium':
                this.filters[type].priceMin = type === 'food' ? 20 : 8;
                this.filters[type].priceMax = maxPrice;
                break;
        }
        
        this.filters[type].priceRange = range;
        this.cachedResults.clear();
    }
}

// Initialize filter manager
const filterManager = new FilterManager();

// Alert Modal Functions
function showAlertModal(message, title = 'Message') {
    const modal = document.getElementById('alertModal');
    const messageEl = document.getElementById('alertMessage');
    const titleEl = document.getElementById('alertTitle');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    modal.classList.add('active');
}

function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    modal.classList.remove('active');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeBackToTop();
});

// Back to Top functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    const contentArea = document.querySelector('.content-area');

    contentArea.addEventListener('scroll', () => {
        if (contentArea.scrollTop > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        contentArea.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeApp() {
    filterManager.loadFiltersFromURL();
    setupEventListeners();
    setupFilterEventListeners();
    renderFoodItems();
    renderDrinkItems();
    updateCartDisplay();
    updateStepNavigation();
    
    // Update UI to reflect loaded filters
    filterManager.updateFilterUI('food');
    filterManager.updateFilterUI('drinks');
}

function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.section');
            const category = this.dataset.category;
            const type = section.id === 'food-section' ? 'food' : 'drinks';
            
            // Update filter state
            filterManager.filters[type].category = category;
            filterManager.filters[type].priceRange = 'all'; // Reset price range when changing category
            filterManager.cachedResults.clear();
            
            // Update active category button
            section.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Reset and update price filter buttons
            filterManager.updateFilterUI(type);
            
            // Filter items
            if (section.id === 'food-section') {
                renderFoodItems();
            } else {
                renderDrinkItems();
            }
            
            filterManager.updateURL();
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

// Setup event listeners for enhanced filters
function setupFilterEventListeners() {
    // Price range sliders
    document.querySelectorAll('.price-range-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const type = this.dataset.type;
            const isMin = this.id.includes('min');
            const value = parseFloat(this.value);
            
            if (isMin) {
                filterManager.filters[type].priceMin = value;
                document.getElementById(`${type}-price-min-value`).textContent = value.toFixed(0);
            } else {
                filterManager.filters[type].priceMax = value;
                document.getElementById(`${type}-price-max-value`).textContent = value.toFixed(0);
            }
            
            // Ensure min doesn't exceed max and vice versa
            const minSlider = document.getElementById(`${type}-price-min`);
            const maxSlider = document.getElementById(`${type}-price-max`);
            
            if (isMin && value > parseFloat(maxSlider.value)) {
                maxSlider.value = value;
                filterManager.filters[type].priceMax = value;
                document.getElementById(`${type}-price-max-value`).textContent = value.toFixed(0);
            } else if (!isMin && value < parseFloat(minSlider.value)) {
                minSlider.value = value;
                filterManager.filters[type].priceMin = value;
                document.getElementById(`${type}-price-min-value`).textContent = value.toFixed(0);
            }
            
            // Reset quick filter to 'custom' when manually adjusting
            filterManager.filters[type].priceRange = 'custom';
            document.querySelectorAll(`[data-type="${type}"].price-filter-btn`).forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Debounced filter application
            filterManager.debounceFilter(type, () => {
                if (type === 'food') {
                    renderFoodItems();
                } else {
                    renderDrinkItems();
                }
            });
        });
    });
    
    // Quick price filter buttons
    document.querySelectorAll('.price-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            const range = this.dataset.range;
            
            // Update active button
            document.querySelectorAll(`[data-type="${type}"].price-filter-btn`).forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Set price range
            filterManager.setQuickPriceRange(type, range);
            filterManager.updateFilterUI(type);
            
            // Apply filters
            if (type === 'food') {
                renderFoodItems();
            } else {
                renderDrinkItems();
            }
            
            filterManager.updateURL();
        });
    });
    
    // Clear filters buttons
    document.querySelectorAll('.clear-filters-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            filterManager.resetFilters(type);
            
            if (type === 'food') {
                renderFoodItems();
            } else {
                renderDrinkItems();
            }
        });
    });
}

function renderFoodItems() {
    const grid = document.getElementById('food-grid');
    const resultsCount = document.getElementById('food-results-count');
    
    // Apply filters using the filter manager
    const filteredItems = filterManager.filterItems(restaurantData.foodItems, 'food');
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = filteredItems.length;
    }
    
    // Render items or show no results message
    if (filteredItems.length === 0) {
        grid.innerHTML = createNoResultsHTML('food');
    } else {
        grid.innerHTML = filteredItems.map(item => createMenuItemHTML(item)).join('');
    }
}

function renderDrinkItems() {
    const grid = document.getElementById('drinks-grid');
    const resultsCount = document.getElementById('drinks-results-count');
    
    // Apply filters using the filter manager
    const filteredItems = filterManager.filterItems(restaurantData.drinkItems, 'drinks');
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = filteredItems.length;
    }
    
    // Render items or show no results message
    if (filteredItems.length === 0) {
        grid.innerHTML = createNoResultsHTML('drinks');
    } else {
        grid.innerHTML = filteredItems.map(item => createMenuItemHTML(item)).join('');
    }
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

function createNoResultsHTML(type) {
    const suggestions = type === 'food' 
        ? ['Try selecting "All Items"', 'Increase your price range', 'Check other categories like Main Courses or Appetizers']
        : ['Try selecting "All Drinks"', 'Increase your price range', 'Check other categories like Hot or Cold drinks'];
    
    return `
        <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>No ${type === 'food' ? 'food items' : 'drinks'} found</h3>
            <p>We couldn't find any items matching your current filters.</p>
            <div class="no-results-suggestions">
                <strong>Try:</strong>
                <ul>
                    ${suggestions.map(suggestion => `<li>• ${suggestion}</li>`).join('')}
                </ul>
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
        showAlertModal('Please add some items to your cart before proceeding.', 'Cart Empty');
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
        showAlertModal('Your cart is empty. Please add some items before completing your order.', 'Cart Empty');
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
            showAlertModal('Please fill in all payment details.', 'Missing Information');
            return;
        }
    }
    
    // Calculate order total
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = subtotalAmount * TAX_RATE;
    const totalAmount = subtotalAmount + taxAmount;
    
    // Show order confirmation
    const orderNumber = Math.floor(Math.random() * 10000) + 1000;
    
    showAlertModal(`Order Completed Successfully!
    
Order Number: #${orderNumber}
Total Amount: $${totalAmount.toFixed(2)}
    
Thank you for your order! Please wait for your order to be prepared.`, 'Order Success');
    
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