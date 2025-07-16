import { createClient } from '../supabase/server'

/**
 * Get current authenticated user from Supabase
 * @throws {Error} If user is not authenticated
 * @returns {Promise} Authenticated user object
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error('User not authenticated')
  }
  
  return user
} 