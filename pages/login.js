import AuthGuard from '../components/auth/authGuard.component';
import LoginForm from '../components/auth/loginForm.component';

export default function Login() {
    return (
        <div className="fuel-login-page bg-orange-600 flex flex-col md:flex-row justify-center items-center h-screen w-screen">
            <AuthGuard></AuthGuard>
            <LoginForm></LoginForm>
        </div>
    );
}