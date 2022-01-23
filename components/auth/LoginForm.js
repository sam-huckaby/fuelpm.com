import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';

import { supabase } from '../../utils/supabaseClient';

export default function LoginForm() {
    const router = useRouter();

    const [loggingIn, setLoggingIn] = useState(false);
    const [complete, setComplete] = useState(false);
    const [fuelEmail, setFuelEmail] = useState('');
    const [next, setNext] = useState('');

    useEffect(() => {
        setNext(router.asPath);
    });

    function handleEnter(e) {
        if (e.key === 'Enter') {
            login();
        }
    }

    async function login() {
        setLoggingIn(true);

        let redirectUrl = process.env.NEXT_PUBLIC_VERCEL_ENV + next;

        if (next === '/login') {
            redirectUrl = process.env.NEXT_PUBLIC_VERCEL_ENV + '/app/dashboard';
        }

        const { error } = await supabase.auth.signIn({ email: fuelEmail }, { redirectTo: redirectUrl });
        if (error) throw error;

        setComplete(true);
    }

    function renderLoadingVeil() {
        if (loggingIn) {
            return (
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-neutral-100 dark:bg-stone-700 flex flex-col justify-center items-center">
                    {(!complete)? <div className="border-t-4 border-t-orange-600 border-b-4 border-b-orange-600 border-l-4 border-l-orange-600 border-r-4 border-r-white dark:border-r-stone-700 border-solid w-6 h-6 animate-spin rounded-full">&nbsp;</div> : <div className="text-green-600 text-5xl">{'\u2713'}</div>}
                    {(!complete)? <span className="mt-5">Logging In...</span> : <div className="flex flex-col justify-center items-center"><span className="mt-5">Done! Check your e-mail to login.</span><span>(You can close this window)</span></div>}
                </div>
            );
        }
    }

    return (
        <div className="fuel-login-form-container flex flex-col bg-neutral-100 dark:bg-stone-700 dark:text-white w-80 max-w-full border-solid border-stone-400 border-b relative">
            {renderLoadingVeil()}
            <div className="flex flex-row justify-center items-center px-4 py-4 mb-4 bg-orange-600">
                <Image src="/Fuel-Logo-Full.svg" alt="FuelPM" width={100} height={50}/>
            </div>
            <span className="text-lg font-bold text-center px-4">Login</span>
            <span className="text-sm text-stone-400 font-bold text-center px-4 mb-4">(if you don't have an account, we will automatically create one for you)</span>
            <div className="flex flex-col px-4">
                <input className="rounded bg-transparent w-full border-solid border-stone-400 border p-2 mb-2 invalid:border-red-600" type="email" name="fuelEmail" onChange={(event) => setFuelEmail(event.target.value)} onKeyPress={handleEnter} placeholder="E-Mail" />
            </div>
            <div className="flex flex-col pb-4 px-4">
                <button className="bg-orange-600 hover:bg-orange-700 rounded p-2 text-white disabled:text-stone-700 disabled:bg-stone-700" disabled={loggingIn} onClick={login}>Login</button>
            </div>
        </div>
    );
}