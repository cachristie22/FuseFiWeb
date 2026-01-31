import './Footer.css';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-inner">
                    <div className="footer-copy">
                        © {year} FuseFi · Instant Event Internet
                    </div>
                    <div className="footer-links">
                        <a href="#plans">Pricing</a>
                        <a href="#faq">FAQ</a>
                        <a href="#quote">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
