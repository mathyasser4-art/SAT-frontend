import React, { useState } from 'react'
import mobileFooter from '../../img/footer-mobile.png'
import soundEffects from '../../utils/soundEffects'
import '../../reusable.css'
import './ContactUS.css'

function ContactUS() {
    const [message, setMessage] = useState('');

    const send = () => {
        soundEffects.playClick();
        if (message == '') {
            alert('You must write your message first');
            return;
        }
        window.location.href = `https://wa.me/201202281023?text=${message}`
    }

    return (
        <>
            <div className='contact'>
                <div className="contact-container">
                    <div className="contact-title">
                        <h3>📱 Contact Us</h3>
                        <p>We're super happy to hear from you! Ask us anything and we'll reply faster than a speeding abacus! 🚀</p>
                    </div>
                    <div className="contact-content">
                        <div className="contact-info-section">
                            <div className="contact-info-card">
                                <div className="contact-emoji">🏠</div>
                                <div className="info">
                                    <p className="info-title">Address</p>
                                    <p className='text-gray'>45 Castania Street, Al-Syouf, Alexandria, Egypt</p>
                                </div>
                            </div>
                            <div className="contact-info-card">
                                <div className="contact-emoji">📞</div>
                                <div className="info">
                                    <p className="info-title">Phone</p>
                                    <p className='text-gray'>01202281023</p>
                                </div>
                            </div>
                            <div className="contact-info-card">
                                <div className="contact-emoji">✉️</div>
                                <div className="info">
                                    <p className="info-title">Email</p>
                                    <p className='text-gray'>abacusheroes@gmail.com</p>
                                </div>
                            </div>
                            <div className="contact-info-card">
                                <div className="contact-emoji">🌐</div>
                                <div className="info">
                                    <p className="info-title">Social Media</p>
                                    <div className='social-link'>
                                        <span className="social-emoji">📘</span>
                                        <span className="social-emoji">💬</span>
                                        <span className="social-emoji">💼</span>
                                        <span className="social-emoji">🔍</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contact-form">
                            <p className="form-title">💌 Send Us a Message</p>
                            <div className="form-group">
                                <label>👤 Full Name</label>
                                <input type="text" className="form-input" placeholder="Your awesome name..." />
                            </div>
                            <div className="form-group">
                                <label>📧 Email</label>
                                <input type="email" className="form-input" placeholder="your.email@example.com" />
                            </div>
                            <div className="form-group">
                                <label>💬 Your Message</label>
                                <textarea className="form-input message-input" onChange={e => setMessage(e.target.value)} placeholder="Tell us what's on your mind..."></textarea>
                            </div>
                            <div className="contact-btn" onClick={send}>
                                🚀 Send Message
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <p>© 2024, AbacusHeroes. Terms & Privacy | Made with ❤️ for super smart kids!</p>
            </div>
            <div className="footer-mobile">
                <div>
                    <img src={mobileFooter} alt="" />
                </div>
            </div>
        </>
    )
}

export default ContactUS