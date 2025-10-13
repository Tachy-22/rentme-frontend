'use client'

import { useEffect } from 'react'
import { CheckCircle, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  duration?: number
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  title = "Success!", 
  message = "Operation completed successfully",
  duration = 3000 
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, duration])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-stone-950 border-stone-700" showCloseButton={false}>
        <div className="flex flex-col items-center text-center space-y-6 py-6 relative">
          {/* Confetti/Sparkles Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <Sparkles className="absolute top-4 left-6 w-4 h-4 text-orange-400 animate-pulse" />
            <Sparkles className="absolute top-8 right-8 w-3 h-3 text-pink-400 animate-pulse delay-300" />
            <Sparkles className="absolute bottom-12 left-8 w-3 h-3 text-blue-400 animate-pulse delay-500" />
            <Sparkles className="absolute bottom-8 right-6 w-4 h-4 text-purple-400 animate-pulse delay-700" />
            
          </div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-white">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base leading-relaxed">
              {message}
            </DialogDescription>
          </DialogHeader>
          
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white transition-colors px-6 py-2 rounded-lg hover:bg-gray-800 border border-gray-700"
          >
            Got it!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}