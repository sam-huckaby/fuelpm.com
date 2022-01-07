import Link from 'next/link';

import AuthGuard from '../../../components/auth/authGuard.component';
import FloatingHeader from '../../../components/common/floatingHeader.component';

export default function AllProjects() {
    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-zinc-700 text-white flex flex-col p-2">
                <div className="flex flex-row items-center justify-between pb-2 border-b border-solid border-orange-600">
                    <span className="text-3xl text-orange-600 font-mono">Projects</span>
                    <Link href="/app/projects/create"><button className="text-xl p-2 border border-solid border-orange-600 rounded">&#43;&nbsp;Create</button></Link>
                </div>
                <div className="text-zinc-400 flex flex-row justify-center items-center p-5">You Have No Projects</div>
            </div>
        </div>
    );
}