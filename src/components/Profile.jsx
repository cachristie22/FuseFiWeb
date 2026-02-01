import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './Profile.css';

function Profile() {
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [profile, setProfile] = useState({
        full_name: '',
        phone: '',
        company: '',
        title: '',
        street: '',
        apt: '',
        city: '',
        state: '',
        zip: ''
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    // Fetch profile and orders
    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchOrders();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    company: data.company || '',
                    title: data.title || '',
                    street: data.street || '',
                    apt: data.apt || '',
                    city: data.city || '',
                    state: data.state || '',
                    zip: data.zip || ''
                });
            }
        } catch (err) {
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id,
                    order_number,
                    status,
                    event_location,
                    event_start_date,
                    event_end_date,
                    total,
                    created_at,
                    order_items (
                        id,
                        quantity,
                        line_total,
                        product:products (name)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                setOrders(data || []);
            }
        } catch (err) {
            console.error('Orders fetch error:', err);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...profile,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile saved successfully!' });
        } catch (err) {
            console.error('Save error:', err);
            setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'preparing': 'status-preparing',
            'shipped': 'status-shipped',
            'active': 'status-active',
            'returning': 'status-returning',
            'returned': 'status-returned',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        };
        return statusClasses[status] || 'status-default';
    };

    if (authLoading || loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Account</h1>
                    <p className="profile-email">{user.email}</p>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        Account Settings
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Order History
                    </button>
                </div>

                {activeTab === 'account' && (
                    <div className="profile-content">
                        <form onSubmit={handleSaveProfile} className="profile-form">
                            {message.text && (
                                <div className={`form-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="form-section">
                                <h3>Personal Information</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="full_name">Full Name</label>
                                        <input
                                            type="text"
                                            id="full_name"
                                            name="full_name"
                                            value={profile.full_name}
                                            onChange={handleProfileChange}
                                            placeholder="John Smith"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleProfileChange}
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="company">Company</label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={profile.company}
                                            onChange={handleProfileChange}
                                            placeholder="Acme Inc."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="title">Job Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={profile.title}
                                            onChange={handleProfileChange}
                                            placeholder="Event Coordinator"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Default Address</h3>
                                <div className="form-group">
                                    <label htmlFor="street">Street Address</label>
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        value={profile.street}
                                        onChange={handleProfileChange}
                                        placeholder="123 Main Street"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="apt">Apt / Suite / Unit</label>
                                    <input
                                        type="text"
                                        id="apt"
                                        name="apt"
                                        value={profile.apt}
                                        onChange={handleProfileChange}
                                        placeholder="Suite 100"
                                    />
                                </div>
                                <div className="form-row form-row-3">
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleProfileChange}
                                            placeholder="Dallas"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="state">State</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={profile.state}
                                            onChange={handleProfileChange}
                                            placeholder="TX"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="zip">ZIP Code</label>
                                        <input
                                            type="text"
                                            id="zip"
                                            name="zip"
                                            value={profile.zip}
                                            onChange={handleProfileChange}
                                            placeholder="75001"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>

                        <div className="account-actions">
                            <button className="btn btn-outline" onClick={handleSignOut}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="profile-content">
                        {orders.length === 0 ? (
                            <div className="no-orders">
                                <p>You haven't placed any orders yet.</p>
                                <button className="btn btn-primary" onClick={() => navigate('/')}>
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div className="order-info">
                                                <span className="order-number">{order.order_number}</span>
                                                <span className="order-date">{formatDate(order.created_at)}</span>
                                            </div>
                                            <span className={`order-status ${getStatusBadgeClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="order-body">
                                            <div className="order-event">
                                                <strong>{order.event_location}</strong>
                                                <span>{formatDate(order.event_start_date)} - {formatDate(order.event_end_date)}</span>
                                            </div>
                                            <div className="order-items">
                                                {order.order_items?.map(item => (
                                                    <div key={item.id} className="order-item">
                                                        <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                                                        <span>${parseFloat(item.line_total).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="order-footer">
                                            <span className="order-total-label">Total</span>
                                            <span className="order-total">${parseFloat(order.total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
