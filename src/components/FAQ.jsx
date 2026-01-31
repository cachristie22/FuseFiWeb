import { useState } from 'react';
import './FAQ.css';

const faqs = [
    {
        q: 'How fast is the setup?',
        a: 'Most customers are online in under 2 minutes: power on the kit, wait for connection, and share the Wi-Fi details on the included card.'
    },
    {
        q: 'Is the data really unlimited?',
        a: 'Yes! All FuseFi plans include truly unlimited data with no caps, throttling, or overage charges. Use as much as you need for your event.'
    },
    {
        q: 'What carriers do you use?',
        a: 'We choose the best available carrier coverage for your event location. Premium kits support multi-carrier failover for maximum reliability.'
    },
    {
        q: 'What if I don\'t have a great cellular signal?',
        a: 'Tell us the venue address. We\'ll recommend the right kit (including external antennas or bonded options) and help you de-risk connectivity.'
    }
];

function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section id="faq">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">FAQ</div>
                    <h2 className="display section-title">Common questions</h2>
                    <p className="section-desc">
                        Have a special request? Ask — we can tailor kits for your venue and crowd size.
                    </p>
                </div>

                <div className="faq-grid">
                    {faqs.map((faq, idx) => (
                        <div
                            className={`faq-item ${openIndex === idx ? 'open' : ''}`}
                            key={idx}
                            onClick={() => toggle(idx)}
                        >
                            <div className="faq-question">
                                {faq.q}
                                <span className="faq-icon">+</span>
                            </div>
                            <div className="faq-answer">
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;
