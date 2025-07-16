import { createClient } from './supabase/client'

export interface AuthError {
  message: string
}

export interface AuthResponse {
  success: boolean
  error?: AuthError
}

// Sign in with email and password
export async function signInWithPassword(email: string, password: string): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle errors based on error code
      let translatedMessage = error.message
      
      switch (error.code) {
        case 'invalid_credentials':
          translatedMessage = 'Email o password non corretti'
          break
        case 'email_not_confirmed':
          translatedMessage = 'Email non confermata. Controlla la tua casella di posta.'
          break
        case 'too_many_requests':
          translatedMessage = 'Troppi tentativi. Riprova più tardi.'
          break
        case 'signup_disabled':
          translatedMessage = 'L\'accesso è momentaneamente disabilitato'
          break
        default:
          // Keep original message if no translation available
          translatedMessage = error.message
      }
      
      return { success: false, error: { message: translatedMessage } }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: { message: error instanceof Error ? error.message : 'Errore durante il login' } 
    }
  }
}

// Sign up with email and password
export async function signUpWithPassword(email: string, password: string): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      // Handle errors based on error code
      let translatedMessage = error.message
      
      switch (error.code) {
        case 'user_already_exists':
          translatedMessage = 'Questo indirizzo email è già registrato'
          break
        case 'email_exists':
          translatedMessage = 'Questo indirizzo email è già registrato'
          break
        case 'weak_password':
          translatedMessage = 'La password deve essere di almeno 6 caratteri'
          break
        case 'invalid_email':
          translatedMessage = 'Indirizzo email non valido'
          break
        case 'signup_disabled':
          translatedMessage = 'La registrazione è momentaneamente disabilitata'
          break
        case 'too_many_requests':
          translatedMessage = 'Troppi tentativi. Riprova più tardi.'
          break
        default:
          // Keep original message if no translation available
          translatedMessage = error.message
      }
      
      return { success: false, error: { message: translatedMessage } }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: { message: error instanceof Error ? error.message : 'Errore durante la registrazione' } 
    }
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      return { success: false, error: { message: error.message } }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: { message: error instanceof Error ? error.message : 'Google login failed' } 
    }
  }
}

// Sign out
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: { message: error.message } }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: { message: error instanceof Error ? error.message : 'Logout failed' } 
    }
  }
}

// Reset password
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) {
      return { success: false, error: { message: error.message } }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: { message: error instanceof Error ? error.message : 'Password reset failed' } 
    }
  }
} 