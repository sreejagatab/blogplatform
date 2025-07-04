"use client"

import { useEffect, useState } from "react"

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const installPWA = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  return (
    <>
      {children}
      {showInstallPrompt && (
        <div className="pwa-install-prompt">
          <div className="text-sm font-medium mb-2">Install App</div>
          <div className="text-xs text-muted-foreground mb-3">
            Install this app for a better experience
          </div>
          <div className="flex gap-2">
            <button
              onClick={installPWA}
              className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  )
}
