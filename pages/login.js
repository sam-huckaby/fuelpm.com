import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { supabase } from '../utils/supabaseClient';

import LoginForm from '../components/auth/LoginForm';

export default function Login() {
    const router = useRouter();

    useEffect(() => {
        // If the user's session changes, fetch the dashboards if they are logged in after the change
        // This fixed Google auth users from getting a persistent loading veil.
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
            if (_session) {
                router.push('/app/dashboard');
            }
        });
        
        // If the user is already logged in, just fetch and display the dashboards
        if (supabase?.auth?.currentSession) {
            router.push('/app/dashboard');
        }

        return () => {
            authListener.unsubscribe();
        }
    }, [supabase?.auth?.currentSession]);

    return (
        <div className="fuel-login-page bg-orange-600 flex flex-col md:flex-row justify-center items-center h-screen w-screen">
            <Head>
                <title>Login to the App | FuelPM</title>
                <meta name="description" content="Login and get some work done on your projects." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.fuelpm.com/login" />
                <meta property="og:title" content="Login to the App | FuelPM" />
                <meta
                    property="og:description"
                    content="Login and get some work done on your projects."
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
                <script src="https://accounts.google.com/gsi/client" async defer></script>
            </Head>
            <LoginForm></LoginForm>
        </div>
    );
}