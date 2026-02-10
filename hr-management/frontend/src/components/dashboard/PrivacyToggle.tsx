"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export function PrivacyToggle() {
    const [isPrivacy, setIsPrivacy] = useState(false)

    useEffect(() => {
        if (isPrivacy) {
            document.body.classList.add('privacy-blur')
        } else {
            document.body.classList.remove('privacy-blur')
        }
    }, [isPrivacy])

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPrivacy(!isPrivacy)}
            className={`gap-2 font-medium transition-colors ${isPrivacy ? 'text-indigo-300 bg-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
        >
            {isPrivacy ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPrivacy ? "Hidden" : "Visible"}
        </Button>
    )
}
