import { useState } from 'react';
import './QuoteForm.css';

function QuoteForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        startDate: '',
        endDate: '',
        kit: 'Router Kit (most popular)',
        devices: '10–50 devices'
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Connect to backend
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <section id="quote" className="cta-section">
            <div className="container">
                <div className="cta-grid">
                    <div className="cta-info-col">
                        <div className="section-label">Get started</div>
                        <h2 className="display section-title">Reserve your FuseFi kit</h2>
                        <p className="section-desc">
                            Tell us your dates and location. We'll confirm the best kit and ship it ready to go.
                        </p>

                        <div className="cta-details">
                            <div className="cta-detail-item">
                                <span className="cta-detail-label">Typical delivery</span>
                                <span className="cta-detail-value">2–3 business days</span>
                            </div>
                            <div className="cta-detail-item">
                                <span className="cta-detail-label">Rush option</span>
                                <span className="cta-detail-value">Overnight available</span>
                            </div>
                            <div className="cta-detail-item">
                                <span className="cta-detail-label">Support</span>
                                <span className="cta-detail-value">Remote + phone</span>
                            </div>
                            <div className="cta-detail-item">
                                <span className="cta-detail-label">Included</span>
                                <span className="cta-detail-value">Return label</span>
                            </div>
                        </div>
                    </div>

                    <div className="quote-form-card">
                        {submitted ? (
                            <div className="form-success">
                                <div className="success-icon">✓</div>
                                <h3>Request received!</h3>
                                <p>We'll get back to you within 24 hours with a custom quote.</p>
                            </div>
                        ) : (
                            <>
                                <div className="form-title">Quick quote</div>
                                <form className="form-grid" onSubmit={handleSubmit}>
                                    <input
                                        required
                                        name="name"
                                        placeholder="Name"
                                        aria-label="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        aria-label="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <input
                                        name="phone"
                                        placeholder="Phone (optional)"
                                        aria-label="Phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <input
                                        required
                                        name="location"
                                        placeholder="Event city, state"
                                        aria-label="Location"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                    <div className="form-row">
                                        <input
                                            required
                                            type="date"
                                            name="startDate"
                                            aria-label="Start date"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                        />
                                        <input
                                            required
                                            type="date"
                                            name="endDate"
                                            aria-label="End date"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <select
                                        name="kit"
                                        aria-label="Kit type"
                                        value={formData.kit}
                                        onChange={handleChange}
                                    >
                                        <option>Router Kit (most popular)</option>
                                        <option>Hotspot Kit</option>
                                        <option>Bonded 5G Kit</option>
                                    </select>
                                    <select
                                        name="devices"
                                        aria-label="Estimated devices"
                                        value={formData.devices}
                                        onChange={handleChange}
                                    >
                                        <option>Up to 10 devices</option>
                                        <option>10–50 devices</option>
                                        <option>50–150 devices</option>
                                        <option>150+ devices</option>
                                    </select>
                                    <button className="btn btn-primary" type="submit">Request quote</button>
                                </form>
                                <div className="form-note">
                                    By submitting, you agree to be contacted about your rental. No spam.
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default QuoteForm;
