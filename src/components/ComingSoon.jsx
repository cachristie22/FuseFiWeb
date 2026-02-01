import './ComingSoon.css';
import logo from '../assets/logo.png';

function ComingSoon() {
    return (
        <div className="coming-soon-page">
            <div className="coming-soon-content">
                <img src={logo} alt="FuseFi" className="coming-soon-logo" />
                <h1>FuseFi</h1>
                <p className="tagline">Portable WiFi Rentals for Events</p>
                <div className="coming-soon-badge">Coming Soon</div>
                <p className="description">
                    Premium WiFi solutions for weddings, conferences, and events.<br />
                    Stay connected, anywhere.
                </p>
                <div className="notify-section">
                    <p>Want early access? Email us:</p>
                    <a href="mailto:hello@fusefi.net" className="email-link">hello@fusefi.net</a>
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;
