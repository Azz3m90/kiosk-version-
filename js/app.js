// Global variables
let cart = [];
let currentStep = 'food';
const TAX_RATE = 0.085; // 8.5% tax
let currentLanguage = 'en'; // Default language
let modalItem = null; // Current item in options modal
let modalQuantity = 1; // Quantity in options modal
let modalSelectedOptions = {}; // Selected options in modal

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
    initializeLanguageSelector();
    
    // Expose functions to global scope for inline event handlers
    window.updateModalOption = updateModalOption;
    window.increaseModalQuantity = increaseModalQuantity;
    window.decreaseModalQuantity = decreaseModalQuantity;
    window.addFromModal = addFromModal;
    window.closeOptionsModal = closeOptionsModal;
    window.openOptionsModal = openOptionsModal;
    window.addToCart = addToCart;
    window.closeAlertModal = closeAlertModal;
    window.handleItemClick = handleItemClick;
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
    window.openCart = openCart;
    window.closeCart = closeCart;
    window.navigateToStep = navigateToStep;
    window.processPayment = processPayment;
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

// Language selector functionality
function initializeLanguageSelector() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeLanguage(lang);
        });
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update UI text based on selected language
    updateUILanguage();
}

function updateUILanguage() {
    const t = restaurantData.translations[currentLanguage] || restaurantData.translations.en;
    
    // Update header welcome message
    const headerTitle = document.querySelector('.header-title h1');
    if (headerTitle) {
        const welcomeText = {
            en: 'Welcome to Our Restaurant',
            fr: 'Bienvenue dans notre restaurant',
            nl: 'Welkom in ons restaurant',
            de: 'Willkommen in unserem Restaurant',
            es: 'Bienvenido a nuestro restaurante',
            it: 'Benvenuti nel nostro ristorante'
        };
        headerTitle.textContent = welcomeText[currentLanguage] || welcomeText.en;
    }
    
    // Update navigation steps
    document.querySelector('[data-step="food"] span').textContent = t.food;
    document.querySelector('[data-step="drinks"] span').textContent = t.drinks;
    document.querySelector('[data-step="review"] span').textContent = t.review;
    document.querySelector('[data-step="payment"] span').textContent = t.payment;
    
    // Update section titles
    document.querySelector('#food-section h2').textContent = t.chooseYourFood;
    document.querySelector('#drinks-section h2').textContent = t.chooseYourDrinks;
    document.querySelector('#review-section h2').textContent = t.reviewYourOrder;
    
    // Update cart
    document.querySelector('.cart-header-sidebar h3').textContent = t.yourOrder;
    document.querySelector('.view-cart-btn').innerHTML = `<i class="fas fa-shopping-cart"></i> ${t.viewCart}`;
    
    // Re-render items to update the "from" text and buttons
    renderFoodItems();
    renderDrinkItems();
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
    const t = restaurantData.translations[currentLanguage] || restaurantData.translations.en;
    const priceDisplay = item.hasOptions 
        ? `<span class="from-price">${t.from}</span> $${item.basePrice.toFixed(2)}`
        : `$${item.price.toFixed(2)}`;
    
    return `
        <div class="menu-item" onclick="handleItemClick(${item.id})">
            <img src="${item.image}" alt="${item.name}" class="item-image" loading="lazy">
            <div class="item-info">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <span class="item-price">${priceDisplay}</span>
                    <button class="add-btn" onclick="event.stopPropagation(); handleItemClick(${item.id})">
                        <i class="fas fa-plus"></i> ${item.hasOptions ? t.selectOptions : t.addToCart}
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

// Handle item click - opens modal for items with options or adds to cart directly
function handleItemClick(itemId) {
    const allItems = [...restaurantData.foodItems, ...restaurantData.drinkItems];
    const item = allItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    if (item.hasOptions) {
        openOptionsModal(item);
    } else {
        addToCart(itemId);
    }
}

// Open options modal for items with variations
function openOptionsModal(item) {
    modalItem = item;
    modalQuantity = 1;
    modalSelectedOptions = {};
    
    const modal = document.getElementById('optionsModal');
    const modalBody = document.getElementById('modalOptionsBody');
    const t = restaurantData.translations[currentLanguage] || restaurantData.translations.en;
    
    // Set item name
    document.getElementById('modalItemName').textContent = item.name;
    document.getElementById('modalQuantity').textContent = modalQuantity;
    
    // Build options HTML
    let optionsHTML = '';
    if (item.options) {
        item.options.forEach((optionGroup, index) => {
            const isRequired = optionGroup.required;
            const inputType = optionGroup.type === 'radio' ? 'radio' : 'checkbox';
            const inputName = `option_${index}`;
            const minSelection = optionGroup.minSelection || 0;
            const maxSelection = optionGroup.maxSelection || Infinity;
            
            // Initialize selected options
            if (isRequired && inputType === 'radio') {
                modalSelectedOptions[inputName] = [optionGroup.choices[0]];
            } else if (inputType === 'checkbox' && minSelection > 0) {
                // Pre-select minimum required items for checkboxes
                modalSelectedOptions[inputName] = optionGroup.choices.slice(0, minSelection);
            }
            
            // Build selection info text
            let selectionInfo = '';
            if (inputType === 'checkbox' && (minSelection > 0 || maxSelection !== Infinity)) {
                if (minSelection > 0 && maxSelection !== Infinity) {
                    selectionInfo = minSelection === maxSelection 
                        ? `(Select exactly ${minSelection})` 
                        : `(Select ${minSelection}-${maxSelection})`;
                } else if (minSelection > 0) {
                    selectionInfo = `(Min: ${minSelection})`;
                } else if (maxSelection !== Infinity) {
                    selectionInfo = `(Max: ${maxSelection})`;
                }
            }
            
            optionsHTML += `
                <div class="option-group" data-group="${inputName}">
                    <div class="option-group-title">
                        ${optionGroup.name}
                        <div class="option-badges">
                            <span class="${isRequired ? 'required-badge' : 'optional-badge'}">
                                ${isRequired ? t.required : t.optional}
                            </span>
                            ${selectionInfo ? `<span class="selection-info">${selectionInfo}</span>` : ''}
                        </div>
                    </div>
                    <div class="option-items">
            `;
            
            optionGroup.choices.forEach((choice, choiceIndex) => {
                const isChecked = (isRequired && inputType === 'radio' && choiceIndex === 0) ||
                                 (inputType === 'checkbox' && choiceIndex < minSelection);
                const priceText = choice.price > 0 ? `+$${choice.price.toFixed(2)}` : '';
                
                optionsHTML += `
                    <label class="option-item ${isChecked ? 'selected' : ''}">
                        <div class="option-item-info">
                            <input type="${inputType}" 
                                   name="${inputName}" 
                                   value="${choiceIndex}"
                                   ${isChecked ? 'checked' : ''}
                                   onchange="updateModalOption('${inputName}', ${choiceIndex}, ${choice.price}, '${inputType}', this)">
                            <span class="option-item-name">${choice.name}</span>
                        </div>
                        <span class="option-item-price">${priceText}</span>
                    </label>
                `;
            });
            
            optionsHTML += `
                    </div>
                </div>
            `;
        });
    }
    
    modalBody.innerHTML = optionsHTML;
    
    // Update total price
    updateModalPrice();
    
    // Show modal
    modal.classList.add('active');
}

// Close options modal
function closeOptionsModal() {
    const modal = document.getElementById('optionsModal');
    modal.classList.remove('active');
    modalItem = null;
    modalQuantity = 1;
    modalSelectedOptions = {};
}

// Update selected option
function updateModalOption(groupName, choiceIndex, price, type, element) {
    const optionGroup = modalItem.options.find((_, index) => `option_${index}` === groupName);
    const choice = optionGroup.choices[choiceIndex];
    
    if (type === 'radio') {
        modalSelectedOptions[groupName] = [choice];
        
        // Update selected class for radio buttons
        element.closest('.option-items').querySelectorAll('.option-item').forEach(item => {
            item.classList.remove('selected');
        });
        element.closest('.option-item').classList.add('selected');
    } else {
        // Checkbox handling with min/max validation
        if (!modalSelectedOptions[groupName]) {
            modalSelectedOptions[groupName] = [];
        }
        
        const currentSelections = modalSelectedOptions[groupName];
        const maxSelection = optionGroup.maxSelection || Infinity;
        const minSelection = optionGroup.minSelection || 0;
        
        if (element.checked) {
            // Check max selection limit
            if (currentSelections.length >= maxSelection) {
                element.checked = false;
                // Show notification
                showSelectionLimit(optionGroup.name, maxSelection);
                return;
            }
            modalSelectedOptions[groupName].push(choice);
            element.closest('.option-item').classList.add('selected');
        } else {
            // Check min selection limit
            if (currentSelections.length <= minSelection) {
                element.checked = true;
                // Show notification
                showSelectionLimit(optionGroup.name, minSelection, true);
                return;
            }
            const index = modalSelectedOptions[groupName].findIndex(c => c.name === choice.name);
            if (index > -1) {
                modalSelectedOptions[groupName].splice(index, 1);
            }
            element.closest('.option-item').classList.remove('selected');
        }
        
        // Update selection counter if exists
        updateSelectionCounter(groupName, modalSelectedOptions[groupName].length, optionGroup);
    }
    
    updateModalPrice();
}

// Show selection limit notification
function showSelectionLimit(groupName, limit, isMinimum = false) {
    const message = isMinimum 
        ? `Minimum ${limit} selection${limit > 1 ? 's' : ''} required for ${groupName}`
        : `Maximum ${limit} selection${limit > 1 ? 's' : ''} allowed for ${groupName}`;
    
    const notification = document.createElement('div');
    notification.className = 'selection-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update selection counter for options with limits
function updateSelectionCounter(groupName, currentCount, optionGroup) {
    const optionDiv = document.querySelector(`[data-group="${groupName}"]`);
    if (!optionDiv) return;
    
    let counter = optionDiv.querySelector('.selection-counter');
    if (!counter && (optionGroup.minSelection || optionGroup.maxSelection)) {
        counter = document.createElement('span');
        counter.className = 'selection-counter';
        optionDiv.querySelector('.option-header').appendChild(counter);
    }
    
    if (counter) {
        const min = optionGroup.minSelection || 0;
        const max = optionGroup.maxSelection || 'unlimited';
        counter.textContent = `(${currentCount}/${max === 'unlimited' ? '∞' : max})`;
        
        if (currentCount < min) {
            counter.classList.add('invalid');
        } else {
            counter.classList.remove('invalid');
        }
    }
}

// Increase modal quantity
function increaseModalQuantity() {
    modalQuantity++;
    document.getElementById('modalQuantity').textContent = modalQuantity;
    updateModalPrice();
}

// Decrease modal quantity
function decreaseModalQuantity() {
    if (modalQuantity > 1) {
        modalQuantity--;
        document.getElementById('modalQuantity').textContent = modalQuantity;
        updateModalPrice();
    }
}

// Update modal total price
function updateModalPrice() {
    let totalPrice = modalItem.basePrice;
    
    // Add prices for selected options
    Object.values(modalSelectedOptions).forEach(choices => {
        choices.forEach(choice => {
            totalPrice += choice.price;
        });
    });
    
    totalPrice *= modalQuantity;
    document.getElementById('modalTotalPrice').textContent = totalPrice.toFixed(2);
}

// Add item from modal to cart
function addFromModal() {
    if (!modalItem) return;
    
    // Validate all required selections and minimum selections
    const validationError = validateModalSelections();
    if (validationError) {
        showValidationError(validationError);
        return;
    }
    
    // Create a unique identifier for this specific configuration
    const optionsSignature = JSON.stringify(modalSelectedOptions);
    const uniqueId = `${modalItem.id}_${optionsSignature}`;
    
    // Calculate total price for one item
    let itemPrice = modalItem.basePrice;
    Object.values(modalSelectedOptions).forEach(choices => {
        choices.forEach(choice => {
            itemPrice += choice.price;
        });
    });
    
    // Check if this exact configuration exists in cart
    const existingItem = cart.find(cartItem => cartItem.uniqueId === uniqueId);
    
    if (existingItem) {
        existingItem.quantity += modalQuantity;
    } else {
        cart.push({
            ...modalItem,
            uniqueId: uniqueId,
            quantity: modalQuantity,
            selectedOptions: modalSelectedOptions,
            price: itemPrice,
            optionsDisplay: formatSelectedOptions(modalSelectedOptions)
        });
    }
    
    updateCartDisplay();
    closeOptionsModal();
    showAddToCartAnimation();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = `✓ Added ${modalQuantity} × ${modalItem.name} to cart`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Validate modal selections
function validateModalSelections() {
    if (!modalItem.options) return null;
    
    for (let index = 0; index < modalItem.options.length; index++) {
        const optionGroup = modalItem.options[index];
        const inputName = `option_${index}`;
        const selections = modalSelectedOptions[inputName] || [];
        
        // Check required options
        if (optionGroup.required && selections.length === 0) {
            return `Please select ${optionGroup.name}`;
        }
        
        // Check minimum selections for checkboxes
        if (optionGroup.type === 'checkbox' && optionGroup.minSelection) {
            if (selections.length < optionGroup.minSelection) {
                return `Please select at least ${optionGroup.minSelection} option${optionGroup.minSelection > 1 ? 's' : ''} for ${optionGroup.name}`;
            }
        }
        
        // Check maximum selections (should not happen with proper UI, but for safety)
        if (optionGroup.type === 'checkbox' && optionGroup.maxSelection) {
            if (selections.length > optionGroup.maxSelection) {
                return `Please select at most ${optionGroup.maxSelection} option${optionGroup.maxSelection > 1 ? 's' : ''} for ${optionGroup.name}`;
            }
        }
    }
    
    return null;
}

// Show validation error
function showValidationError(message) {
    const notification = document.createElement('div');
    notification.className = 'validation-error';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Format selected options for display
function formatSelectedOptions(selectedOptions) {
    const optionsList = [];
    Object.values(selectedOptions).forEach(choices => {
        choices.forEach(choice => {
            optionsList.push(choice.name);
        });
    });
    return optionsList.join(', ');
}

function addToCart(itemId) {
    const allItems = [...restaurantData.foodItems, ...restaurantData.drinkItems];
    const item = allItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    // For items without options, use the regular flow
    const existingItem = cart.find(cartItem => cartItem.id === itemId && !cartItem.uniqueId);
    
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

function removeFromCart(itemIdentifier) {
    if (typeof itemIdentifier === 'string') {
        // Remove by uniqueId for items with options
        cart = cart.filter(item => item.uniqueId !== itemIdentifier);
    } else {
        // Remove by id for items without options
        cart = cart.filter(item => !(item.id === itemIdentifier && !item.uniqueId));
    }
    
    updateCartDisplay();
    updateOrderReview();
}

function updateQuantity(itemIdentifier, change) {
    let item;
    if (typeof itemIdentifier === 'string') {
        // Find by uniqueId for items with options
        item = cart.find(cartItem => cartItem.uniqueId === itemIdentifier);
    } else {
        // Find by id for items without options
        item = cart.find(cartItem => cartItem.id === itemIdentifier && !cartItem.uniqueId);
    }
    
    if (!item) {
        console.warn('Item not found in cart:', itemIdentifier);
        return;
    }
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemIdentifier);
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
            cartItems.innerHTML = cart.map((item, index) => {
                // Use proper escaped quotes for string identifiers
                const itemIdentifier = item.uniqueId ? `'${item.uniqueId.replace(/'/g, "\\'")}'` : item.id;
                const optionsText = item.optionsDisplay ? `<small style="color: #666; display: block; font-size: 0.85em; margin-top: 2px;">${item.optionsDisplay}</small>` : '';
                
                return `
                    <div class="cart-item" data-cart-index="${index}">
                        <div class="cart-item-info">
                            <h5>${item.name}</h5>
                            ${optionsText}
                            <p>$${item.price.toFixed(2)} each</p>
                        </div>
                        <div class="cart-item-controls">
                            <button class="qty-btn qty-decrease" data-identifier="${item.uniqueId || item.id}" type="button">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn qty-increase" data-identifier="${item.uniqueId || item.id}" type="button">+</button>
                            <button class="remove-btn" data-identifier="${item.uniqueId || item.id}" type="button">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Add event listeners after setting innerHTML
            addCartEventListeners();
        }
    }
    
    updateOrderReview();
    updatePaymentTotal();
}

function addCartEventListeners() {
    // Add event listeners for cart item controls
    document.querySelectorAll('.cart-item-controls .qty-decrease').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const identifier = this.getAttribute('data-identifier');
            // Convert to number if it's a numeric string
            const itemId = isNaN(identifier) ? identifier : parseInt(identifier);
            updateQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.cart-item-controls .qty-increase').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const identifier = this.getAttribute('data-identifier');
            // Convert to number if it's a numeric string
            const itemId = isNaN(identifier) ? identifier : parseInt(identifier);
            updateQuantity(itemId, 1);
        });
    });
    
    document.querySelectorAll('.cart-item-controls .remove-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const identifier = this.getAttribute('data-identifier');
            // Convert to number if it's a numeric string
            const itemId = isNaN(identifier) ? identifier : parseInt(identifier);
            removeFromCart(itemId);
        });
    });
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
    
    orderItems.innerHTML = cart.map((item, index) => {
        const optionsText = item.optionsDisplay ? `<small style="color: #666; display: block; font-size: 0.85em;">${item.optionsDisplay}</small>` : '';
        
        return `
            <div class="order-item" data-cart-index="${index}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    ${optionsText}
                    <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn qty-decrease-review" data-identifier="${item.uniqueId || item.id}" type="button">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn qty-increase-review" data-identifier="${item.uniqueId || item.id}" type="button">+</button>
                    <button class="remove-btn remove-review" data-identifier="${item.uniqueId || item.id}" type="button">Remove</button>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    // Add event listeners for review section
    addReviewEventListeners();
    
    if (subtotal) subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
    if (tax) tax.textContent = `$${taxAmount.toFixed(2)}`;
    if (total) total.textContent = `$${totalAmount.toFixed(2)}`;
}

function addReviewEventListeners() {
    // Add event listeners for review section controls
    document.querySelectorAll('.quantity-controls .qty-decrease-review').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const identifier = this.getAttribute('data-identifier');
            // Convert to number if it's a numeric string
            const itemId = isNaN(identifier) ? identifier : parseInt(identifier);
            updateQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-controls .qty-increase-review').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const identifier = this.getAttribute('data-identifier');
            // Convert to number if it's a numeric string
            const itemId = isNaN(identifier) ? identifier : parseInt(identifier);
            updateQuantity(itemId, 1);
        });
    });
    
    document.querySelectorAll('.quantity-controls .remove-review').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const identifier = this.getAttribute('data-identifier');
            // Convert to number if it's a numeric string
            const itemId = isNaN(identifier) ? identifier : parseInt(identifier);
            removeFromCart(itemId);
        });
    });
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

// Language Switching Functions
function initializeLanguage() {
    // Add event listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });
    
    // Set initial language
    switchLanguage(currentLanguage);
}

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update all UI text
    updateUIText();
    
    // Re-render items with new language
    renderFoodItems();
    renderDrinkItems();
}

function updateUIText() {
    const t = restaurantData.translations[currentLanguage] || restaurantData.translations.en;
    
    // Update navigation labels
    document.querySelector('.step[data-step="food"] span').textContent = t.food;
    document.querySelector('.step[data-step="drinks"] span').textContent = t.drinks;
    document.querySelector('.step[data-step="review"] span').textContent = t.review;
    document.querySelector('.step[data-step="payment"] span').textContent = t.payment;
    
    // Update section titles
    const foodSection = document.querySelector('#food-section h2');
    if (foodSection) foodSection.textContent = t.chooseYourFood;
    
    const drinksSection = document.querySelector('#drinks-section h2');
    if (drinksSection) drinksSection.textContent = t.chooseYourDrinks;
    
    const reviewSection = document.querySelector('#review-section h2');
    if (reviewSection) reviewSection.textContent = t.reviewYourOrder;
    
    // Update sidebar text
    const cartHeader = document.querySelector('.cart-header-sidebar h3');
    if (cartHeader) cartHeader.textContent = t.yourOrder;
    
    const viewCartBtn = document.querySelector('.view-cart-btn');
    if (viewCartBtn) {
        viewCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> ${t.viewCart}`;
    }
    
    // Update filter buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        const category = btn.dataset.category;
        if (category === 'all') {
            btn.textContent = btn.closest('#food-section') ? t.allItems : t.allDrinks;
        } else if (category === 'appetizers') {
            btn.textContent = t.appetizers;
        } else if (category === 'mains') {
            btn.textContent = t.mainCourses;
        } else if (category === 'desserts') {
            btn.textContent = t.desserts;
        } else if (category === 'hot') {
            btn.textContent = t.hotDrinks;
        } else if (category === 'cold') {
            btn.textContent = t.coldDrinks;
        } else if (category === 'alcoholic') {
            btn.textContent = t.alcoholic;
        }
    });
}