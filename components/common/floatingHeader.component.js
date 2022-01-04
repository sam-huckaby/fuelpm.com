import React, { Component } from 'react';

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

        this.state = {};
    }

    componentDidMount() {
        // When the component loads on the page, this code fires
        // Track scroll position on page
        if (typeof document !== undefined) {
            // Reads out the scroll position and stores it in the data attribute
            // so we can use it in our stylesheets
            const storeScroll = () => {
                document.querySelector('.'+styles['fuel-nav-container']).dataset.scroll = window.scrollY;
            }
            // Listen for new scroll events, here we debounce our `storeScroll` function
            document.addEventListener('scroll', debounce(storeScroll), { passive: true });
        
            // Update scroll position for first time
            storeScroll();
        }
    }

    componentDidUpdate() {
        // When the state changes, this code fires
    }

    render() {
        return (
            <div className={`${styles['fuel-nav-container']} h-14`}>
                <div className={`${styles['fuel-menu-row']} md:hidden bg-orange-600 top-0 right-0 left-0 flex flex-row`}>
                <div className={`${styles['fuel-header-logo-container']} hidden flex flex-row pl-3 items-center text-4xl font-mono`}>
                    <span className="fuel-header-logo-fuel">Fuel</span>
                    <div className="fuel-header-logo-pm-container flex flex-col justify-center items-center">
                        <span className="fuel-header-logo-p text-sm leading-4">P</span>
                        <span className="fuel-header-logo-m text-sm leading-4">M</span>
                    </div>
                </div>
                    <div className="flex-auto">&nbsp;</div>
                    <button className="rounded bg-transparent text-white h-14 w-14 text-3xl flex flex-row justify-center items-center">&equiv;</button>
                </div>
            </div>
            
        );
    }
}