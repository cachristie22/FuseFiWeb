import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './PaymentSuccess.css';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('No order ID provided');
                setLoading(false);
                return;
            }

            try {
                const { data, error: fetchError } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            *,
                            product:products (name, daily_rate)
                        )
                    `)
                    .eq('id', orderId)
                    .single();

                if (fetchError) throw fetchError;
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Could not load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="payment-success-page">
                <div className="loading-spinner">Loading order details...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="payment-success-page">
                <div className="error-state">
                    <h1>⚠️ Something went wrong</h1>
                    <p>{error || 'Order not found'}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-success-page">
            <div className="success-container">
                <div className="success-icon">✓</div>
                <h1>Payment Successful!</h1>
                <p className="success-subtitle">
                    Thank you for your order. Your Wi-Fi kit is being prepared for shipment.
                </p>

                <div className="order-card">
                    <div className="order-header">
                        <span className="order-label">Order Number</span>
                        <span className="order-number">{order.order_number}</span>
                    </div>

                    <div className="order-details">
                        <div className="detail-section">
                            <h4>Event Details</h4>
                            <p>{order.event_location}</p>
                            <p>{formatDate(order.event_start_date)} - {formatDate(order.event_end_date)}</p>
                        </div>

                        <div className="detail-section">
                            <h4>Shipping To</h4>
                            <p>{order.shipping_name}</p>
                            <p>{order.shipping_street}</p>
                            <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                        </div>

                        <div className="detail-section">
                            <h4>Items</h4>
                            {order.order_items?.map(item => (
                                <div key={item.id} className="item-row">
                                    <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                                    <span>${item.line_total?.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            <span>Total Paid</span>
                            <span className="total-amount">${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="next-steps">
                    <h3>What's Next?</h3>
                    <ul>
                        <li>📧 Confirmation email sent to <strong>{order.shipping_email}</strong></li>
                        <li>📦 You'll receive tracking info when your kit ships</li>
                        <li>📱 Equipment arrives ready to use - just power on!</li>
                    </ul>
                </div>

                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default PaymentSuccess;
