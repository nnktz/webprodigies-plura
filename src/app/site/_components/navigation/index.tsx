import Image from 'next/image'
import Link from 'next/link'
import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import type { UserResource } from '@clerk/types'

import { ModeToggle } from '@/components/global/mode-toggle'

type Props = {
  user?: UserResource | null
}

export const Navigation = ({ user }: Props) => {
  return (
    <div className="relative flex items-center justify-between p-4">
      <aside className="flex items-center gap-2">
        <Image src={'/assets/plura-logo.svg'} alt="logo" height={40} width={40} />

        <span className="text-xl font-bold">Plura.</span>
      </aside>

      <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform md:block">
        <ul className="flex items-center justify-center gap-8">
          <Link href={'#'}>Pricing</Link>
          <Link href={'#'}>About</Link>
          <Link href={'#'}>Documentation</Link>
          <Link href={'#'}>Features</Link>
        </ul>
      </nav>

      <aside className="flex items-center gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <SignedOut>
          <Link
            href={'/agency'}
            className="rounded-md bg-primary p-2 px-4 text-white hover:bg-primary/80"
          >
            Login
          </Link>
        </SignedOut>
        <ModeToggle />
      </aside>
    </div>
  )
}
