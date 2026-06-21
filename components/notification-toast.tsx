"use client"

import { useEffect, useRef } from "react"
import { useAppStore } from "@/lib/store"
import { X, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export function NotificationToast() {
  const { notifications, removeNotification } = useAppStore()
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!timersRef.current[notification.id]) {
        timersRef.current[notification.id] = setTimeout(() => {
          removeNotification(notification.id)
          delete timersRef.current[notification.id]
        }, 5000)
      }
    })

    return () => {
      Object.values(timersRef.current).forEach(clearTimeout)
    }
  }, [notifications, removeNotification])

  if (notifications.length === 0) return null

  const getIcon = (type: "success" | "error" | "warning") => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-emerald-400" />
      case "error": return <XCircle className="h-5 w-5 text-red-400" />
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-400" />
    }
  }

  const getStyles = (type: "success" | "error" | "warning") => {
    switch (type) {
      case "success": return "border-emerald-500/30 bg-emerald-500/10"
      case "error": return "border-red-500/30 bg-red-500/10"
      case "warning": return "border-amber-500/30 bg-amber-500/10"
    }
  }

  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-right-5 duration-300 ${getStyles(notification.type)}`}
        >
          <div className="shrink-0 mt-0.5">{getIcon(notification.type)}</div>
          <p className="flex-1 text-sm font-medium text-white">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="shrink-0 rounded-full p-1 text-slate-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}