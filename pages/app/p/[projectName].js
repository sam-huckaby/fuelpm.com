import { supabase } from "../../../utils/supabaseClient";
import { supabaseCaptureSSRCookie } from '../../../utils/helpers';

import AuthGuard from '../../../components/auth/authGuard.component';
import FloatingHeader from '../../../components/common/floatingHeader.component';

export default function Project(props) {
    // TODO: Consider the implications of there being two projects with the same name
    // Should the DB prevent duplicate names within the same account? - Yes (Sam, January 8th, 2022) [Added Unique constraint on `projects`]
    // Should there be a different page for projects that don't belong to the current user?

    function renderTasks() {
        // Wire in tasks when they... uh... exist
        return (
            <div className="text-zinc-400/60 flex flex-row justify-center items-center">No Tasks Yet</div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-3">
                <div className="flex flex-row justify-between pb-2 border-b border-orange-600 border-solid">
                    <div className="text-3xl">{props.projects[0].name}</div>
                    <button className="p-2 border-solid border border-zinc-400 rounded">Edit</button>
                </div>
                {/* Swap in for a description */}
                <div className="text-sm">{props.projects[0].description}</div>
                <div className="flex flex-row justify-between mt-5">
                    <span className="text-lg">Tasks</span>
                    <button className="p-2 border-solid border border-zinc-400 rounded">+ Add</button>
                </div>
                <div className="flex flex-col">
                    {renderTasks()}
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ req, params }) {
    // This code is run on the server, so it does not have access to the browser memory session
    // In order to get anything back, we need to scrape the user's JWT and apply it to this call
    supabase.auth.session = supabaseCaptureSSRCookie(req);

    // Grab all the projects
    let { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('name', params.projectName);

    if (error) throw error;

    return {
        props: {
            projects
        },
    }
}  