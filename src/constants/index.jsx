import { Home, ListTodo, FilePlus2, Settings } from "lucide-react";

import ProfileImage from "@/assets/profile-image.jpg";
import ProductImage from "@/assets/product-image.jpg";

export const navbarLinks = [
    {
        title: "Main",
        links: [
            {
                label: "Home",
                icon: Home,
                path: "/",
            },
        ],
    },
    {
        title: "Order",
        links: [
            {
                label: "Create",
                icon: FilePlus2,
                path: "/order/create",
            },
            {
                label: "List",
                icon: ListTodo,
                path: "/order/list",
            },
        ],
    },
    {
        title: "Settings",
        links: [
            {
                label: "Settings",
                icon: Settings,
                path: "/settings",
            },
        ],
    },
];

export const overviewData = [
    { name: "Jan", total: 150 },
    { name: "Feb", total: 200 },
    { name: "Mar", total: 180 },
    { name: "Apr", total: 250 },
    { name: "May", total: 280 },
    { name: "Jun", total: 290 },
    { name: "Jul", total: 300 },
    { name: "Aug", total: 350 },
    { name: "Sep", total: 320 },
    { name: "Oct", total: 340 },
    { name: "Nov", total: 280 },
    { name: "Dec", total: 310 }
];

export const sampleOrders = [
    {
        "orderNumber": "ORD-0001",
        "customer": "Acme Corporation",
        "transactionDate": "2025-05-01",
        "status": "Pending",
        "totalQuantity": 100,
        "amount": 100.0,
        "supportRep": "John Doe"
    },
    {
        "orderNumber": "ORD-0002",
        "customer": "Globex LLC",
        "transactionDate": "2025-05-02",
        "status": "Approved",
        "totalQuantity": 60,
        "amount": 60.0,
        "supportRep": "Jane Smith"
    },
    {
        "orderNumber": "ORD-0003",
        "customer": "Initech",
        "transactionDate": "2025-05-03",
        "status": "Shipped",
        "totalQuantity": 200,
        "amount": 80.0,
        "supportRep": "Alice Johnson"
    },
    {
        "orderNumber": "ORD-0004",
        "customer": "Umbrella Corp",
        "transactionDate": "2025-05-04",
        "status": "Cancelled",
        "totalQuantity": 40,
        "amount": 40.0,
        "supportRep": "Bob Lee"
    },
    {
        "orderNumber": "ORD-0005",
        "customer": "Wayne Enterprises",
        "transactionDate": "2025-05-05",
        "status": "Delivered",
        "totalQuantity": 150,
        "amount": 150.0,
        "supportRep": "Carol White"
    }
];

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
    {
        id: 5,
        name: "Emma Jones",
        email: "emma.jones@email.com",
        image: ProfileImage,
        total: 2500,
    },
    {
        id: 6,
        name: "William Taylor",
        email: "william.taylor@email.com",
        image: ProfileImage,
        total: 4500,
    },
    {
        id: 7,
        name: "Isabella Johnson",
        email: "isabella.johnson@email.com",
        image: ProfileImage,
        total: 5300,
    },
];

export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        image: ProductImage,
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 2,
        name: "Smartphone",
        image: ProductImage,
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 3,
        name: "Gaming Laptop",
        image: ProductImage,
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 4,
        name: "Smartwatch",
        image: ProductImage,
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "Out of Stock",
        rating: 4.4,
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        image: ProductImage,
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "In Stock",
        rating: 4.3,
    },
    {
        number: 6,
        name: "4K Monitor",
        image: ProductImage,
        description: "Ultra HD 4K monitor with stunning color accuracy.",
        price: 399.99,
        status: "In Stock",
        rating: 4.6,
    },
    {
        number: 7,
        name: "Mechanical Keyboard",
        image: ProductImage,
        description: "Mechanical keyboard with customizable RGB lighting.",
        price: 89.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 8,
        name: "Wireless Mouse",
        image: ProductImage,
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 49.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 9,
        name: "Action Camera",
        image: ProductImage,
        description: "Waterproof action camera with 4K video recording.",
        price: 249.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 10,
        name: "External Hard Drive",
        image: ProductImage,
        description: "Portable 2TB external hard drive for data storage.",
        price: 79.99,
        status: "Out of Stock",
        rating: 4.5,
    },
];
