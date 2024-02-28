import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { verifyAndAcceptInvitation } from '@/actions/invitation'
import { getNotificationAndUser } from '@/actions/notification'

import { Unauthorized } from '@/components/unauthorized'
import { Sidebar } from '@/components/sidebar'

type Props = {
  params: {
    agencyId: string
  }
  children: Readonly<{
    children: React.ReactNode
  }>
}

const AgencyIdLayout = async ({ params, children: { children } }: Props) => {
  const user = await currentUser()

  if (!user) {
    return redirect('/')
  }

  const agencyId = await verifyAndAcceptInvitation()

  if (!agencyId) {
    return redirect('/agency')
  }

  if (
    user.privateMetadata.role !== 'AGENCY_OWNER' &&
    user.privateMetadata.role !== 'AGENCY_ADMIN'
  ) {
    return <Unauthorized />
  }

  let allNoti: any = []

  const notifications = await getNotificationAndUser(agencyId)

  if (notifications) {
    allNoti = notifications
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />

      <div className="md:pl-[300px]">
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}

export default AgencyIdLayout
