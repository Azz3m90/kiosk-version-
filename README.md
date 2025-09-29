# Restaurant Kiosk System

A modern, responsive kiosk system for restaurant online ordering with a wizard-like flow.

## Features

### 🏪 Restaurant Branding

- Logo display at the top left
- Restaurant name "Delicious Bites"
- Professional, modern design

### 🍽️ Food Menu

- Grid layout displaying food items with:
  - High-quality images
  - Item names and descriptions
  - Pricing
  - Category filtering (Appetizers, Main Courses, Desserts)

### 🥤 Drinks Menu

- Similar grid layout for beverages:
  - Hot drinks (Coffee, Tea, Hot Chocolate)
  - Cold drinks (Juices, Sodas, Smoothies)
  - Alcoholic beverages
  - Category filtering

### 🛒 Shopping Cart

- Persistent cart with item count and total
- Sidebar cart view with:
  - Item management (add, remove, quantity changes)
  - Running total calculation
  - Clear cart functionality

### 🧙‍♂️ Wizard Flow

1. **Food Selection** - Browse and select food items
2. **Drinks Selection** - Add beverages to your order
3. **Review Order** - Review items, modify quantities, see pricing breakdown
4. **Payment** - Complete the order with payment options

### 💳 Payment Processing

- Multiple payment methods:
  - Credit/Debit cards
  - Cash
  - Digital wallets
- Form validation for card payments
- Order total calculation with tax (8.5%)

### 📱 Responsive Design

- Touch-friendly interface
- Mobile-optimized layout
- Adaptive grid system
- Smooth animations and transitions

## Technical Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with Grid and Flexbox
- **Vanilla JavaScript** - No external dependencies
- **Font Awesome** - Icons
- **Unsplash** - High-quality food images

## File Structure

```
kiosk/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling
├── js/
│   ├── app.js          # Main application logic
│   └── data.js         # Restaurant menu data
├── assets/
│   └── logo.png        # Restaurant logo
└── README.md           # This file
```

## How to Use

1. **Open the Application**

   - Open `index.html` in a web browser
   - The system starts on the Food selection screen

2. **Select Food Items**

   - Browse categories or view all items
   - Click on items or "Add" buttons to add to cart
   - View cart progress in the header

3. **Add Drinks**

   - Click "Next: Drinks" to proceed
   - Select beverages using the same interface

4. **Review Your Order**

   - Click "Next: Review Order"
   - Modify quantities or remove items
   - See subtotal, tax, and total

5. **Complete Payment**
   - Select payment method
   - Fill in payment details (for card payments)
   - Complete the order

## Customization

### Adding Menu Items

Edit `js/data.js` to add or modify menu items:

```javascript
{
    id: 29,
    name: "New Item",
    description: "Item description",
    price: 12.99,
    category: "mains", // or "appetizers", "desserts"
    image: "image_url_here"
}
```

### Styling Changes

Modify `css/style.css` to customize:

- Colors and branding
- Layout and spacing
- Animations and effects
- Responsive breakpoints

### Functionality Updates

Edit `js/app.js` to modify:

- Cart behavior
- Navigation flow
- Payment processing
- Form validation

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Demo Data

The system includes sample data for:

- 14 food items across 3 categories
- 14 drink items across 3 categories
- All items include images, descriptions, and pricing

## Future Enhancements

Potential additions could include:

- Order tracking system
- Customer information collection
- Kitchen display integration
- Receipt printing
- Multiple language support
- Loyalty program integration
- Table/order number assignment

## License

This project is open source and available under the MIT License.
