"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  type: ToastType
  title?: string
  description: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    iconClassName: "text-green-600 dark:text-green-400",
    titleClassName: "text-green-800 dark:text-green-200",
    descriptionClassName: "text-green-700 dark:text-green-300"
  },
  error: {
    icon: AlertCircle,
    className: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
    iconClassName: "text-red-600 dark:text-red-400",
    titleClassName: "text-red-800 dark:text-red-200",
    descriptionClassName: "text-red-700 dark:text-red-300"
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
    iconClassName: "text-yellow-600 dark:text-yellow-400",
    titleClassName: "text-yellow-800 dark:text-yellow-200",
    descriptionClassName: "text-yellow-700 dark:text-yellow-300"
  },
  info: {
    icon: Info,
    className: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    iconClassName: "text-blue-600 dark:text-blue-400",
    titleClassName: "text-blue-800 dark:text-blue-200",
    descriptionClassName: "text-blue-700 dark:text-blue-300"
  }
}

function ToastComponent({ toast, onDismiss }: ToastProps) {
  const config = toastConfig[toast.type]
  const Icon = config.icon

  React.useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onDismiss(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id, onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative max-w-sm w-full border rounded-lg p-4 shadow-lg
        ${config.className}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconClassName}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={`text-sm font-medium ${config.titleClassName}`}>
              {toast.title}
            </p>
          )}
          <p className={`text-sm ${toast.title ? 'mt-1' : ''} ${config.descriptionClassName}`}>
            {toast.description}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDismiss(toast.id)}
            className={`h-6 w-6 ${config.iconClassName} hover:bg-black/5 dark:hover:bg-white/5`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

interface ToasterProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }, [])

  const dismissToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = React.useCallback((description: string, title?: string) => {
    return addToast({ type: "success", title, description })
  }, [addToast])

  const error = React.useCallback((description: string, title?: string) => {
    return addToast({ type: "error", title, description })
  }, [addToast])

  const warning = React.useCallback((description: string, title?: string) => {
    return addToast({ type: "warning", title, description })
  }, [addToast])

  const info = React.useCallback((description: string, title?: string) => {
    return addToast({ type: "info", title, description })
  }, [addToast])

  return {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    warning,
    info
  }
} 