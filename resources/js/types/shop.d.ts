export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    features: string[];
    image: string;
    rating: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
}

export type ViewState = 'landing' | 'detail' | 'checkout' | 'success';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// Category type for Indonesian furniture store
export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
}

// Testimonial type
export interface Testimonial {
    id: string;
    text: string;
    author: string;
    location: string;
    avatar?: string;
}

