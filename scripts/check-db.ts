import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

async function check() {
  const { count: weeks } = await supabase.from('weeks').select('*', { count: 'exact', head: true });
  const { count: days } = await supabase.from('days').select('*', { count: 'exact', head: true });
  const { count: profiles } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: attendance } = await supabase.from('attendance').select('*', { count: 'exact', head: true });

  console.log({ weeks, days, profiles, attendance });
}

check();
