import './OrderConfirmation.css';

function OrderConfirmation({ order, onClose }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="confirmation-backdrop" onClick={onClose}>
            <div className="confirmation-modal" onClick={e => e.stopPropagation()}>
                <div className="confirmation-icon">✓</div>

                <h1>Order Confirmed!</h1>
                <p className="confirmation-subtitle">
                    Thank you for your order. We'll send a confirmation email shortly.
                </p>

                <div className="confirmation-order-id">
                    <span>Order ID</span>
                    <strong>{order.id.slice(0, 8).toUpperCase()}</strong>
                </div>

                <div className="confirmation-details">
                    <div className="confirmation-section">
                        <h3>Event Details</h3>
                        <p>{order.event_location}</p>
                        <p>
                            {formatDate(order.event_start_date)} — {formatDate(order.event_end_date)}
                        </p>
                    </div>

                    <div className="confirmation-section">
                        <h3>Shipping To</h3>
                        <p>{order.shipping_name}</p>
                        <p>{order.shipping_street}{order.shipping_apt && `, ${order.shipping_apt}`}</p>
                        <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                    </div>

                    <div className="confirmation-section">
                        <h3>Order Total</h3>
                        <p className="confirmation-total">${order.total.toFixed(2)}</p>
                    </div>
                </div>

                <div className="confirmation-next">
                    <h3>What's Next?</h3>
                    <ol>
                        <li>You'll receive a confirmation email with your order details</li>
                        <li>We'll prepare your Wi-Fi kit and ship it to arrive before your event</li>
                        <li>A prepaid return label will be included for easy returns</li>
                    </ol>
                </div>

                <button className="btn btn-primary confirmation-btn" onClick={onClose}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default OrderConfirmation;
