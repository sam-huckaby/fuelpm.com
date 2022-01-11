import AuthGuard from '../../components/auth/authGuard.component';
import FloatingHeader from '../../components/common/floatingHeader.component';

export default function Settings() {
    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-stone-700 text-white flex flex-col p-2">
                <div className="text-3xl text-orange-600 font-mono">Settings</div>
            </div>
        </div>
    );
}