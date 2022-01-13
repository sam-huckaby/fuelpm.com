import { useRouter } from 'next/router';
import Link from 'next/link';

import { supabase } from "../../../../../utils/supabaseClient";
import { supabaseCaptureSSRCookie } from '../../../../../utils/helpers';
import { textColorChoice } from '../../../../../utils/helpers';

import AuthGuard from '../../../../../components/auth/authGuard.component';
import FloatingHeader from '../../../../../components/common/floatingHeader.component';

export default function Project(props) {
    const router = useRouter();

    const Task = props?.tasks[0];

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-3">
                <div className="mb-1">
                    <Link href={`/app/p/${router.query.projectName}`}>
                        <span className="pb-1 cursor-pointer border-b border-solid border-stone-700 dark:border-white">&#8249; Back to Project</span>
                    </Link>
                </div>
                <div className="flex flex-row justify-between pb-2 border-b border-orange-600 border-solid">
                    <div className="text-3xl">{Task.name}</div>
                    <button className="p-2 border-solid border border-stone-400 rounded">Edit</button>
                </div>
                <div className="py-4 flex flex-row justify-between items-center">
                    <span style={{backgroundColor: Task.states.color, color: textColorChoice(Task.states.color)}} className="text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{Task.states.label}</span>
                    <div className="flex flex-col justify-start items-start">
                        <span className="text-stone-500 dark:text-stone-300 text-xs">Last Updated</span>
                        <span>{(new Date(Task.updated_at)).toLocaleString()}</span>
                    </div>
                </div>
                <div className="text-sm">{Task.description}</div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ req, params }) {
    // This code is run on the server, so it does not have access to the browser memory session
    // In order to get anything back, we need to scrape the user's JWT and apply it to this call
    supabase.auth.session = supabaseCaptureSSRCookie(req);

    let { data: tasks, error } = await supabase
        .from('tasks')
        .select('*, states(*)')
        .eq('name', params.taskName)
        .eq('projects.name', params.projectName);

    if (error) throw error;

    return {
        props: {
            tasks
        },
    }
}  