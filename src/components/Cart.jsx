import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';
import './Cart.css';

function Cart({ isOpen, onClose }) {
    const {
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
        updateQuantity,
        removeItem,
        clearCart
    } = useCart();

    const [showCheckout, setShowCheckout] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCheckoutComplete = (order) => {
        setShowCheckout(false);
        setConfirmedOrder(order);
    };

    const handleConfirmationClose = () => {
        setConfirmedOrder(null);
        onClose();
    };

    // Show order confirmation
    if (confirmedOrder) {
        return (
            <OrderConfirmation
                order={confirmedOrder}
                onClose={handleConfirmationClose}
            />
        );
    }

    // Show checkout flow
    if (showCheckout) {
        return (
            <Checkout
                onClose={() => setShowCheckout(false)}
                onComplete={handleCheckoutComplete}
            />
        );
    }

    return (
        <div className="cart-backdrop" onClick={handleBackdropClick}>
            <div className="cart-drawer">
                <div className="cart-header">
                    <h2>Your Cart ({itemCount})</h2>
                    <button className="cart-close" onClick={onClose}>×</button>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <p>Your cart is empty</p>
                        <button className="btn btn-primary" onClick={onClose}>
                            Start Building
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-event-info">
                            <div className="event-detail">
                                <span className="label">Location</span>
                                <span className="value">{eventLocation || 'Not set'}</span>
                            </div>
                            <div className="event-detail">
                                <span className="label">Dates</span>
                                <span className="value">
                                    {eventDates.start && eventDates.end
                                        ? `${new Date(eventDates.start).toLocaleDateString()} - ${new Date(eventDates.end).toLocaleDateString()}`
                                        : 'Not set'}
                                </span>
                            </div>
                            <div className="event-detail">
                                <span className="label">Duration</span>
                                <span className="value">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        <div className="cart-items">
                            {items.map(item => (
                                <div key={item.product.id} className="cart-item">
                                    <div className="cart-item-info">
                                        <strong>{item.product.name}</strong>
                                        <span className="item-price">${item.product.daily_rate}/day</span>
                                    </div>
                                    <div className="cart-item-controls">
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                                        <button className="remove-btn" onClick={() => removeItem(item.product.id)}>✕</button>
                                    </div>
                                    <div className="cart-item-subtotal">
                                        ${(item.product.daily_rate * item.quantity * rentalDays).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discountPercent > 0 && (
                                <div className="summary-row discount">
                                    <span>Duration discount ({discountPercent}%)</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="summary-row">
                                <span>Shipping ({shippingOption?.name})</span>
                                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="cart-actions">
                            <button
                                className="btn btn-primary cart-checkout"
                                onClick={() => setShowCheckout(true)}
                            >
                                Proceed to Checkout
                            </button>
                            <button className="btn btn-link" onClick={clearCart}>
                                Clear Cart
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Cart;
