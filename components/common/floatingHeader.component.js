import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import { supabase } from '../../utils/supabaseClient';
import { smoothScroll } from '../../utils/helpers';

import styles from '../../styles/components/common/floatingHeader.module.scss';

// Scroll code taken from https://css-tricks.com/styling-based-on-scroll-position/
// The debounce function receives our function as a parameter
const debounce = (fn) => {
    // This holds the requestAnimationFrame reference, so we can cancel it if we wish
    let frame;
    // The debounce function returns a new function that can receive a variable number of arguments
    return (...params) => {
        // If the frame variable has been defined, clear it now, and queue for next frame
        if (frame) { 
            cancelAnimationFrame(frame);
        }
        // Queue our function call for the next frame
        frame = requestAnimationFrame(() => {
            // Call our function and pass any params we received
            fn(...params);
        });
    } 
};

export default class FloatingHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            menuOpen: false,
            authHandler: null,
        };

        this.scrollFn = null;
    }

    async componentDidMount() {
        this.setState({
            loggedIn: !!supabase.auth.session(),
        });

        // Keep the menu up-to-date with the user's logged-in status
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            this.setState({
                loggedIn: !!session,
            });
        });
        await this.setState({
            authHandler: authListener,
        });

        // When the component loads on the page, this code fires
        // Track scroll position on page
        if (typeof document !== undefined) {
            // Reads out the scroll position and stores it in the data attribute
            // so we can use it in our stylesheets
            const storeScroll = () => {
                document.querySelector('.'+styles['fuel-nav-container']).dataset.scroll = window.scrollY;
            }
            this.scrollFn = debounce(storeScroll);
            // Listen for new scroll events, here we debounce our `storeScroll` function
            document.addEventListener('scroll', this.scrollFn, { passive: true });
        
            // Update scroll position for first time
            storeScroll();
        }
    }

    componentWillUnmount() {
        // When the component is removed from view, stop listening for scroll
        document.removeEventListener('scroll', this.scrollFn);
        this.state.authHandler.unsubscribe();
    }

    componentDidUpdate() {
        // When the state changes, this code fires
    }
    
    toggleMenu() {
        this.setState({
            menuOpen: !this.state.menuOpen
        });
    }
    
    buttonJump(location) {
        // Only do this if in the browser
        if (typeof window !== 'undefined') {
            switch (location) {
                default:
                case 'features':
                    this.toggleMenu();
                    smoothScroll(document.getElementById('concept_bar'));
                    break;
                case 'pricing':
                    this.toggleMenu();
                    smoothScroll(document.getElementById('fuel_pricing_container'));
                    break;
                case 'faqs':
                    this.toggleMenu();
                    smoothScroll(document.getElementById('fuel_faqs_container'));
                    break;
            }
        }
    }

    async logout() {
        let { error } = await supabase.auth.signOut();

        if (typeof window !== 'undefined') {
            if (error) {
                window.alert('Logout failed. You may want to clear your cache.');
            } else {
                // Route the user back to login, so they know things worked
                Router.push('/login');
            }
        }
    }

    renderLogoutButton() {
        if (this.state.loggedIn) {
            return (
                <button
                    onClick={() => this.logout()}
                    className={`p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-t`}>
                    Sign Out
                </button>
            );
        }
    }

    render() {
        return (
            <div className={`${styles['fuel-nav-container']}`}>
                <div className={`${styles['fuel-menu-row']} bg-orange-600 top-0 right-0 left-0 flex flex-row items-center`}> 
                    <div className={((this.props.noTopbranding)? 'hidden' : '') + ` ${styles['fuel-header-logo-container']} text-black flex flex-row pl-3 items-center text-4xl font-mono`}>
                        <span className="fuel-header-logo-fuel">Fuel</span>
                        <div className="fuel-header-logo-pm-container flex flex-col justify-center items-center">
                            <span className="fuel-header-logo-p text-sm leading-4">P</span>
                            <span className="fuel-header-logo-m text-sm leading-4">M</span>
                        </div>
                    </div> 
                    <div className="flex-auto">&nbsp;</div>
                    <button onClick={() => this.toggleMenu()} className="bg-transparent active:bg-white/30 text-white h-14 w-14 text-3xl flex flex-row justify-center items-center">&equiv;</button>
                </div>
                <div className={((this.state.menuOpen)? 'translate-x-0' : 'translate-x-full') + ` ${styles['fuel-index-menu']} w-screen md:max-w-sm fixed shadow-lg transform right-0 bg-orange-600 fixed overflow-auto ease-in-out transition-all duration-300 z-20 border-t border-solid border-zinc-700 flex flex-col`}>
                    {/* BEGIN logged-out buttons */}
                    <button onClick={() => this.buttonJump('features')} className={((this.state.loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-b`}>Features</button>
                    <button onClick={() => this.buttonJump('pricing')} className={((this.state.loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-b`}>Pricing</button>
                    {/* Uncomment this when there are some questions to be answered */}
                    {/* <button onClick={() => buttonJump('faqs')} className={`p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-b`}>FAQs</button> */}
                    <Link href="/login"><button className={((this.state.loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-b`}>Get Started / Login</button></Link>
                    {/* END logged-out buttons */}
                    {/* BEGIN logged-in buttons */}
                    <Link href="/app/dashboard"><button className={((!this.state.loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-b`}>Dashboard</button></Link>
                    <Link href="/app/projects"><button className={((!this.state.loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-b`}>Projects</button></Link>
                    <Link href="/app/settings"><button className={((!this.state.loggedIn)? 'hidden' : '') + ` p-5 hover:bg-white/50 active:bg-white border-orange-700 border-solid border-b`}>Settings</button></Link>
                    {/* END logged-in buttons */}
                    {/* Spacer to push the logout button to the bottom of the menu */}
                    <div className="flex-auto">&nbsp;</div>
                    {this.renderLogoutButton()}
                </div>
            </div>
            
        );
    }
}