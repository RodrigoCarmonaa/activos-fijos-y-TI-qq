"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { X, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export function NotificationToast() {
  const { notifications, removeNotification } = useAppStore()

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id)
      }, 5000)
      return () => clearTimeout(timer)
    })
  }, [notifications, removeNotification])

  if (notifications.length === 0) return null

  const getIcon = (type: "success" | "error" | "warning") => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-rose-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
    }
  }

  const getStyles = (type: "success" | "error" | "warning") => {
    switch (type) {
      case "success":
        return "border-emerald-200 bg-emerald-50"
      case "error":
        return "border-rose-200 bg-rose-50"
      case "warning":
        return "border-amber-200 bg-amber-50"
    }
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 rounded-lg border p-4 shadow-lg ${getStyles(notification.type)}`}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm font-medium text-foreground">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="rounded-full p-1 hover:bg-black/5"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  )
}
