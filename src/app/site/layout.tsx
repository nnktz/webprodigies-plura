'use client'

import { useUser } from '@clerk/nextjs'

import { Navigation } from './_components/navigation'

const SiteLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const { user } = useUser()

  return (
    <main className="h-full">
      <Navigation user={user} />
      {children}
    </main>
  )
}

export default SiteLayout
