import './Hero.css';

function Hero() {
    return (
        <section className="hero">
            <div className="container">
                <span className="hero-badge">Instant Event Internet</span>
                <h1 className="display hero-title">
                    Wi-Fi for events that<br />
                    <span className="hero-highlight">just works</span>
                </h1>
                <p className="hero-sub">
                    FuseFi rents plug-and-play Wi-Fi kits powered by cellular.
                    Order online, activate instantly, and track your connection in real time.
                </p>

                <div className="hero-actions">
                    <a href="#quote" className="btn btn-primary btn-lg">Start an order →</a>
                    <a href="#how" className="btn btn-secondary btn-lg">See how it works</a>
                </div>

                <div className="dashboard-preview">
                    <div className="dash-header">
                        <span className="dash-status">
                            <span className="status-dot"></span>
                            Online
                        </span>
                        <span className="dash-label">Live Demo</span>
                    </div>
                    <div className="dash-stats">
                        <div className="dash-stat">
                            <div className="dash-stat-label">Connection</div>
                            <div className="dash-stat-value">Strong</div>
                            <div className="dash-stat-sub">5G Active</div>
                        </div>
                        <div className="dash-stat">
                            <div className="dash-stat-label">Plan</div>
                            <div className="dash-stat-value">Unlimited</div>
                            <div className="dash-stat-sub">No data caps</div>
                        </div>
                    </div>
                </div>

                <div className="trust-row">
                    <div className="trust-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l7 4v6c0 5-3 9-7 10C8 21 5 17 5 12V6l7-4Z" />
                            <path d="M9.5 12l1.7 1.7L15 9.9" strokeLinecap="round" />
                        </svg>
                        Secure checkout
                    </div>
                    <div className="trust-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" strokeLinecap="round" />
                        </svg>
                        2-min setup
                    </div>
                    <div className="trust-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6.2 9.2C9.7 6.1 14.3 6.1 17.8 9.2" strokeLinecap="round" />
                            <path d="M8.7 12.1C10.8 10.4 13.2 10.4 15.3 12.1" strokeLinecap="round" />
                            <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                        </svg>
                        Unlimited data
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
