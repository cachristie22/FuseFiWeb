import { loadStripe } from '@stripe/stripe-js';

// Lazy load Stripe.js
let stripePromise;

export const getStripe = () => {
    if (!stripePromise) {
        const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!key) {
            console.warn('Stripe publishable key not found - payments disabled');
            return null;
        }
        stripePromise = loadStripe(key);
    }
    return stripePromise;
};

export default getStripe;
