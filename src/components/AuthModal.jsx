import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './Auth.css';

function AuthModal({ isOpen, onClose, initialView = 'login' }) {
    const [view, setView] = useState(initialView);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
            <div className="auth-modal">
                <button className="auth-modal-close" onClick={onClose}>×</button>

                {view === 'login' ? (
                    <Login
                        onSwitchToSignup={() => setView('signup')}
                        onClose={onClose}
                    />
                ) : (
                    <Signup
                        onSwitchToLogin={() => setView('login')}
                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    );
}

export default AuthModal;
