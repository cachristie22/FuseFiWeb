import './ComingSoon.css';
import logo from '../assets/logo.png';

function ComingSoon() {
    return (
        <div className="coming-soon-page">
            <img src={logo} alt="FuseFi" className="coming-soon-logo" />
            <p className="coming-soon-text">Coming Soon</p>
        </div>
    );
}

export default ComingSoon;
