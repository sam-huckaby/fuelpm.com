import Head from 'next/head';

import AuthGuard from '../../components/auth/AuthGuard';
import FloatingHeader from '../../components/common/FloatingHeader';

export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Account Dashboard | FuelPM</title>
                <meta name="description" content="Get a high-level view of where your projects stand - all in one place." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.fuelpm.com/app/dashboard" />
                <meta property="og:title" content="Account Dashboard | FuelPM" />
                <meta
                    property="og:description"
                    content="Get a high-level view of where your projects stand - all in one place."
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-2">
                <div className="text-3xl text-orange-600 font-mono">Dashboard Coming Soon</div>
            </div>
        </div>
    );
}