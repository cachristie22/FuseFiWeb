import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './Checkout.css';

function Checkout({ onClose, onComplete }) {
    const { user } = useAuth();
    const {
        items,
        eventDates,
        eventLocation,
        shippingOption,
        rentalDays,
        subtotal,
        discountPercent,
        discountAmount,
        shippingCost,
        total,
        clearCart
    } = useCart();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: '',
        street: '',
        apt: '',
        city: '',
        state: '',
        zip: ''
    });

    const [billingAddress, setBillingAddress] = useState({
        fullName: '',
        street: '',
        apt: '',
        city: '',
        state: '',
        zip: ''
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [orderNotes, setOrderNotes] = useState('');

    // Redirect if cart is empty
    if (items.length === 0) {
        return (
            <div className="checkout-backdrop" onClick={onClose}>
                <div className="checkout-modal" onClick={e => e.stopPropagation()}>
                    <div className="checkout-empty">
                        <h2>Your cart is empty</h2>
                        <p>Add items to your cart before checking out.</p>
                        <button className="btn btn-primary" onClick={onClose}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleShippingChange = (field, value) => {
        setShippingAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleBillingChange = (field, value) => {
        setBillingAddress(prev => ({ ...prev, [field]: value }));
    };

    const validateShipping = () => {
        const { fullName, email, phone, street, city, state, zip } = shippingAddress;
        if (!fullName || !email || !phone || !street || !city || !state || !zip) {
            setError('Please fill in all required shipping fields.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        setError('');
        return true;
    };

    const validateBilling = () => {
        if (sameAsShipping) return true;
        const { fullName, street, city, state, zip } = billingAddress;
        if (!fullName || !street || !city || !state || !zip) {
            setError('Please fill in all required billing fields.');
            return false;
        }
        setError('');
        return true;
    };

    const handleNextStep = () => {
        if (step === 1 && validateShipping()) {
            setStep(2);
        } else if (step === 2 && validateBilling()) {
            setStep(3);
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        try {
            // Prepare order data for Edge Function
            const orderData = {
                userId: user?.id || null,
                eventLocation,
                eventDates,
                rentalDays,
                shippingAddress,
                billingAddress,
                sameAsShipping,
                shippingOptionId: shippingOption?.id,
                shippingOptionName: shippingOption?.name,
                subtotal,
                discountPercent,
                discountAmount,
                shippingCost,
                total,
                items: items.map(item => ({
                    productId: item.product.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    dailyRate: item.product.daily_rate
                }))
            };

            // Call Edge Function to create order and Stripe Checkout Session
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        orderData,
                        returnUrl: window.location.origin
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create checkout session');
            }

            // Clear cart before redirect
            await clearCart();

            // Redirect to Stripe Checkout
            window.location.href = result.url;

        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.message || 'Failed to start checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="checkout-steps">
            <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-num">1</span>
                <span className="step-label">Shipping</span>
            </div>
            <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span className="step-label">Billing</span>
            </div>
            <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
                <span className="step-num">3</span>
                <span className="step-label">Review</span>
            </div>
        </div>
    );

    return (
        <div className="checkout-backdrop" onClick={onClose}>
            <div className="checkout-modal" onClick={e => e.stopPropagation()}>
                <div className="checkout-header">
                    <h2>Checkout</h2>
                    <button className="checkout-close" onClick={onClose}>×</button>
                </div>

                {renderStepIndicator()}

                {error && <div className="checkout-error">{error}</div>}

                <div className="checkout-content">
                    {/* Step 1: Shipping Address */}
                    {step === 1 && (
                        <div className="checkout-form">
                            <h3>Shipping Address</h3>
                            <p className="form-subtitle">Where should we send your Wi-Fi kit?</p>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.fullName}
                                        onChange={e => handleShippingChange('fullName', e.target.value)}
                                        placeholder="John Smith"
                                    />
                                </div>
                            </div>

                            <div className="form-row two-col">
                                <div className="form-field">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={shippingAddress.email}
                                        onChange={e => handleShippingChange('email', e.target.value)}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Phone *</label>
                                    <input
                                        type="tel"
                                        value={shippingAddress.phone}
                                        onChange={e => handleShippingChange('phone', e.target.value)}
                                        placeholder="(555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Street Address *</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.street}
                                        onChange={e => handleShippingChange('street', e.target.value)}
                                        placeholder="123 Main Street"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-field">
                                    <label>Apt / Suite / Unit</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.apt}
                                        onChange={e => handleShippingChange('apt', e.target.value)}
                                        placeholder="Apt 4B"
                                    />
                                </div>
                            </div>

                            <div className="form-row three-col">
                                <div className="form-field">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.city}
                                        onChange={e => handleShippingChange('city', e.target.value)}
                                        placeholder="Austin"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>State *</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.state}
                                        onChange={e => handleShippingChange('state', e.target.value)}
                                        placeholder="TX"
                                        maxLength={2}
                                    />
                                </div>
                                <div className="form-field">
                                    <label>ZIP *</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.zip}
                                        onChange={e => handleShippingChange('zip', e.target.value)}
                                        placeholder="78701"
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Billing Address */}
                    {step === 2 && (
                        <div className="checkout-form">
                            <h3>Billing Address</h3>

                            <label className="checkbox-field">
                                <input
                                    type="checkbox"
                                    checked={sameAsShipping}
                                    onChange={e => setSameAsShipping(e.target.checked)}
                                />
                                <span>Same as shipping address</span>
                            </label>

                            {!sameAsShipping && (
                                <>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                value={billingAddress.fullName}
                                                onChange={e => handleBillingChange('fullName', e.target.value)}
                                                placeholder="John Smith"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Street Address *</label>
                                            <input
                                                type="text"
                                                value={billingAddress.street}
                                                onChange={e => handleBillingChange('street', e.target.value)}
                                                placeholder="123 Main Street"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Apt / Suite / Unit</label>
                                            <input
                                                type="text"
                                                value={billingAddress.apt}
                                                onChange={e => handleBillingChange('apt', e.target.value)}
                                                placeholder="Apt 4B"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row three-col">
                                        <div className="form-field">
                                            <label>City *</label>
                                            <input
                                                type="text"
                                                value={billingAddress.city}
                                                onChange={e => handleBillingChange('city', e.target.value)}
                                                placeholder="Austin"
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>State *</label>
                                            <input
                                                type="text"
                                                value={billingAddress.state}
                                                onChange={e => handleBillingChange('state', e.target.value)}
                                                placeholder="TX"
                                                maxLength={2}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>ZIP *</label>
                                            <input
                                                type="text"
                                                value={billingAddress.zip}
                                                onChange={e => handleBillingChange('zip', e.target.value)}
                                                placeholder="78701"
                                                maxLength={10}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Review Order */}
                    {step === 3 && (
                        <div className="checkout-review">
                            <h3>Review Your Order</h3>

                            <div className="review-section">
                                <h4>Event Details</h4>
                                <div className="review-detail">
                                    <span>Location:</span>
                                    <span>{eventLocation}</span>
                                </div>
                                <div className="review-detail">
                                    <span>Dates:</span>
                                    <span>
                                        {new Date(eventDates.start).toLocaleDateString()} - {new Date(eventDates.end).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="review-detail">
                                    <span>Duration:</span>
                                    <span>{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            <div className="review-section">
                                <h4>Items</h4>
                                {items.map(item => (
                                    <div key={item.product.id} className="review-item">
                                        <span>{item.product.name} × {item.quantity}</span>
                                        <span>${(item.product.daily_rate * item.quantity * rentalDays).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="review-section">
                                <h4>Shipping To</h4>
                                <p className="review-address">
                                    {shippingAddress.fullName}<br />
                                    {shippingAddress.street}{shippingAddress.apt && `, ${shippingAddress.apt}`}<br />
                                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                                </p>
                                <p className="review-shipping-method">
                                    {shippingOption?.name} - {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                                </p>
                            </div>

                            <div className="review-section">
                                <h4>Order Notes (optional)</h4>
                                <textarea
                                    value={orderNotes}
                                    onChange={e => setOrderNotes(e.target.value)}
                                    placeholder="Any special instructions for your order..."
                                    rows={3}
                                />
                            </div>

                            <div className="review-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discountPercent > 0 && (
                                    <div className="total-row discount">
                                        <span>Duration Discount ({discountPercent}%)</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="total-row">
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                {step < 3 && (
                    <div className="checkout-sidebar">
                        <h4>Order Summary</h4>
                        <div className="sidebar-items">
                            {items.map(item => (
                                <div key={item.product.id} className="sidebar-item">
                                    <span>{item.product.name} × {item.quantity}</span>
                                    <span>${(item.product.daily_rate * item.quantity * rentalDays).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="sidebar-total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <div className="checkout-actions">
                    {step > 1 && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => setStep(step - 1)}
                            disabled={loading}
                        >
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleNextStep}
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary checkout-submit"
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;
