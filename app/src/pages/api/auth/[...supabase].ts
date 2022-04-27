import { handleAuth } from '@supabase/supabase-auth-helpers/nextjs'

export default handleAuth({
  cookieOptions: { name: 'sb', lifetime: 1 * 365 * 24 * 60 * 60 }, // Keep the user logged in for a year.
})
