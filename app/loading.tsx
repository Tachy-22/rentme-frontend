import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen h-screen w-screen mx-auto">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
    )
}

export default loading