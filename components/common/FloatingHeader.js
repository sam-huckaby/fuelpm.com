import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { isMobile } from 'react-device-detect';

import { supabase } from '../../utils/supabaseClient';

import styles from '../../styles/components/common/floatingHeader.module.scss';

export default function FloatingHeader(props) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Retrieve login status
        setLoggedIn(!!supabase.auth.session());
        // Begin listening for login status changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoggedIn(!!session);
        });

        let scrollFn;
        let sizeFn;

        if (typeof document !== undefined && typeof window !== undefined) {
            let scrollFunctionality = async () => {
                // Reads out the scroll position and stores it in the data attribute
                // so we can use it in our stylesheets
                const storeScroll = () => {
                    document.querySelector('.'+styles['fuel-nav-container']).dataset.scroll = window.scrollY;
                }
                const debounce = (await import('../../utils/helpers')).debounce;
                scrollFn = debounce(storeScroll);
                
                // Listen for new scroll events, here we debounce our `storeScroll` function
                document.addEventListener('scroll', scrollFn, { passive: true });
            
                // Update scroll position for first time
                storeScroll();
            };
            scrollFunctionality();

            // Designed with help from:
            // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
            let windowSize = async () => {
                const storeHeight = () => {
                    let vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                };
                const debounce = (await import('../../utils/helpers')).debounce;
                sizeFn = debounce(storeHeight);

                window.addEventListener('resize', sizeFn, { passive: true });
                
                storeHeight();
            }
            windowSize();
        }

        return () => {
            // When the component is removed from view, stop listening for scroll
            document.removeEventListener('scroll', scrollFn);
            window.removeEventListener('resize', sizeFn);
            if (screen && screen.orientation) {
                screen.orientation.removeEventListener('change', sizeFn);
            } else {
                window.removeEventListener('orientationchange', sizeFn);
            }
            authListener.unsubscribe();
        }
    }, []);
    
    async function buttonJump(location) {
        const smoothScroll = (await import('../../utils/helpers')).smoothScroll;

        // Only do this if in the browser
        if (typeof window !== 'undefined') {
            switch (location) {
                default:
                case 'features':
                    setMenuOpen(!menuOpen);
                    smoothScroll(document.getElementById('concept_bar'));
                    break;
                case 'pricing':
                    setMenuOpen(!menuOpen);
                    smoothScroll(document.getElementById('fuel_pricing_container'));
                    break;
                case 'faqs':
                    setMenuOpen(!menuOpen);
                    smoothScroll(document.getElementById('fuel_faqs_container'));
                    break;
            }
        }
    }

    function renderLogoutButton() {
        if (loggedIn) {
            return (
                <Link href="/logout">
                    <button
                        className={`p-5 hover:bg-white/50 active:bg-white text-white border-orange-700 border-solid border-t border-b-0 border-r-0 border-l-0 rounded-none`}>
                        Sign Out
                    </button>
                </Link>
            );
        }
    }

    return (
        <div className={`${styles['fuel-nav-container']} h-[60px] relative z-[1000]`}>
            <div className={`${styles['fuel-menu-row']} bg-orange-600 top-0 right-0 left-0 h-[60px] w-full box-border flex flex-row items-center`}> 
                <div className={((props.noTopbranding)? 'hidden' : '') + ` ${styles['fuel-header-logo-container']} text-black flex flex-row pl-3 items-center text-4xl font-mono`}>
                    <Link href="/app/dashboard">
                        <a className="flex flex-row items-center mt-1"><Image src="/Fuel-Logo-Full.svg" alt="FuelPM" width={100} height={50}/></a>
                    </Link>
                </div> 
                <div className="flex-auto">&nbsp;</div>
                <button onClick={() => setMenuOpen(!menuOpen)} className="bg-transparent active:bg-white/30 text-white h-14 w-14 text-3xl flex flex-row justify-center items-center border-none">&equiv;</button>
            </div>
            <div className={((menuOpen)? 'translate-x-0' : 'translate-x-full') + ` ${styles['fuel-index-menu']} w-screen md:max-w-sm fixed shadow-lg transform right-0 top-[60px] bg-orange-600 overflow-auto ease-in-out transition-all duration-300 z-20 border-t border-solid border-stone-700 flex flex-col`}>
                {/* BEGIN logged-out buttons */}
                <button onClick={() => buttonJump('features')} className={((loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white text-white border-orange-700 border-solid border-b border-t-0 border-r-0 border-l-0 rounded-none`}>Features</button>
                <button onClick={() => buttonJump('pricing')} className={((loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white text-white border-orange-700 border-solid border-b border-t-0 border-r-0 border-l-0 rounded-none`}>Pricing</button>
                {/* Uncomment this when there are some questions to be answered */}
                {/* <button onClick={() => buttonJump('faqs')} className={`p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-b`}>FAQs</button> */}
                <Link href="/login"><button className={((loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white text-white border-orange-700 border-solid border-b border-t-0 border-r-0 border-l-0 rounded-none`}>Get Started / Login</button></Link>
                {/* END logged-out buttons */}
                {/* BEGIN logged-in buttons */}
                <Link href="/app/dashboard"><button onClick={() => setMenuOpen(!menuOpen)} className={((!loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 text-white border-orange-700 border-solid border-b border-t-0 border-r-0 border-l-0 rounded-none`}>Dashboard</button></Link>
                <Link href="/app/projects"><button onClick={() => setMenuOpen(!menuOpen)} className={((!loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 text-white border-orange-700 border-solid border-b border-t-0 border-r-0 border-l-0 rounded-none`}>Projects</button></Link>
                <Link href="/app/settings"><button onClick={() => setMenuOpen(!menuOpen)} className={((!loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 text-white border-orange-700 border-solid border-b border-t-0 border-r-0 border-l-0 rounded-none`}>Settings</button></Link>
                {/* END logged-in buttons */}
                {/* Spacer to push the logout button to the bottom of the menu */}
                <div className="flex-auto">&nbsp;</div>
                {renderLogoutButton()}
            </div>
        </div>
    );
}