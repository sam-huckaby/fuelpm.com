import { useRouter } from 'next/router';
import Link from 'next/link';

import { supabase } from "../../../../utils/supabaseClient";
import { supabaseCaptureSSRCookie } from '../../../../utils/helpers';
import { textColorChoice } from '../../../../utils/helpers';

import AuthGuard from '../../../../components/auth/authGuard.component';
import FloatingHeader from '../../../../components/common/floatingHeader.component';

export default function Project(props) {
    // TODO: Consider the implications of there being two projects with the same name
    // Should the DB prevent duplicate names within the same account? - Yes (Sam, January 8th, 2022) [Added Unique constraint on `projects`]
    // Should there be a different page for projects that don't belong to the current user?
    const router = useRouter();

    function addTask() {
        router.push({
            pathname: '/app/tasks/create',
            query: {
                project_id: props.projects[0].id,
            },
        });
    }

    function renderTasks() {
        if (props?.projects[0]?.tasks && props?.projects[0]?.tasks.length) {
            return (
                <>
                    {props?.projects[0]?.tasks.map((cur) => 
                        <Link key={cur.name} href={`/app/p/${props?.projects[0]?.name}/t/${cur.name}`}>
                            <div className="flex flex-col py-4 px-2 mb-2 border-stone-400 border-solid border
                                bg-stone-700/20 hover:bg-stone-700/10 active:bg-white
                                dark:bg-white/20 hover:dark:bg-white/10 active:dark:bg-stone-700">
                                <div className="flex flex-row justify-between items-center">
                                    <span className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap">{cur.name}</span>
                                    <span style={{backgroundColor: cur.states.color, color: textColorChoice(cur.states.color)}} className="ml-3 basis-20 w-20 text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{cur.states.label}</span>
                                </div>
                                <span className="text-stone-600 dark:text-stone-300 pt-2 border-t border-solid border-stone-600 dark:border-stone-300">{cur.description}</span>
                            </div>
                        </Link>
                    )}
                </>
            );
        } else {
            return (
                <div className="text-stone-400/60 flex flex-row justify-center items-center">No Tasks Yet</div>
            );
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-3">
                <div className="flex flex-row justify-between pb-2 border-b border-orange-600 border-solid">
                    <div className="text-3xl">{props?.projects[0]?.name}</div>
                    <button className="p-2 border-solid border border-stone-400 rounded">Edit</button>
                </div>
                {/* Swap in for a description */}
                <div className="text-sm">{props?.projects[0]?.description}</div>
                <div className="flex flex-row justify-between items-center mt-5 pb-2 mb-2 font-bold">
                    <span className="text-lg">Tasks</span>
                    <button onClick={() => addTask()} className="p-2 border-solid border border-stone-400 rounded">+ Add</button>
                </div>
                <div className="flex flex-col">
                    {renderTasks()}
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ req, params }) {
    if (params?.projectName) {
        // This code is run on the server, so it does not have access to the browser memory session
        // In order to get anything back, we need to scrape the user's JWT and apply it to this call
        supabase.auth.session = supabaseCaptureSSRCookie(req);

        // Grab all the projects
        let { data: projects, error } = await supabase
            .from('projects')
            .select('*, tasks(*, states(*))')
            .eq('name', params.projectName);

        if (error) throw error;

        return {
            props: {
                projects
            },
        }
    } else {
        return {
            props: {
                projects: []
            }
        }
    }
}  