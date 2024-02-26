import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Plan } from '@prisma/client'

import { getUserDetails } from '@/actions/user'
import { verifyAndAcceptInvitation } from '@/actions/invitation'

import { AgencyDetails } from '@/components/forms/agency-details'

type Props = {
  searchParams: { plan: Plan; state: string; code: string }
}

const AgencyPage = async ({ searchParams }: Props) => {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const agencyId = await verifyAndAcceptInvitation()

  const userData = await getUserDetails()

  if (agencyId) {
    if (userData?.role === 'SUBACCOUNT_GUEST' || userData?.role === 'SUBACCOUNT_USER') {
      return redirect('/subaccount')
    } else if (userData?.role === 'AGENCY_OWNER' || userData?.role === 'AGENCY_ADMIN') {
      if (searchParams.plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
      }

      if (searchParams.state) {
        const statePath = searchParams.state.split('__')[0]
        const stateAgencyId = searchParams.state.split('__')[1]

        if (!stateAgencyId) {
          return <div className="">Not authorized</div>
        }

        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)
      } else {
        return redirect(`/agency/${agencyId}`)
      }
    } else {
      return <div className="">Not authorized</div>
    }

    return <div className=""></div>
  }

  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="max-w-[850px] rounded-xl border p-4">
        <div className="text-4xl">Create an Agency</div>

        <AgencyDetails data={{ companyEmail: user.emailAddresses[0].emailAddress }} />
      </div>
    </div>
  )
}

export default AgencyPage
