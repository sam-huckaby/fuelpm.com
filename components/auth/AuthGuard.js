import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '../../utils/supabaseClient';

export default function AuthGuard() {
    const router = useRouter();

    useEffect(() => {
        let userSession = supabase.auth.session();

        // Keep track of the user's session, and if it ends, redirect the user dynamically
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
            if (!_session) {
                // Seems like the below code will preseve the route so I can redirect after login...
                router.push('/login', router.asPath);
            }
        });
        
        if (!userSession) {
            // Seems like the below code will preseve the route so I can redirect after login...
            router.push('/login', router.asPath);
        }

        // For the peculuar case where a user tries to go to the login page when they are already logged in
        if (userSession && router.pathname === '/login') {
            router.push('/app/dashboard');
        }

        return () => {
            authListener.unsubscribe();
        }
    }, []);

    return <></>;
}