import Link from 'next/link';

import { supabase } from "../../../utils/supabaseClient";
import { supabaseCaptureSSRCookie } from '../../../utils/helpers';

import AuthGuard from '../../../components/auth/authGuard.component';
import FloatingHeader from '../../../components/common/floatingHeader.component';

function AllProjects(props) {
    
    function renderProjects() {
        if (props.projects.length < 1) {
            return (
                <div className="text-stone-400 flex flex-row justify-center items-center p-5">You Have No Projects</div>
            );
        } else {
            return (
                <div className="flex flex-col">
                    {
                        props.projects &&
                        props.projects.map(
                            (cur) => 
                                <Link key={cur.name} href={`/app/p/${encodeURIComponent(cur.name)}`}>
                                    <div className="flex flex-col justify-center items-center cursor-pointer
                                                    p-4 mt-2 border-stone-400 border-solid border
                                                    hover:bg-stone-700/10 active:bg-white
                                                    hover:dark:bg-white/10 active:dark:bg-stone-700">
                                        <div className="text-lg">{cur.name}</div>
                                    </div>
                                </Link>
                        )
                    }
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-2">
                <div className="flex flex-row items-center justify-between pb-2 border-b border-solid border-orange-600">
                    <span className="text-3xl text-orange-600 font-mono">Projects</span>
                    <Link href="/app/projects/create"><button className="text-xl p-2 border border-solid border-orange-600 rounded">&#43;&nbsp;Create</button></Link>
                </div>
                {renderProjects()}
            </div>
        </div>
    );
}

export async function getServerSideProps({ req }) {
    // This code is run on the server, so it does not have access to the browser memory session
    // In order to get anything back, we need to scrape the user's JWT and apply it to this call
    supabase.auth.session = supabaseCaptureSSRCookie(req);
    
    // Grab all the projects
    let { data: projects, error } = await supabase
        .from('projects')
        .select('*');
        
    if (error) throw error;

    return {
        props: {
            projects
        },
    }
}  

export default AllProjects;