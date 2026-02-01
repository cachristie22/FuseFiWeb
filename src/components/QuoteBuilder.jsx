import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import './QuoteBuilder.css';

function QuoteBuilder() {
    const [products, setProducts] = useState([]);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [step, setStep] = useState(1);

    const {
        eventDates,
        eventLocation,
        shippingOption,
        rentalDays,
        updateEventDates,
        updateEventLocation,
        setShippingOption,
        addItem
    } = useCart();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [productsRes, shippingRes] = await Promise.all([
            supabase.from('products').select('*').order('daily_rate'),
            supabase.from('shipping_options').select('*').order('sort_order')
        ]);

        if (productsRes.data) setProducts(productsRes.data);
        if (shippingRes.data) {
            setShippingOptions(shippingRes.data);
            setShippingOption(shippingRes.data[0]); // Default to standard
        }
        setLoading(false);
    };

    const handleAddToCart = () => {
        if (selectedProduct && rentalDays > 0) {
            addItem(selectedProduct, quantity);
            // Reset form
            setSelectedProduct(null);
            setQuantity(1);
            setStep(1);
        }
    };

    const calculateItemTotal = () => {
        if (!selectedProduct || rentalDays === 0) return 0;
        return selectedProduct.daily_rate * quantity * rentalDays;
    };

    if (loading) {
        return (
            <section id="quote" className="quote-builder-section">
                <div className="container">
                    <p>Loading...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="quote" className="quote-builder-section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Build your quote</div>
                    <h2 className="display section-title">Configure your rental</h2>
                    <p className="section-desc">
                        Select your kit, choose dates, and get instant pricing.
                    </p>
                </div>

                <div className="quote-builder">
                    {/* Progress Steps */}
                    <div className="quote-steps">
                        <div className={`quote-step ${step >= 1 ? 'active' : ''}`}>
                            <span className="step-num">1</span>
                            <span className="step-label">Event Details</span>
                        </div>
                        <div className={`quote-step ${step >= 2 ? 'active' : ''}`}>
                            <span className="step-num">2</span>
                            <span className="step-label">Select Kit</span>
                        </div>
                        <div className={`quote-step ${step >= 3 ? 'active' : ''}`}>
                            <span className="step-num">3</span>
                            <span className="step-label">Shipping</span>
                        </div>
                    </div>

                    {/* Step 1: Event Details */}
                    {step === 1 && (
                        <div className="quote-step-content">
                            <h3>When and where is your event?</h3>

                            <div className="quote-form-grid">
                                <div className="quote-field">
                                    <label>Event Location</label>
                                    <input
                                        type="text"
                                        placeholder="City, State"
                                        value={eventLocation}
                                        onChange={(e) => updateEventLocation(e.target.value)}
                                    />
                                </div>

                                <div className="quote-field">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        value={eventDates.start || ''}
                                        onChange={(e) => updateEventDates(e.target.value, eventDates.end)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="quote-field">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        value={eventDates.end || ''}
                                        onChange={(e) => updateEventDates(eventDates.start, e.target.value)}
                                        min={eventDates.start || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            {rentalDays > 0 && (
                                <div className="rental-days-badge">
                                    {rentalDays} day{rentalDays !== 1 ? 's' : ''} rental
                                    {rentalDays > 7 && (
                                        <span className="discount-badge">
                                            {rentalDays > 30 ? '20%' : rentalDays > 14 ? '15%' : '10%'} off!
                                        </span>
                                    )}
                                </div>
                            )}

                            <button
                                className="btn btn-primary"
                                onClick={() => setStep(2)}
                                disabled={!eventLocation || !eventDates.start || !eventDates.end}
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 2: Select Kit */}
                    {step === 2 && (
                        <div className="quote-step-content">
                            <h3>Choose your Wi-Fi kit</h3>

                            <div className="product-grid">
                                {products.map(product => (
                                    <div
                                        key={product.id}
                                        className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''} ${product.is_featured ? 'featured' : ''}`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        {product.is_featured && <div className="product-badge">Most Popular</div>}
                                        <h4>{product.name}</h4>
                                        <p className="product-desc">{product.description}</p>
                                        <div className="product-price">
                                            <span className="price">${product.daily_rate}</span>
                                            <span className="per">/day</span>
                                        </div>
                                        <div className="product-devices">Up to {product.max_devices} devices</div>
                                        <ul className="product-features">
                                            {(product.features || []).map((feat, i) => (
                                                <li key={i}>{feat}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {selectedProduct && (
                                <div className="quantity-selector">
                                    <label>How many kits?</label>
                                    <div className="quantity-controls">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                    </div>
                                </div>
                            )}

                            <div className="step-nav">
                                <button className="btn btn-secondary" onClick={() => setStep(1)}>
                                    Back
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setStep(3)}
                                    disabled={!selectedProduct}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Shipping */}
                    {step === 3 && (
                        <div className="quote-step-content">
                            <h3>How should we ship it?</h3>

                            <div className="shipping-options">
                                {shippingOptions.map(option => (
                                    <div
                                        key={option.id}
                                        className={`shipping-option ${shippingOption?.id === option.id ? 'selected' : ''}`}
                                        onClick={() => setShippingOption(option)}
                                    >
                                        <div className="shipping-info">
                                            <strong>{option.name}</strong>
                                            <span>{option.description}</span>
                                        </div>
                                        <div className="shipping-price">
                                            {option.base_price === 0 ? 'FREE' : `$${option.base_price.toFixed(2)}`}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quote Summary */}
                            <div className="quote-summary">
                                <h4>Your Quote</h4>
                                <div className="summary-line">
                                    <span>{selectedProduct?.name} × {quantity}</span>
                                    <span>${selectedProduct?.daily_rate}/day</span>
                                </div>
                                <div className="summary-line">
                                    <span>Rental duration</span>
                                    <span>{rentalDays} days</span>
                                </div>
                                <div className="summary-line subtotal">
                                    <span>Subtotal</span>
                                    <span>${calculateItemTotal().toFixed(2)}</span>
                                </div>
                                {rentalDays > 7 && (
                                    <div className="summary-line discount">
                                        <span>Duration discount ({rentalDays > 30 ? '20%' : rentalDays > 14 ? '15%' : '10%'})</span>
                                        <span>-${(calculateItemTotal() * (rentalDays > 30 ? 0.20 : rentalDays > 14 ? 0.15 : 0.10)).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="summary-line">
                                    <span>Shipping</span>
                                    <span>{shippingOption?.base_price === 0 ? 'FREE' : `$${shippingOption?.base_price.toFixed(2)}`}</span>
                                </div>
                                <div className="summary-line total">
                                    <span>Total</span>
                                    <span>
                                        ${(
                                            calculateItemTotal() * (1 - (rentalDays > 30 ? 0.20 : rentalDays > 14 ? 0.15 : rentalDays > 7 ? 0.10 : 0)) +
                                            (shippingOption?.base_price || 0)
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="step-nav">
                                <button className="btn btn-secondary" onClick={() => setStep(2)}>
                                    Back
                                </button>
                                <button className="btn btn-primary" onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default QuoteBuilder;
