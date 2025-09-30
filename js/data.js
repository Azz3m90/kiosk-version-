// Sample restaurant data
const restaurantData = {
    name: "Delicious Bites",
    logo: "assets/logo.png",
    
    foodItems: [
        // Appetizers
        {
            id: 1,
            name: "Buffalo Wings",
            description: "Spicy buffalo wings served with celery and blue cheese dip",
            price: 12.99,
            basePrice: 12.99,
            category: "appetizers",
            image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Quantity",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "6 pieces", price: 0 },
                        { name: "12 pieces", price: 6.00 },
                        { name: "24 pieces", price: 10.00 }
                    ]
                },
                {
                    name: "Spice Level",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Mild", price: 0 },
                        { name: "Medium", price: 0 },
                        { name: "Hot", price: 0 },
                        { name: "Extra Hot", price: 0 }
                    ]
                },
                {
                    name: "Extra Sauces",
                    type: "checkbox",
                    required: false,
                    choices: [
                        { name: "Extra Blue Cheese", price: 1.50 },
                        { name: "Ranch Dressing", price: 1.50 },
                        { name: "BBQ Sauce", price: 1.50 }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: "Loaded Nachos",
            description: "Crispy nachos topped with cheese, jalapeños, and sour cream",
            price: 10.99,
            category: "appetizers",
            image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 3,
            name: "Mozzarella Sticks",
            description: "Golden fried mozzarella sticks with marinara sauce",
            price: 8.99,
            category: "appetizers",
            image: "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 4,
            name: "Calamari Rings",
            description: "Crispy fried squid rings with spicy aioli",
            price: 11.99,
            category: "appetizers",
            image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&crop=center"
        },

        // Main Courses
        {
            id: 5,
            name: "Classic Cheeseburger",
            description: "Juicy beef patty with cheese, lettuce, tomato, and pickles",
            price: 15.99,
            basePrice: 15.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Size",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Regular (6 oz)", price: 0 },
                        { name: "Large (8 oz)", price: 3.00 },
                        { name: "Double (12 oz)", price: 6.00 }
                    ]
                },
                {
                    name: "Extras",
                    type: "checkbox",
                    required: false,
                    choices: [
                        { name: "Extra Cheese", price: 1.50 },
                        { name: "Bacon", price: 2.50 },
                        { name: "Avocado", price: 2.00 },
                        { name: "Caramelized Onions", price: 1.00 },
                        { name: "Mushrooms", price: 1.50 }
                    ]
                },
                {
                    name: "Side",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "French Fries", price: 0 },
                        { name: "Sweet Potato Fries", price: 2.00 },
                        { name: "Onion Rings", price: 2.50 },
                        { name: "Side Salad", price: 1.50 }
                    ]
                }
            ]
        },
        {
            id: 6,
            name: "BBQ Ribs",
            description: "Slow-cooked pork ribs with our signature BBQ sauce",
            price: 22.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 7,
            name: "Grilled Salmon",
            description: "Fresh Atlantic salmon with lemon herb butter",
            price: 24.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1485704686097-ed47f7263ca4?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 8,
            name: "Chicken Alfredo",
            description: "Creamy alfredo pasta with grilled chicken breast",
            price: 18.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc6d2c5f7?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 9,
            name: "Vegetarian Pizza",
            description: "Wood-fired pizza with fresh vegetables and mozzarella",
            price: 16.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 10,
            name: "Steak Fajitas",
            description: "Sizzling beef fajitas with peppers and onions",
            price: 19.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
        },
        
        // Combo Meals
        {
            id: 21,
            name: "Crispy Chicken Deluxe Menu",
            description: "Crispy chicken burger with fries, drink and sauce",
            price: 14.99,
            basePrice: 14.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1626078201527-35164f35947f?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Burger Type",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Classic Crispy", price: 0 },
                        { name: "Spicy Nashville", price: 1.50 },
                        { name: "BBQ Ranch", price: 1.00 },
                        { name: "Buffalo Style", price: 1.50 }
                    ]
                },
                {
                    name: "Side Choice",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Regular Fries", price: 0 },
                        { name: "Sweet Potato Fries", price: 2.00 },
                        { name: "Onion Rings", price: 2.50 },
                        { name: "Coleslaw", price: 0 }
                    ]
                },
                {
                    name: "Drink",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Coca Cola", price: 0 },
                        { name: "Sprite", price: 0 },
                        { name: "Orange Fanta", price: 0 },
                        { name: "Lemonade", price: 0 },
                        { name: "Iced Tea", price: 0.50 },
                        { name: "Fresh Juice", price: 2.00 }
                    ]
                },
                {
                    name: "Sauces",
                    type: "checkbox",
                    required: false,
                    choices: [
                        { name: "Mayo", price: 0 },
                        { name: "Ketchup", price: 0 },
                        { name: "BBQ Sauce", price: 0.50 },
                        { name: "Honey Mustard", price: 0.50 },
                        { name: "Chipotle Aioli", price: 0.75 },
                        { name: "Garlic Sauce", price: 0.75 }
                    ]
                }
            ]
        },
        {
            id: 22,
            name: "Family Feast Deal",
            description: "Perfect for 4 people: 4 burgers, 4 fries, 4 drinks, and appetizer platter",
            price: 49.99,
            basePrice: 49.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Burger Selection (Choose 4)",
                    type: "checkbox",
                    required: true,
                    maxSelection: 4,
                    minSelection: 4,
                    choices: [
                        { name: "Classic Beef Burger", price: 0 },
                        { name: "Cheeseburger", price: 0 },
                        { name: "Chicken Burger", price: 0 },
                        { name: "Veggie Burger", price: 0 },
                        { name: "BBQ Bacon Burger", price: 2.00 },
                        { name: "Mushroom Swiss", price: 2.00 }
                    ]
                },
                {
                    name: "Appetizer",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Mozzarella Sticks (8 pcs)", price: 0 },
                        { name: "Chicken Wings (12 pcs)", price: 3.00 },
                        { name: "Nachos Supreme", price: 2.00 },
                        { name: "Onion Rings Basket", price: 0 }
                    ]
                },
                {
                    name: "Drinks (4 included)",
                    type: "checkbox",
                    required: false,
                    choices: [
                        { name: "Upgrade all to Large", price: 4.00 },
                        { name: "Add Kids Juice Boxes", price: 3.00 }
                    ]
                }
            ]
        },
        {
            id: 23,
            name: "Party Bucket Combo",
            description: "20 pieces mixed chicken, 4 sides, 6 sauces",
            price: 39.99,
            basePrice: 39.99,
            category: "mains",
            image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Chicken Mix",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "All Original Recipe", price: 0 },
                        { name: "All Extra Crispy", price: 2.00 },
                        { name: "Half & Half Mix", price: 1.00 },
                        { name: "Spicy Mix", price: 2.50 }
                    ]
                },
                {
                    name: "4 Sides Selection",
                    type: "checkbox",
                    required: true,
                    maxSelection: 4,
                    minSelection: 4,
                    choices: [
                        { name: "Large Fries", price: 0 },
                        { name: "Mashed Potatoes", price: 0 },
                        { name: "Coleslaw", price: 0 },
                        { name: "Mac & Cheese", price: 1.50 },
                        { name: "Corn on the Cob", price: 1.00 },
                        { name: "Biscuits (6 pcs)", price: 1.00 }
                    ]
                },
                {
                    name: "Extra Add-ons",
                    type: "checkbox",
                    required: false,
                    choices: [
                        { name: "6 Extra Pieces", price: 12.00 },
                        { name: "Extra Large Gravy", price: 3.00 },
                        { name: "6-Pack Drinks", price: 8.00 }
                    ]
                }
            ]
        },

        // Desserts
        {
            id: 11,
            name: "Chocolate Lava Cake",
            description: "Warm chocolate cake with molten center and vanilla ice cream",
            price: 7.99,
            category: "desserts",
            image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 12,
            name: "New York Cheesecake",
            description: "Classic creamy cheesecake with berry compote",
            price: 6.99,
            category: "desserts",
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 13,
            name: "Tiramisu",
            description: "Traditional Italian dessert with coffee and mascarpone",
            price: 8.99,
            category: "desserts",
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 14,
            name: "Apple Pie",
            description: "Homemade apple pie with cinnamon and vanilla ice cream",
            price: 6.99,
            category: "desserts",
            image: "https://images.unsplash.com/photo-1535920527002-b35e96722b7e?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 24,
            name: "Ice Cream Sundae",
            description: "Build your own ice cream sundae with toppings",
            price: 5.99,
            basePrice: 5.99,
            category: "desserts",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Ice Cream Flavors (Choose 2)",
                    type: "checkbox",
                    required: true,
                    minSelection: 2,
                    maxSelection: 2,
                    choices: [
                        { name: "Vanilla", price: 0 },
                        { name: "Chocolate", price: 0 },
                        { name: "Strawberry", price: 0 },
                        { name: "Mint Chocolate", price: 0 },
                        { name: "Cookie Dough", price: 0.50 },
                        { name: "Salted Caramel", price: 0.50 }
                    ]
                },
                {
                    name: "Toppings",
                    type: "checkbox",
                    required: false,
                    maxSelection: 3,
                    choices: [
                        { name: "Hot Fudge", price: 1.00 },
                        { name: "Caramel Sauce", price: 1.00 },
                        { name: "Whipped Cream", price: 0.50 },
                        { name: "Chopped Nuts", price: 0.75 },
                        { name: "Sprinkles", price: 0.50 },
                        { name: "Cherry on Top", price: 0.25 }
                    ]
                }
            ]
        }
    ],

    drinkItems: [
        // Hot Drinks
        {
            id: 15,
            name: "Espresso",
            description: "Rich and bold Italian espresso",
            price: 2.99,
            basePrice: 2.99,
            category: "hot",
            image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Size",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Single Shot", price: 0 },
                        { name: "Double Shot", price: 1.50 },
                        { name: "Triple Shot", price: 2.50 }
                    ]
                },
                {
                    name: "Extras",
                    type: "checkbox",
                    required: false,
                    choices: [
                        { name: "Extra Sugar", price: 0 },
                        { name: "Vanilla Syrup", price: 0.50 },
                        { name: "Caramel Syrup", price: 0.50 },
                        { name: "Hazelnut Syrup", price: 0.50 }
                    ]
                }
            ]
        },
        {
            id: 16,
            name: "Cappuccino",
            description: "Espresso with steamed milk and foam",
            price: 4.99,
            basePrice: 4.99,
            category: "hot",
            image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Size",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Small", price: 0 },
                        { name: "Medium", price: 1.00 },
                        { name: "Large", price: 2.00 }
                    ]
                },
                {
                    name: "Milk Type",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Whole Milk", price: 0 },
                        { name: "Skim Milk", price: 0 },
                        { name: "Soy Milk", price: 0.50 },
                        { name: "Almond Milk", price: 0.50 },
                        { name: "Oat Milk", price: 0.75 }
                    ]
                }
            ]
        },
        {
            id: 17,
            name: "Hot Chocolate",
            description: "Rich cocoa with whipped cream and marshmallows",
            price: 3.99,
            category: "hot",
            image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 18,
            name: "Green Tea",
            description: "Premium organic green tea",
            price: 2.99,
            category: "hot",
            image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&crop=center"
        },

        // Cold Drinks
        {
            id: 19,
            name: "Fresh Orange Juice",
            description: "Freshly squeezed orange juice",
            price: 4.99,
            category: "cold",
            image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 20,
            name: "Iced Coffee",
            description: "Cold brew coffee with milk and sugar",
            price: 3.99,
            basePrice: 3.99,
            category: "cold",
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&crop=center",
            hasOptions: true,
            options: [
                {
                    name: "Size",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Regular (12 oz)", price: 0 },
                        { name: "Large (16 oz)", price: 1.50 },
                        { name: "Extra Large (20 oz)", price: 2.50 }
                    ]
                },
                {
                    name: "Coffee Strength",
                    type: "radio",
                    required: true,
                    choices: [
                        { name: "Regular", price: 0 },
                        { name: "Extra Shot", price: 1.00 },
                        { name: "Double Extra Shot", price: 2.00 }
                    ]
                },
                {
                    name: "Milk & Flavoring",
                    type: "checkbox",
                    required: false,
                    choices: [
                        { name: "Extra Ice", price: 0 },
                        { name: "Vanilla Syrup", price: 0.50 },
                        { name: "Caramel Drizzle", price: 0.75 },
                        { name: "Whipped Cream", price: 0.50 },
                        { name: "Extra Milk", price: 0 }
                    ]
                }
            ]
        },
        {
            id: 21,
            name: "Lemonade",
            description: "Fresh squeezed lemonade with mint",
            price: 3.49,
            category: "cold",
            image: "https://images.unsplash.com/photo-1523371683702-af5338c7ade6?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 22,
            name: "Smoothie Bowl",
            description: "Mixed berry smoothie with granola toppings",
            price: 6.99,
            category: "cold",
            image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 23,
            name: "Coca Cola",
            description: "Classic Coca Cola served with ice",
            price: 2.49,
            category: "cold",
            image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 24,
            name: "Sparkling Water",
            description: "Premium sparkling water with lime",
            price: 2.99,
            category: "cold",
            image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
        },

        // Alcoholic
        {
            id: 25,
            name: "Draft Beer",
            description: "Local craft beer on tap",
            price: 5.99,
            category: "alcoholic",
            image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 26,
            name: "House Wine",
            description: "Red or white wine by the glass",
            price: 7.99,
            category: "alcoholic",
            image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 27,
            name: "Margarita",
            description: "Classic lime margarita with salt rim",
            price: 9.99,
            category: "alcoholic",
            image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 28,
            name: "Mojito",
            description: "Fresh mint mojito with rum and lime",
            price: 8.99,
            category: "alcoholic",
            image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop&crop=center"
        }
    ],
    
    // Multi-language translations
    translations: {
        en: {
            // Navigation
            food: "Food",
            drinks: "Drinks", 
            review: "Review",
            payment: "Payment",
            
            // UI Text
            yourOrder: "Your Order",
            items: "items",
            total: "Total",
            viewCart: "View Cart",
            clearCart: "Clear Cart",
            addToCart: "Add",
            selectOptions: "Select",
            from: "from",
            
            // Sections
            chooseYourFood: "Choose Your Food",
            chooseYourDrinks: "Choose Your Drinks",
            reviewYourOrder: "Review Your Order",
            
            // Filters
            allItems: "All Items",
            appetizers: "Appetizers",
            mainCourses: "Main Courses",
            desserts: "Desserts",
            allDrinks: "All Drinks",
            hotDrinks: "Hot Drinks",
            coldDrinks: "Cold Drinks",
            alcoholic: "Alcoholic",
            
            // Modal
            quantity: "Quantity",
            required: "Required",
            optional: "Optional",
            cancel: "Cancel",
            
            // Navigation buttons
            next: "Next",
            back: "Back",
            proceedToPayment: "Proceed to Payment",
            completeOrder: "Complete Order"
        },
        fr: {
            // Navigation
            food: "Nourriture",
            drinks: "Boissons",
            review: "Vérifier",
            payment: "Paiement",
            
            // UI Text
            yourOrder: "Votre Commande",
            items: "articles",
            total: "Total",
            viewCart: "Voir Panier",
            clearCart: "Vider Panier",
            addToCart: "Ajouter",
            selectOptions: "Sélectionner",
            from: "à partir de",
            
            // Sections
            chooseYourFood: "Choisissez Votre Nourriture",
            chooseYourDrinks: "Choisissez Vos Boissons",
            reviewYourOrder: "Vérifier Votre Commande",
            
            // Filters
            allItems: "Tous les Articles",
            appetizers: "Entrées",
            mainCourses: "Plats Principaux",
            desserts: "Desserts",
            allDrinks: "Toutes les Boissons",
            hotDrinks: "Boissons Chaudes",
            coldDrinks: "Boissons Froides",
            alcoholic: "Alcoolisées",
            
            // Modal
            quantity: "Quantité",
            required: "Obligatoire",
            optional: "Optionnel",
            cancel: "Annuler",
            
            // Navigation buttons
            next: "Suivant",
            back: "Retour",
            proceedToPayment: "Procéder au Paiement",
            completeOrder: "Terminer la Commande"
        },
        nl: {
            // Navigation
            food: "Eten",
            drinks: "Dranken",
            review: "Nakijken",
            payment: "Betaling",
            
            // UI Text
            yourOrder: "Uw Bestelling",
            items: "items",
            total: "Totaal",
            viewCart: "Winkelwagen Bekijken",
            clearCart: "Winkelwagen Legen",
            addToCart: "Toevoegen",
            selectOptions: "Selecteer",
            from: "vanaf",
            
            // Sections
            chooseYourFood: "Kies Uw Eten",
            chooseYourDrinks: "Kies Uw Dranken",
            reviewYourOrder: "Controleer Uw Bestelling",
            
            // Filters
            allItems: "Alle Items",
            appetizers: "Voorgerechten",
            mainCourses: "Hoofdgerechten",
            desserts: "Desserts",
            allDrinks: "Alle Dranken",
            hotDrinks: "Warme Dranken",
            coldDrinks: "Koude Dranken",
            alcoholic: "Alcoholisch",
            
            // Modal
            quantity: "Aantal",
            required: "Verplicht",
            optional: "Optioneel",
            cancel: "Annuleren",
            
            // Navigation buttons
            next: "Volgende",
            back: "Terug",
            proceedToPayment: "Ga naar Betaling",
            completeOrder: "Bestelling Voltooien"
        },
        de: {
            // Navigation
            food: "Essen",
            drinks: "Getränke",
            review: "Überprüfen",
            payment: "Zahlung",
            
            // UI Text
            yourOrder: "Ihre Bestellung",
            items: "Artikel",
            total: "Gesamt",
            viewCart: "Warenkorb Anzeigen",
            clearCart: "Warenkorb Leeren",
            addToCart: "Hinzufügen",
            selectOptions: "Auswählen",
            from: "ab",
            
            // Sections
            chooseYourFood: "Wählen Sie Ihr Essen",
            chooseYourDrinks: "Wählen Sie Ihre Getränke",
            reviewYourOrder: "Überprüfen Sie Ihre Bestellung",
            
            // Filters
            allItems: "Alle Artikel",
            appetizers: "Vorspeisen",
            mainCourses: "Hauptgerichte",
            desserts: "Desserts",
            allDrinks: "Alle Getränke",
            hotDrinks: "Heiße Getränke",
            coldDrinks: "Kalte Getränke",
            alcoholic: "Alkoholisch",
            
            // Modal
            quantity: "Menge",
            required: "Erforderlich",
            optional: "Optional",
            cancel: "Abbrechen",
            
            // Navigation buttons
            next: "Weiter",
            back: "Zurück",
            proceedToPayment: "Zur Zahlung",
            completeOrder: "Bestellung Abschließen"
        },
        es: {
            // Navigation
            food: "Comida",
            drinks: "Bebidas",
            review: "Revisar",
            payment: "Pago",
            
            // UI Text
            yourOrder: "Su Pedido",
            items: "artículos",
            total: "Total",
            viewCart: "Ver Carrito",
            clearCart: "Vaciar Carrito",
            addToCart: "Añadir",
            selectOptions: "Seleccionar",
            from: "desde",
            
            // Sections
            chooseYourFood: "Elija Su Comida",
            chooseYourDrinks: "Elija Sus Bebidas",
            reviewYourOrder: "Revise Su Pedido",
            
            // Filters
            allItems: "Todos los Artículos",
            appetizers: "Aperitivos",
            mainCourses: "Platos Principales",
            desserts: "Postres",
            allDrinks: "Todas las Bebidas",
            hotDrinks: "Bebidas Calientes",
            coldDrinks: "Bebidas Frías",
            alcoholic: "Alcohólicas",
            
            // Modal
            quantity: "Cantidad",
            required: "Requerido",
            optional: "Opcional",
            cancel: "Cancelar",
            
            // Navigation buttons
            next: "Siguiente",
            back: "Atrás",
            proceedToPayment: "Proceder al Pago",
            completeOrder: "Completar Pedido"
        },
        it: {
            // Navigation
            food: "Cibo",
            drinks: "Bevande",
            review: "Rivedi",
            payment: "Pagamento",
            
            // UI Text
            yourOrder: "Il Tuo Ordine",
            items: "articoli",
            total: "Totale",
            viewCart: "Vedi Carrello",
            clearCart: "Svuota Carrello",
            addToCart: "Aggiungi",
            selectOptions: "Seleziona",
            from: "da",
            
            // Sections
            chooseYourFood: "Scegli il Tuo Cibo",
            chooseYourDrinks: "Scegli le Tue Bevande",
            reviewYourOrder: "Rivedi il Tuo Ordine",
            
            // Filters
            allItems: "Tutti gli Articoli",
            appetizers: "Antipasti",
            mainCourses: "Piatti Principali",
            desserts: "Dessert",
            allDrinks: "Tutte le Bevande",
            hotDrinks: "Bevande Calde",
            coldDrinks: "Bevande Fredde",
            alcoholic: "Alcoliche",
            
            // Modal
            quantity: "Quantità",
            required: "Obbligatorio",
            optional: "Opzionale",
            cancel: "Annulla",
            
            // Navigation buttons
            next: "Avanti",
            back: "Indietro",
            proceedToPayment: "Procedi al Pagamento",
            completeOrder: "Completa Ordine"
        }
    }
};