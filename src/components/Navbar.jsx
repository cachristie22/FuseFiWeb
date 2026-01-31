import './Navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
    return (
        <nav className="nav">
            <div className="container">
                <div className="nav-inner">
                    <a href="#" className="logo">
                        <img src={logo} alt="FuseFi" className="logo-img" />
                        <span className="logo-text">FuseFi</span>
                    </a>

                    <div className="nav-links">
                        <a href="#how">How it works</a>
                        <a href="#plans">Plans</a>
                        <a href="#usecases">Use cases</a>
                        <a href="#faq">FAQ</a>
                    </div>

                    <div className="nav-cta">
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
    );
}

export default Navbar;
