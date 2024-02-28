'use client'

import { useModal } from '@/providers/modal-provider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

type Props = {
  title: string
  subHeading: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export const CustomModal = ({ title, subHeading, children, defaultOpen }: Props) => {
  const { isOpen, setClose } = useModal()

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="h-screen overflow-y-scroll bg-card md:h-fit md:max-h-[700px]">
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subHeading}</DialogDescription>

          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
