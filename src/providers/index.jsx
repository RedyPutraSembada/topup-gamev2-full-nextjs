'use client'

import { Toaster } from '@/components/ui/sonner'
import { ReactQueryProvider } from './react-query-provider'

export const Providers = ({ children }) => {
  return (
    <ReactQueryProvider>
      <div className='relative flex min-h-svh flex-col bg-background'>
        {children}
      </div>
      <Toaster position='top-center' />
    </ReactQueryProvider>
  )
}
