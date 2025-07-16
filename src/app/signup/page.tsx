'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignUpPage } from '@/components/ui/sign-up'
import { signUpWithPassword, signInWithGoogle } from '@/lib/auth'
import { signUpSchema } from '@/lib/validations/auth'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      acceptTerms: formData.get('acceptTerms') === 'on',
    }

    // Validate with Zod
    const validation = signUpSchema.safeParse(data)
    
    if (!validation.success) {
      // Get the first validation error message
      const firstError = validation.error.issues[0]
      if (firstError) {
        setError(firstError.message)
      }
      setIsLoading(false)
      return
    }

    const validatedData = validation.data
    const result = await signUpWithPassword(validatedData.email, validatedData.password)
    
    if (result.success) {
      setSuccess(true)
      // Optionally redirect to a confirmation page or login
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      setError(result.error?.message || 'Errore durante la registrazione')
    }
    
    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    const result = await signInWithGoogle()
    
    if (!result.success) {
      setError(result.error?.message || 'Errore durante il login con Google')
      setIsLoading(false)
    }
    // For Google OAuth, the redirect happens automatically
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-black dark:to-black">
        <div className="bg-background border border-border rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Account creato con successo!</h2>
          <p className="text-muted-foreground mb-6">
            Ti abbiamo inviato un&apos;email di conferma. Controlla la tua casella di posta e clicca sul link per attivare il tuo account.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Verrai reindirizzato alla pagina di login tra poco...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <SignUpPage
        title={
          <span className="font-light text-foreground tracking-tighter">
            Unisciti a <span className="font-semibold text-violet-500">Belka</span>
          </span>
        }
        description="Crea il tuo account e inizia a organizzare i tuoi ricordi di viaggio"
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        error={error}
        isLoading={isLoading}
        testimonials={[
          {
            avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            name: "Elena Verde",
            handle: "@elena_wanderer",
            text: "Finalmente posso tenere organizzate tutte le foto dei miei viaggi in un posto solo!"
          },
          {
            avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            name: "Marco Neri",
            handle: "@marco_adventures",
            text: "L'app perfetta per documenti ogni momento speciale dei miei viaggi."
          }
        ]}
        onSignUp={handleSignUp}
        onGoogleSignIn={handleGoogleSignIn}
        onSignIn={handleSignIn}
      />
    </div>
  )
} 