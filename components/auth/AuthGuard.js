import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '../../utils/supabaseClient';

export default function AuthGuard() {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        let userSession = supabase.auth.session();

        // Keep track of the user's session, and if it ends, redirect the user dynamically
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
            if (!_session && router.pathname !== '/login') {
                // Seems like the below code will preseve the route so I can redirect after login...
                router.replace('/login', router.asPath);
            }
        });
        
        if (!userSession && router.pathname !== '/login') {
            // Seems like the below code will preseve the route so I can redirect after login...
            router.replace('/login', router.asPath);
        }

        // For the peculuar case where a user tries to go to the login page when they are already logged in
        if (userSession && router.pathname === '/login') {
            router.push('/app/dashboard');
        }

        return () => {
            authListener.unsubscribe();
        }
    }, [router.isReady]);

    return <></>;
}