'use client' // Error components must be Client Components

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <img className="w-full h-[60vh]" src="/error.svg" />
      <h2 className="text-4xl font-bold text-[#4c46c3]">
        Something went wrong!
      </h2>
      <Button
        className="mt-5 text-2xl bg-[#4b43df] text-white px-8 hover:bg-[#4c46c3]"
        variant={'secondary'}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}
