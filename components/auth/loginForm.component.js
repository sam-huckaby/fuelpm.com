import React, { Component } from 'react';
import Router from 'next/router';

import { supabase } from '../../utils/supabaseClient';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPass: false,
            loggingIn: false,
            complete: false,
            fuelPassword: '',
            fuelEmail: '',
            next: '',
        };
    }

    async componentDidMount() {
        this.setState({
            next: Router.asPath
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleEnter(e) {
        if (e.key === 'Enter') {
            this.login();
        }
    }

    async login() {
        await this.setState({loggingIn: true});

        let redirectUrl = process.env.NEXT_PUBLIC_VERCEL_ENV + this.state.next;

        if (this.state.next === '/login') {
            redirectUrl = process.env.NEXT_PUBLIC_VERCEL_ENV + '/app/dashboard';
        }

        const { error } = await supabase.auth.signIn({ email: this.state.fuelEmail }, { redirectTo: redirectUrl });
        if (error) throw error;

        await this.setState({complete: true});
    }

    renderLoadingVeil() {
        if (this.state.loggingIn) {
            return (
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-neutral-100 dark:bg-zinc-700 flex flex-col justify-center items-center">
                    {(!this.state.complete)? <div className="border-t-4 border-t-orange-600 border-b-4 border-b-orange-600 border-l-4 border-l-orange-600 border-r-4 border-r-white dark:border-r-zinc-700 border-solid w-6 h-6 animate-spin rounded-full">&nbsp;</div> : <div className="text-green-600 text-5xl">{'\u2713'}</div>}
                    {(!this.state.complete)? <span className="mt-5">Logging In...</span> : <div className="flex flex-col justify-center items-center"><span className="mt-5">Done! Check your e-mail to login.</span><span>(You can close this window)</span></div>}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="fuel-login-form-container flex flex-col p-4 bg-neutral-100 dark:bg-zinc-700 dark:text-white w-80 max-w-full border-solid border-zinc-400 border-b relative">
                {this.renderLoadingVeil()}
                <div className="flex flex-row justify-center items-center text-4xl font-mono mb-4">
                    <div className="font-bold">Fuel</div>
                    <div className="flex flex-col text-sm leading-4">
                        <div>P</div>
                        <div>M</div>
                    </div>
                </div>
                <span className="text-lg font-bold text-center">Login</span>
                <span className="text-sm text-zinc-400 font-bold text-center mb-4">(if you don't have an account, we will automatically create one for you)</span>
                <input className="rounded bg-transparent w-full border-solid border-zinc-400 border p-2 mb-2 invalid:border-red-600" type="email" name="fuelEmail" onChange={(event) => this.handleInputChange(event)} onKeyPress={(e) => this.handleEnter(e)} placeholder="E-Mail" />
                <button className="bg-orange-600 rounded p-2 text-white disabled:text-zinc-700 disabled:bg-zinc-700" disabled={this.state.loggingIn} onClick={() => this.login()}>Login</button>
            </div>
        );
    }
}