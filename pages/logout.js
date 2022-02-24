import React, { useEffect } from "react";
import Link from 'next/link';
import Head from 'next/head';

import { supabase } from "../utils/supabaseClient";

export default function Logout() {
    useEffect(() => {
        supabase.auth.signOut().then(
            () => {},
            (error) => {
                // Fail silently, because it likely means that they weren't authenticated to begin with
                console.log(error);
            }
        );
    });

    return (
        <div className="fuel-login-page flex flex-col justify-center items-center h-screen w-screen">
            <Head>
                <title>Logged Out | FuelPM</title>
                <meta name="description" content="You have been logged out of the app." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.fuelpm.com/logout" />
                <meta property="og:title" content="Logged Out | FuelPM" />
                <meta
                    property="og:description"
                    content="You have been logged out of the app."
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <h1 className="text-3xl text-orange-600 font-mono">You are awesome.</h1>
            <h1 className="text-3xl text-orange-600 font-mono mb-20">Have fun out there!</h1>
            <span className="italic mb-4">Did you forget something?</span>
            <Link href="/login">
                <button className="rounded p-3">Log back in</button>
            </Link>
        </div>
    );
}