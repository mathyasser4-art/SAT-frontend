import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import './Pricing.css';
import '../../reusable.css';

function Pricing() {
  const plans = [
    {
      name: 'Monthly',
      price: '$3',
      period: '/month',
      popular: false,
      color: '#FF6B6B',
      features: [
        { text: 'Access to all practice questions', included: true },
        { text: 'Interactive abacus simulator', included: true },
        { text: 'Progress tracking & reports', included: true },
        { text: 'Participate in worldwide competitions', included: true },
        { text: 'Up to 5 homework assignments', included: true },
        { text: 'Email support', included: true },
      ],
      buttonText: 'Start Learning',
      icon: '🎓',
    },
    {
      name: 'Annual',
      price: '$20',
      period: '/year',
      popular: true,
      color: '#4ECDC4',
      features: [
        { text: 'Everything in Monthly plan', included: true },
        { text: 'Unlimited homework assignments', included: true },
        { text: 'Advanced performance analytics', included: true },
        { text: 'Priority support', included: true },
        { text: 'Downloadable certificates', included: true },
        { text: 'Save $16 per year!', included: true, highlight: true },
      ],
      buttonText: 'Best Value - Subscribe',
      icon: '🏆',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      popular: false,
      color: '#FFD93D',
      features: [
        { text: 'Everything in Annual plan', included: true },
        { text: 'Unlimited students & teachers', included: true },
        { text: 'Create custom competitions', included: true },
        { text: 'White-label branding option', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom integrations & API access', included: true },
      ],
      buttonText: 'Contact Sales',
      icon: '🏫',
      isEnterprise: true,
    },
  ];

  return (
    <>
      <div className="pricing-page">
        <Navbar />
        
        <div className="pricing-header">
          <h1 className="pricing-title">
            Choose Your Hero Path! 🚀
          </h1>
          <p className="pricing-subtitle">
            Join thousands of students mastering abacus skills worldwide
          </p>
        </div>

        <div className="pricing-cards-container">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              style={{ '--card-color': plan.color }}
            >
              {plan.popular && (
                <div className="popular-badge">
                  ⭐ MOST POPULAR ⭐
                </div>
              )}
              
              <div className="pricing-card-header">
                <div className="pricing-icon">{plan.icon}</div>
                <h2 className="pricing-plan-name">{plan.name}</h2>
                <div className="pricing-amount">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                {plan.name === 'Annual' && (
                  <div className="savings-badge">Save 44%!</div>
                )}
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li 
                    key={idx} 
                    className={`feature ${feature.highlight ? 'highlight' : ''}`}
                  >
                    <span className="checkmark">✓</span>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <div className="pricing-card-footer">
                {plan.isEnterprise ? (
                  <Link to="/contact" className="pricing-btn enterprise-btn">
                    {plan.buttonText}
                  </Link>
                ) : (
                  <Link to="/auth/register" className="pricing-btn">
                    {plan.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-faq">
          <h2>Frequently Asked Questions 🤔</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Can I switch plans?</h3>
              <p>Yes! You can upgrade or downgrade your plan at any time.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a free trial?</h3>
              <p>All new users get 7 days free access to try our platform!</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept all major credit cards, PayPal, and bank transfers.</p>
            </div>
            <div className="faq-item">
              <h3>How do competitions work?</h3>
              <p>Participate in monthly global challenges and compete with students worldwide!</p>
            </div>
          </div>
        </div>

        <div className="pricing-cta">
          <h2>Ready to become an Abacus Hero? 🦸‍♂️</h2>
          <Link to="/auth/register" className="cta-button">
            Start Your Journey Today
          </Link>
        </div>
      </div>
    </>
  );
}

export default Pricing;