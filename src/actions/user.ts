'use server'

import { currentUser } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { User } from '@prisma/client'

export const getUserDetails = async () => {
  const user = await currentUser()

  if (!user) {
    return
  }

  const data = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      agency: {
        include: {
          sidebarOption: true,
          subAccount: {
            include: {
              sidebarOption: true,
            },
          },
        },
      },
      permissions: true,
    },
  })

  return data
}

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === 'AGENCY_OWNER') {
    return null
  }

  const response = await db.user.create({
    data: {
      ...user,
    },
  })

  return response
}
