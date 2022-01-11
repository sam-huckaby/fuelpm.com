import React, { Component } from 'react';
import Router from 'next/router';
// import useSWR from 'swr';

import { supabase } from '../../utils/supabaseClient';

export default class AuthGuard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session: null,
            user: null,
            authHandler: null,
        };
    }

    async componentDidMount() {
        // Capture all of the user's info (if they are logged in)
        await this.setState({
            user: supabase.auth.user(),
            session: supabase.auth.session()
        });

        // Keep track of the user's session, and if it ends, redirect the user dynamically
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                // Seems like the below code will preseve the route so I can redirect after login...
                Router.push('/login', Router.asPath);
            } else {
                // Send session to /api/auth route to set the auth cookie.
                // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
                fetch('/api/auth', {
                    method: 'POST',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    credentials: 'same-origin',
                    body: JSON.stringify({ event, session }),
                }).then((res) => res.json());
            }
        });
        await this.setState({
            authHandler: authListener,
        });

        if (!this.state.session) {
            // Seems like the below code will preseve the route so I can redirect after login...
            Router.push('/login', Router.asPath);
        }

        // For the peculuar case where a user tries to go to the login page when they are already logged in
        if (this.state.session && Router.pathname === '/login') {
            Router.push('/app/dashboard');
        }
    }

    componentWillUnmount() {
        this.state.authHandler.unsubscribe();
    }

    render() {
        return <></>;
    }
}