import Head from 'next/head';

import AuthGuard from '../components/auth/AuthGuard';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
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
            </Head>
            <AuthGuard></AuthGuard>
            <LoginForm></LoginForm>
        </div>
    );
}