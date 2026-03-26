import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import googlePlay from '../../img/google-play.png'
import appStore from '../../img/app-store.png'
import appIcon from '../../img/icon-app.png'
import isoIcon from '../../img/ios-icon.png'
import '../../reusable.css'
import './ContactMobile.css'

function ContactMobile() {
    const [message, setMessage] = useState('');
    const role = localStorage.getItem('auth_role')
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        deferredPrompt = e;
    });

    const send = () => {
        if (message == '') {
            alert('You must write your message first');
            return;
        }
        window.location.href = `https://wa.me/201202281023?text=${message}`
    }

    const androidApp = async () => {
        if (deferredPrompt !== null) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                deferredPrompt = null;
            }
        }
    }

    const iosApp = () => {
        document.querySelector('.install-ios').classList.remove('install-down')
    }

    const closeIosApp = () => {
        document.querySelector('.install-ios').classList.add('install-down')
    }

    return (
        <>
            <Navbar />
            <MobileNav role={role} />
            <div className='contact-mobile'>
                <div className="contact-mobile-container">
                    <div className="contact-mobile-info d-flex align-items-center">
                        <div className="icon d-flex justify-content-center align-items-center">
                            <i className="fa fa-envelope-o" aria-hidden="true"></i>
                        </div>
                        <div className="info">
                            <p>Email</p>
                            <p className='text-gray'>abacusheroes@gmail.com</p>
                        </div>
                    </div>
                    <div className="contact-mobile-info d-flex align-items-center">
                        <div className="icon d-flex justify-content-center align-items-center">
                            <i className="fa fa-phone" aria-hidden="true"></i>
                        </div>
                        <div className="info">
                            <p>Phone</p>
                            <p className='text-gray'>01202281023</p>
                        </div>
                    </div>
                    <div className="contact-mobile-info d-flex align-items-center">
                        <div className="icon d-flex justify-content-center align-items-center">
                            <i className="fa fa-link" aria-hidden="true"></i>
                        </div>
                        <div className="info contact-link">
                            <p>Social Media</p>
                            <div className='social-link'>
                                <i className="fa fa-facebook text-gray" aria-hidden="true"></i>
                                <i className="fa fa-whatsapp text-gray" aria-hidden="true"></i>
                                <i className="fa fa-linkedin-square text-gray" aria-hidden="true"></i>
                                <i className="fa fa-google text-gray" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-mobile-form">
                    <p>Send Message</p>
                    <div>
                        <label>Full Name</label><br />
                        <input type="text" />
                    </div>
                    <div>
                        <label>Email</label><br />
                        <input type="email" />
                    </div>
                    <div>
                        <label>Type your message...</label><br />
                        <input className='last-mobile-input' onChange={e => setMessage(e.target.value)} type="text" />
                    </div>
                    <div className="contact-mobile-btn" onClick={send}>Send
                        <div className="contact-mobile-btn2"></div>
                    </div>
                </div>
                <div className="d-flex download-app">
                    <img onClick={androidApp} src={googlePlay} alt="" />
                    <img onClick={iosApp} src={appStore} alt="" />
                </div>
                <div className="install-ios install-down d-flex justify-content-center align-items-center">
                    <div className="install-container">
                        <div className="install-header d-flex justify-content-center align-items-center flex-direction-column">
                            <img src={appIcon} alt="" />
                            <p>Install AbacusHeroes</p>
                        </div>
                        <div className="install-body d-flex justify-content-center align-items-center">
                            <p>Install this app to your iphone for easy access and a better experience.</p>
                        </div>
                        <div className="install-footer d-flex justify-content-center align-items-center">
                            <p>Tap</p>
                            <img src={isoIcon} alt="" />
                            <p>then "Add to Home Screen"</p>
                        </div>
                        <div onClick={closeIosApp} className="close-install">
                            <p>x</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactMobile