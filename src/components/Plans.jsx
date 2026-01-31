import './Plans.css';

const plans = [
    {
        name: 'Hotspot Kit',
        desc: 'POS, booths, small teams',
        price: 149,
        period: '/ event',
        features: ['Unlimited data', 'Up to ~10 devices', 'Ship & return label'],
        featured: false
    },
    {
        name: 'Router Kit',
        desc: 'Workhorse for most events',
        price: 299,
        period: '/ event',
        features: ['Unlimited data', 'Up to ~50 devices', 'Usage dashboard + alerts'],
        featured: true
    },
    {
        name: 'Bonded 5G Kit',
        desc: 'Livestream + high reliability',
        price: 599,
        period: '/ event',
        features: ['Unlimited data', 'Multi-carrier failover', 'Priority support option'],
        featured: false
    }
];

function Plans() {
    return (
        <section id="plans" className="plans-section">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Plans</div>
                    <h2 className="display section-title">Simple pricing for every event size</h2>
                    <p className="section-desc">
                        All kits include unlimited data, a return label, and quick-start guide.
                    </p>
                </div>

                <div className="plans">
                    {plans.map((plan) => (
                        <div className={`plan ${plan.featured ? 'featured' : ''}`} key={plan.name}>
                            <div className="plan-name">{plan.name}</div>
                            <div className="plan-desc">{plan.desc}</div>
                            <div className="plan-price">
                                <span className="amount">${plan.price}</span>
                                <span className="period">{plan.period}</span>
                            </div>
                            <ul className="plan-features">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                            <a href="#quote" className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}>
                                Choose {plan.name.split(' ')[0]}
                            </a>
                        </div>
                    ))}
                </div>

                <p className="plans-note">All plans include unlimited data. No caps, no overages.</p>
            </div>
        </section>
    );
}

export default Plans;
