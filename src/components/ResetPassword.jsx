import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './ResetPassword.css';

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Check if we have a valid session from the email link
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // No session means the link is invalid or expired
                setError('Invalid or expired reset link. Please request a new one.');
            }
        };
        checkSession();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <h1>Reset Password</h1>

                    {success ? (
                        <div className="success-message">
                            <span className="success-icon">✓</span>
                            <h2>Password Updated!</h2>
                            <p>Your password has been reset successfully.</p>
                            <p className="redirect-notice">Redirecting to home page...</p>
                        </div>
                    ) : (
                        <>
                            <p className="reset-subtitle">Enter your new password below.</p>

                            {error && (
                                <div className="error-message">{error}</div>
                            )}

                            <form onSubmit={handleSubmit} className="reset-form">
                                <div className="form-group">
                                    <label htmlFor="password">New Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary reset-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
