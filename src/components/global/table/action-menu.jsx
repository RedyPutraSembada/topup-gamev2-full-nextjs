'use client'

import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ActionMenu({
  onEdit,
  onDelete,
  onView,
  isView = true,
  isDelete = true,
  isEdit = true,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {isEdit && <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>}
        {isDelete && (
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        )}
        {isView && <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
