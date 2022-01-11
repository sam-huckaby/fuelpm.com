import { useRouter } from 'next/router';

import { supabase } from "../../../../../utils/supabaseClient";
import { supabaseCaptureSSRCookie } from '../../../../../utils/helpers';

import AuthGuard from '../../../../../components/auth/authGuard.component';
import FloatingHeader from '../../../../../components/common/floatingHeader.component';

export default function Project(props) {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-3">
                <div className="flex flex-row justify-between pb-2 border-b border-orange-600 border-solid">
                    <div className="text-3xl">{props.tasks[0].name}</div>
                    <button className="p-2 border-solid border border-stone-400 rounded">Edit</button>
                </div>
                {/* Swap in for a description */}
                <div className="text-sm">{props.tasks[0].description}</div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ req, params }) {
    // This code is run on the server, so it does not have access to the browser memory session
    // In order to get anything back, we need to scrape the user's JWT and apply it to this call
    supabase.auth.session = supabaseCaptureSSRCookie(req);

    // Grab all the projects
    // let { data: projects, error } = await supabase
    //     .from('projects')
    //     .select('*, tasks(*, states(*))')
    //     .eq('name', params.projectName)
    //     .eq('tasks.name', params.taskName);

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