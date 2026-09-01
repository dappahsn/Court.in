import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://jssclltheotqaoghjebo.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XFl_H9Wic-QCvRUfwgVDgw_W4R1RPpV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
