import Head from 'next/head';

import AuthGuard from '../../components/auth/AuthGuard';
import FloatingHeader from '../../components/common/FloatingHeader';

export default function Settings() {
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Account Settings | FuelPM</title>
                <meta name="description" content="Update settings that relate to your account and user experience." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.fuelpm.com/app/settings" />
                <meta property="og:title" content="Account Settings | FuelPM" />
                <meta
                    property="og:description"
                    content="Update settings that relate to your account and user experience."
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-stone-700 text-white flex flex-col p-2">
                <div className="text-3xl text-orange-600 font-mono">Settings Coming Soon</div>
            </div>
        </div>
    );
}