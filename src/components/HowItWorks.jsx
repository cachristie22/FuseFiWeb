import './HowItWorks.css';

const steps = [
    {
        num: 1,
        title: 'Pick your kit & plan',
        desc: 'Choose Hotspot, Router, or Bonded 5G. All plans include unlimited data—no surprises.'
    },
    {
        num: 2,
        title: 'Checkout securely',
        desc: 'Pay by card. We automatically prepare your kit and ship it to your venue.'
    },
    {
        num: 3,
        title: 'Unbox & go live',
        desc: 'Plug in power and you\'re online in under 2 minutes. Track your connection from your dashboard.'
    }
];

function HowItWorks() {
    return (
        <section id="how">
            <div className="container">
                <div className="section-header">
                    <div className="section-label">How it works</div>
                    <h2 className="display section-title">Online checkout → shipped kit → instant connectivity</h2>
                    <p className="section-desc">
                        Designed for booths, conferences, festivals, livestreams, pop-ups, and temporary sites.
                    </p>
                </div>

                <div className="steps">
                    {steps.map((step) => (
                        <div className="step" key={step.num}>
                            <span className="step-num">{step.num}</span>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
