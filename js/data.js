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
            category: "appetizers",
            image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop&crop=center"
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
            category: "mains",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
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
        }
    ],

    drinkItems: [
        // Hot Drinks
        {
            id: 15,
            name: "Espresso",
            description: "Rich and bold Italian espresso",
            price: 2.99,
            category: "hot",
            image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop&crop=center"
        },
        {
            id: 16,
            name: "Cappuccino",
            description: "Espresso with steamed milk and foam",
            price: 4.99,
            category: "hot",
            image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&crop=center"
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
            category: "cold",
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&crop=center"
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
    ]
};