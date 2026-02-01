import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext({});

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [eventDates, setEventDates] = useState({ start: null, end: null });
    const [eventLocation, setEventLocation] = useState('');
    const [shippingOption, setShippingOption] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load cart from localStorage for guests, Supabase for logged-in users
    useEffect(() => {
        if (user) {
            loadCartFromDB();
        } else {
            loadCartFromStorage();
        }
    }, [user]);

    const loadCartFromStorage = () => {
        const saved = localStorage.getItem('fusefi_cart');
        if (saved) {
            const parsed = JSON.parse(saved);
            setItems(parsed.items || []);
            setEventDates(parsed.eventDates || { start: null, end: null });
            setEventLocation(parsed.eventLocation || '');
        }
    };

    const saveCartToStorage = (newItems, newDates, newLocation) => {
        localStorage.setItem('fusefi_cart', JSON.stringify({
            items: newItems,
            eventDates: newDates,
            eventLocation: newLocation
        }));
    };

    const loadCartFromDB = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
        *,
        product:products(*)
      `)
            .eq('user_id', user.id);

        if (!error && data.length > 0) {
            setItems(data.map(item => ({
                product: item.product,
                quantity: item.quantity
            })));
            // Use first item's dates as cart dates
            if (data[0].event_start_date) {
                setEventDates({
                    start: data[0].event_start_date,
                    end: data[0].event_end_date
                });
            }
        }
        setLoading(false);
    };

    const addItem = async (product, quantity = 1) => {
        const existingIndex = items.findIndex(i => i.product.id === product.id);
        let newItems;

        if (existingIndex >= 0) {
            newItems = items.map((item, idx) =>
                idx === existingIndex
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newItems = [...items, { product, quantity }];
        }

        setItems(newItems);

        if (user) {
            await supabase.from('cart_items').upsert({
                user_id: user.id,
                product_id: product.id,
                quantity: existingIndex >= 0 ? newItems[existingIndex].quantity : quantity,
                event_start_date: eventDates.start,
                event_end_date: eventDates.end
            }, { onConflict: 'user_id,product_id' });
        } else {
            saveCartToStorage(newItems, eventDates, eventLocation);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            return removeItem(productId);
        }

        const newItems = items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        );
        setItems(newItems);

        if (user) {
            await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('user_id', user.id)
                .eq('product_id', productId);
        } else {
            saveCartToStorage(newItems, eventDates, eventLocation);
        }
    };

    const removeItem = async (productId) => {
        const newItems = items.filter(item => item.product.id !== productId);
        setItems(newItems);

        if (user) {
            await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);
        } else {
            saveCartToStorage(newItems, eventDates, eventLocation);
        }
    };

    const clearCart = async () => {
        setItems([]);
        setEventDates({ start: null, end: null });
        setEventLocation('');
        setShippingOption(null);

        if (user) {
            await supabase.from('cart_items').delete().eq('user_id', user.id);
        } else {
            localStorage.removeItem('fusefi_cart');
        }
    };

    const updateEventDates = (start, end) => {
        setEventDates({ start, end });
        if (!user) {
            saveCartToStorage(items, { start, end }, eventLocation);
        }
    };

    const updateEventLocation = (location) => {
        setEventLocation(location);
        if (!user) {
            saveCartToStorage(items, eventDates, location);
        }
    };

    // Calculate rental days
    const rentalDays = eventDates.start && eventDates.end
        ? Math.max(1, Math.ceil((new Date(eventDates.end) - new Date(eventDates.start)) / (1000 * 60 * 60 * 24)) + 1)
        : 0;

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) =>
        sum + (item.product.daily_rate * item.quantity * rentalDays), 0
    );

    // Duration discount
    let discountPercent = 0;
    if (rentalDays > 30) discountPercent = 20;
    else if (rentalDays > 14) discountPercent = 15;
    else if (rentalDays > 7) discountPercent = 10;

    const discountAmount = subtotal * (discountPercent / 100);
    const shippingCost = shippingOption?.base_price || 0;
    const total = subtotal - discountAmount + shippingCost;

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const value = {
        items,
        itemCount,
        eventDates,
        eventLocation,
        shippingOption,
        rentalDays,
        subtotal,
        discountPercent,
        discountAmount,
        shippingCost,
        total,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        updateEventDates,
        updateEventLocation,
        setShippingOption
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
