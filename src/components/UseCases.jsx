import './UseCases.css';

const useCases = [
    { title: 'Trade show booths', desc: 'POS, demos, lead capture' },
    { title: 'Corporate events', desc: 'Guest Wi-Fi, check-in, AV' },
    { title: 'Festivals & races', desc: 'Ticketing, vendors, ops' },
    { title: 'Livestream production', desc: 'Stable uplink, redundancy' },
    { title: 'Pop-up retail', desc: 'Quick setup anywhere' },
    { title: 'Construction trailers', desc: 'Short or monthly rentals' },
    { title: 'Field offices', desc: 'Temporary teams, projects' },
    { title: 'Emergency response', desc: 'Rapid deployments' }
];

function UseCases() {
    return (
        <section id="usecases">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">Use cases</div>
                    <h2 className="display section-title">Built for real-world, real-time needs</h2>
                    <p className="section-desc">
                        FuseFi is ideal when venue Wi-Fi is unreliable, overpriced, or unavailable.
                    </p>
                </div>

                <div className="usecases-grid">
                    {useCases.map((useCase, idx) => (
                        <div className="usecase" key={idx}>
                            <strong>{useCase.title}</strong>
                            <span>{useCase.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default UseCases;
