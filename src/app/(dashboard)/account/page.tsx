'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()
  }, [])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Il tuo Account
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Gestisci le informazioni del tuo account Belka
        </p>
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
            Informazioni Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Email
              </label>
              <p className="text-neutral-800 dark:text-neutral-200 font-medium">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                ID Utente
              </label>
              <p className="text-neutral-600 dark:text-neutral-400 font-mono text-sm">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Ultimo accesso
              </label>
              <p className="text-neutral-600 dark:text-neutral-400">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('it-IT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                Account creato
              </label>
              <p className="text-neutral-600 dark:text-neutral-400">
                {new Date(user.created_at).toLocaleDateString('it-IT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 