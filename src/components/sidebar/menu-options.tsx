'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react'
import { ChevronsUpDown, Menu, PlusCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

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
      <SheetTrigger asChild className="absolute left-4 top-4 z-[100] flex md:!hidden">
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

            <PopoverContent className="z-[200] mt-4 h-80 w-80">
              <Command className="rounded-lg">
                <CommandInput placeholder="Search accounts..." />

                <CommandList className="pb-16">
                  <CommandEmpty>No results found</CommandEmpty>
                  {user?.role === 'AGENCY_OWNER' ||
                    (user?.role === 'AGENCY_ADMIN' && user?.agency && (
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
                    ))}

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

                {user?.role === 'AGENCY_OWNER' ||
                  (user?.role === 'AGENCY_ADMIN' && (
                    <Button className="flex w-full gap-2">
                      <PlusCircle size={15} />
                      Create Sub Account
                    </Button>
                  ))}
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </SheetContent>
    </Sheet>
  )
}
