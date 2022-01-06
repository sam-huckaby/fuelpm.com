import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_API_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function login(req, res) {
    // let { user, error } = await supabase.auth.signIn({
    //     email: 'req.body.fuelEmail',
    //     password: 'req.body.fuelPassword'
    // });

    let { user, error } = await supabase.auth.signUp({
        email: req.body.fuelEmail,
        password: req.body.fuelPassword
    });

    console.log(user);
    console.log('------------------');
    console.log(error);

    res.status(200).send(true);
}
  