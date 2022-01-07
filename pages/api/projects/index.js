import { createClient } from '@supabase/supabase-js';
import { validateObject } from '../../../utils/helpers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function create(req, res) {
    if (req.method === 'POST') {
        // Do some basic validation
        if (!validateObject(req.body, [
            'name',
            'deadline',
            'nonTerminalStates',
            'terminalStates',
        ])) {
            return res.status(500).send('This is not a properly formatted project.');
        }

        const { data, error } = await supabase
            .from('project')
            .insert([
                {
                    ...req.body,
                }
            ]);
    
        console.log(data);
        console.log('------------------');
        console.log(error);
    
        res.status(200).send(data);
    } else if (req.method === 'GET') {

    }
}
  