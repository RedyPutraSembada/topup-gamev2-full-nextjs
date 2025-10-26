import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function NotFound({ href }) {
  return (
    <div className='flex flex-col  items-center justify-center py-10 flex-1'>
      <div className='text-center'>
        <h2 className='text-2xl font-semibold'>Not Found</h2>
        <p className='text-gray-500'>Could not find requested resource</p>
        <Button asChild className='mt-4'>
          <Link href={href}>Return</Link>
        </Button>
      </div>
    </div>
  )
}
