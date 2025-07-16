import { z } from 'zod'

/**
 * Scheme for the login validation form
 */
export const signInSchema = z.object({
    email: z
        .email("Inserisci un indirizzo email valido"),
    password: z
        .string()
        .min(1, 'Password è obbligatoria')
        .min(6, 'La password deve essere di almeno 6 caratteri'),
    rememberMe: z.boolean().optional(),
})

/**
 * Scheme for the registration validation form
 */
export const signUpSchema = z.object({
    email: z
        .email("Inserisci un indirizzo email valido"),
    password: z
        .string()
        .min(1, 'Password è obbligatoria')
        .min(6, 'La password deve essere di almeno 6 caratteri')
        .max(100, 'La password non può superare i 100 caratteri'),
    confirmPassword: z
        .string()
        .min(1, 'Conferma password è obbligatoria'),
    acceptTerms: z
        .boolean()
        .refine(val => val === true, {
            message: 'Devi accettare i termini di servizio per continuare'
        }),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Le password non corrispondono',
    path: ['confirmPassword'], // This will attach the error to the confirmPassword field
})

/**
 * Scheme for the reset password validation form
 */
export const resetPasswordSchema = z.object({
    email: z
        .email("Inserisci un indirizzo email valido"),
})

/**
 * Scheme for the password validation form
 */
export const passwordSchema = z.object({
    password: z
        .string()
        .min(1, 'Password è obbligatoria')
        .min(6, 'La password deve essere di almeno 6 caratteri')
        .max(100, 'La password non può superare i 100 caratteri'),
    confirmPassword: z
        .string()
        .min(1, 'Conferma password è obbligatoria'),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Le password non corrispondono',
    path: ['confirmPassword'],
})

// Type exports for the forms
export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type PasswordFormData = z.infer<typeof passwordSchema> 