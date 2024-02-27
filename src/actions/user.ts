'use server'

import { clerkClient, currentUser } from '@clerk/nextjs'
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

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser()

  if (!user) {
    return
  }

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  })

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  })

  return userData
}
