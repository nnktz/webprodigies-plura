'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react'
import { ChevronsUpDown, Menu, PlusCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { icons } from '@/lib/constants'

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { AspectRatio } from '../ui/aspect-ratio'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Compass } from '../icons/compass'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { useModal } from '@/providers/modal-provider'
import { CustomModal } from '../global/custom-modal'
import { SubAccountDetail } from '../forms/subaccount-detail'
import { Separator } from '../ui/separator'

type Props = {
  defaultOpen?: boolean
  subAccounts?: SubAccount[]
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
  sidebarLogo: string
  details: any
  user: any
  id: string
}

export const MenuOptions = ({
  details,
  defaultOpen,
  sidebarLogo,
  sidebarOpt,
  subAccounts,
  user,
  id,
}: Props) => {
  const { setOpen } = useModal()
  const [isMounted, setIsMounted] = useState(false)

  const openState = useMemo(() => (defaultOpen ? { open: true } : {}), [defaultOpen])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return
  }

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger asChild className="absolute left-4 top-4 z-[100] md:!hidden">
        <Button variant={'outline'} size={'icon'}>
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side={'left'}
        className={cn(
          'fixed top-0 border-r bg-background/80 p-6 backdrop-blur-xl',
          defaultOpen
            ? 'z-0 hidden w-[300px] md:inline-block'
            : 'z-[100] inline-block w-full md:hidden',
        )}
      >
        <div>
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sidebarLogo}
              alt="sidebar logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="my-4 flex w-full items-center justify-between py-8"
                variant={'ghost'}
              >
                <div className="flex items-center gap-2 text-left">
                  <Compass />

                  <div className="flex flex-col">
                    {details.name}
                    <span className="text-muted-foreground">{details.address}</span>
                  </div>
                </div>

                <div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="z-[200] m-4 h-80 w-80">
              <Command className="rounded-lg">
                <CommandInput placeholder="Search accounts..." />

                <CommandList className="pb-16">
                  <CommandEmpty>No results found</CommandEmpty>
                  {(user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') &&
                    user?.agency && (
                      <CommandGroup heading="Agency">
                        <CommandItem
                          key={user?.agency?.id}
                          className="my-2 cursor-pointer rounded-md border border-border !bg-transparent p-2 text-primary transition-all hover:!bg-muted"
                        >
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user?.agency?.id}`}
                              className="flex h-full w-full gap-4"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={user?.agency?.agencyLogo}
                                  alt="agency logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>

                              <div className="flex flex-1 flex-col">
                                {user?.agency?.name}
                                <span className="text-muted-foreground">
                                  {user?.agency?.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user?.agency?.id}`}
                                className="flex h-full w-full gap-4"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={user?.agency?.agencyLogo}
                                    alt="agency logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>

                                <div className="flex flex-1 flex-col">
                                  {user?.agency?.name}
                                  <span className="text-muted-foreground">
                                    {user?.agency?.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}

                  <CommandGroup heading="Accounts">
                    {!!subAccounts
                      ? subAccounts.map((subAccount) => (
                          <CommandItem key={subAccount.id}>
                            {defaultOpen ? (
                              <Link
                                href={`/subacount/${subAccount.id}`}
                                className="flex h-full w-full gap-4"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={subAccount.subAccountLogo}
                                    alt="sub account logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>

                                <div className="flex flex-1 flex-col">
                                  {subAccount.name}
                                  <span className="text-muted-foreground">
                                    {subAccount.address}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link
                                  href={`/agency/${subAccount.id}`}
                                  className="flex h-full w-full gap-4"
                                >
                                  <div className="relative w-16">
                                    <Image
                                      src={subAccount.subAccountLogo}
                                      alt="sub account logo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                  </div>

                                  <div className="flex flex-1 flex-col">
                                    {subAccount.name}
                                    <span className="text-muted-foreground">
                                      {subAccount.address}
                                    </span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      : 'No accounts'}
                  </CommandGroup>
                </CommandList>

                {(user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') && (
                  <SheetClose>
                    <Button
                      className="flex w-full gap-2"
                      onClick={() => {
                        setOpen(
                          <CustomModal
                            title="Create A Sub Account"
                            subHeading="You can switch between your agency account and the sub account from the sidebar"
                          >
                            <SubAccountDetail
                              agencyDetails={user?.agency as Agency}
                              userId={user?.id as string}
                              userName={user?.name}
                            />
                          </CustomModal>,
                        )
                      }}
                    >
                      <PlusCircle size={15} />
                      Create Sub Account
                    </Button>
                  </SheetClose>
                )}
              </Command>
            </PopoverContent>
          </Popover>

          <p className="mb-2 text-xs uppercase text-muted-foreground">Menu Links</p>
          <Separator className="mb-4" />

          <nav className="relative">
            <Command className="overflow-visible rounded-lg bg-transparent">
              <CommandInput placeholder="Search..." />

              <CommandList className="overflow-visible py-4">
                <CommandEmpty>No Result Found</CommandEmpty>
                <CommandGroup className="overflow-visible">
                  {sidebarOpt.map((option) => {
                    let val

                    const result = icons.find((icon) => icon.value === option.icon)

                    if (result) {
                      val = <result.path />
                    }

                    return (
                      <CommandItem key={option.id} className="w-full">
                        <Link
                          href={option.link}
                          className="flex w-[320px] items-center gap-2 rounded-md transition-all hover:bg-transparent md:w-full"
                        >
                          {val}
                          <span>{option.name}</span>
                        </Link>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
