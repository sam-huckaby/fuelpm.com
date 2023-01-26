import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image';

import * as Separator from '@radix-ui/react-separator';

import { supabase } from '../../utils/supabaseClient';

export default function LoginForm() {
    const router = useRouter();

    const [loggingIn, setLoggingIn] = useState(false);
    const [complete, setComplete] = useState(false);
    const [fuelEmail, setFuelEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [next, setNext] = useState('');

    useEffect(() => {
        setNext(router.asPath);
    });

    function handleEnter(e) {
        if (e.key === 'Enter') {
            login();
        }
    }

    function fetchRedirect() {
        let redirectUrl = process.env.NEXT_PUBLIC_VERCEL_ENV + next;

        if (next === '/login') {
            redirectUrl = process.env.NEXT_PUBLIC_VERCEL_ENV + '/app/dashboard';
        }

        return redirectUrl;
    }

    async function login() {
        if (!fuelEmail || !fuelEmail.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
            setEmailError(true);
            return;
        }

        setEmailError(false);
        setLoggingIn(true);

        const { error } = await supabase.auth.signIn({ email: fuelEmail }, { redirectTo: fetchRedirect() });
        if (error) throw error;

        setComplete(true);
    }

    async function googleLogin() {
        const { user, session, error } = await supabase.auth.signIn({
            provider: 'google'
        }, {
            redirectTo: fetchRedirect()
        });

        if (error) throw error;

        setComplete(true);
    }

    function renderLoadingVeil() {
        if (loggingIn) {
            return (
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-neutral-100 dark:bg-stone-700 flex flex-col justify-center items-center z-10">
                    {(!complete)? <div className="border-t-4 border-t-orange-600 border-b-4 border-b-orange-600 border-l-4 border-l-orange-600 border-r-4 border-r-white dark:border-r-stone-700 border-solid w-6 h-6 animate-spin rounded-full">&nbsp;</div> : <div className="text-green-600 mt-8 text-5xl">{'\u2713'}</div>}
                    {(!complete)? <span className="mt-5">Logging In...</span> : <div className="flex flex-col justify-center items-center"><span className="mt-5">Done! Check your e-mail to login.</span><span>(You can close this window)</span></div>}
                </div>
            );
        }
    }

    return (
        <div className="fuel-login-form-container flex flex-col dark:text-white w-80 max-w-full relative">
            {renderLoadingVeil()}
            <div className="flex flex-row justify-center items-center px-4 py-4 bg-orange-600 z-20">
                <Image src="/Fuel-Logo-Full.svg" alt="FuelPM" width={100} height={50}/>
            </div>
            <div className="bg-neutral-100 dark:bg-stone-700 flex flex-col pt-4">
                <span className="text-lg font-bold text-center px-4">Magic Link Login</span>
                <span className="text-sm text-stone-400 font-bold text-center px-4 mb-4">(if you don't have an account, we will automatically create one for you)</span>
                <div className="flex flex-col px-4">
                    <input className={((emailError)? 'border-red-800': 'border-stone-400') + ` rounded bg-transparent w-full border-solid  border p-2 mb-2 invalid:border-red-600`} type="email" name="fuelEmail" onChange={(event) => setFuelEmail(event.target.value)} onKeyPress={handleEnter} placeholder="E-Mail" />
                </div>
                <div className="flex flex-col px-4">
                    <button className="bg-orange-600 hover:bg-orange-700 rounded p-2 text-white disabled:text-stone-700 disabled:bg-stone-700" disabled={loggingIn} onClick={login}>Login</button>
                </div>
                <div className="flex flex-row justify-around items-center">
                    <Separator.Root className="mt-4 mb-2 h-[1px] flex-auto px-2 bg-stone-400" />
                    <span className="-mb-1 px-2">or</span>
                    <Separator.Root className="mt-4 mb-2 h-[1px] flex-auto px-2 bg-stone-400" />
                </div>
                <div className="flex flex-col justify-center items-center pb-4 mx-4 relative h-[80px]">
                    <button onClick={googleLogin} className="bg-white text-black hover:text-white dark:hover:text-black dark:bg-blue-600 py-0 px-4 border border-solid border-black h-[46px] w-full flex flex-row justify-center items-center"><span className="relative block h-[40px] w-[40px] overflow-hidden mr-2"><Image src="/btn_google_light_normal_ios.svg" height={46} width={46} /></span> Continue With Google</button>
                </div>
            </div>
        </div>
    );
}