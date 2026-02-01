import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './AuthModal';
import Cart from './Cart';
import './Navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
    const { user, signOut, loading } = useAuth();
    const { itemCount } = useCart();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authView, setAuthView] = useState('login');
    const [showCart, setShowCart] = useState(false);

    const handleSignOut = async () => {
        await signOut();
    };

    const openLogin = () => {
        setAuthView('login');
        setShowAuthModal(true);
    };

    return (
        <>
            <nav className="nav">
                <div className="container">
                    <div className="nav-inner">
                        <Link to="/" className="logo">
                            <img src={logo} alt="FuseFi" className="logo-img" />
                            <span className="logo-text">FuseFi</span>
                        </Link>

                        <div className="nav-links">
                            <a href="#how">How it works</a>
                            <a href="#plans">Plans</a>
                            <a href="#usecases">Use cases</a>
                            <a href="#faq">FAQ</a>
                        </div>

                        <div className="nav-cta">
                            {loading ? null : user ? (
                                <>
                                    <Link to="/profile" className="nav-user-link">
                                        My Account
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="btn btn-secondary nav-signout"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={openLogin}
                                    className="btn btn-secondary"
                                >
                                    Sign in
                                </button>
                            )}

                            <button
                                className="btn btn-icon cart-btn"
                                onClick={() => setShowCart(true)}
                            >
                                🛒
                                {itemCount > 0 && (
                                    <span className="cart-badge">{itemCount}</span>
                                )}
                            </button>

                            <a href="#quote" className="btn btn-primary">Get a quote</a>
                        </div>

                        <button className="nav-mobile-toggle" aria-label="Toggle menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialView={authView}
            />

            <Cart
                isOpen={showCart}
                onClose={() => setShowCart(false)}
            />
        </>
    );
}

export default Navbar;
