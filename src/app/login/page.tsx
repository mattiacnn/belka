'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SignInPage } from '@/components/ui/sign-in'
import type { Testimonial } from '@/components/ui/testimonial-card'
import { signInWithPassword, signInWithGoogle, resetPassword } from '@/lib/auth'
import { signInSchema, resetPasswordSchema, type SignInFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import type { ZodError } from 'zod'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rememberMe: formData.get('rememberMe') === 'on',
    }

    // Validate with Zod
    const validation = signInSchema.safeParse(data)
    
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
    const result = await signInWithPassword(validatedData.email, validatedData.password)
    
    if (result.success) {
      // Redirect to home page - middleware will handle auth state
      router.push('/')
    } else {
      setError(result.error?.message || 'Errore durante il login')
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

  const handleResetPassword = async () => {
    const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value
    
    // Validate email with Zod
    const validation = resetPasswordSchema.safeParse({ email })
    
    if (!validation.success) {
      const emailError = validation.error.issues.find(issue => issue.path[0] === 'email')
      if (emailError) {
        setError(emailError.message)
        return
      }
    }

    setIsLoading(true)
    setError(null)

    const result = await resetPassword(email)
    
    if (result.success) {
      setResetEmailSent(true)
    } else {
      setError(result.error?.message || 'Errore durante il reset della password')
    }
    
    setIsLoading(false)
  }

  const handleCreateAccount = () => {
    router.push('/signup')
  }

  return (
    <div className="min-h-screen">
      {resetEmailSent && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Email di reset inviata! Controlla la tua casella di posta.
          <Button 
            onClick={() => setResetEmailSent(false)}
            variant="ghost"
            size="icon"
            className="ml-2 text-white hover:text-gray-200 h-6 w-6"
          >
            ×
          </Button>
        </div>
      )}

      <SignInPage
        title={
          <span className="font-light text-foreground tracking-tighter">
            Benvenuto in <span className="font-semibold text-violet-500">Belka</span>
          </span>
        }
        description="Accedi al tuo account per gestire la tua galleria di viaggio"
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        error={error}
        isLoading={isLoading}
        testimonials={[
          {
            avatarSrc: "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Maria Rossi",
            handle: "@maria_travels",
            text: "Belka mi ha aiutato a organizzare tutti i miei ricordi di viaggio in modo perfetto!"
          },
          {
            avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            name: "Luca Bianchi",
            handle: "@luca_explorer",
            text: "Un modo fantastico per condividere e conservare le foto dei miei viaggi."
          }
        ]}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  )
} 