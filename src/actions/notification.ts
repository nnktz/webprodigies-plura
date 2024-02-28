'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string
  description: string
  subAccountId?: string
}) => {
  const authUser = await currentUser()
  let userData

  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        agency: {
          subAccount: {
            some: {
              id: subAccountId,
            },
          },
        },
      },
    })

    if (response) {
      userData = response
    }
  } else {
    userData = await db.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    })
  }

  if (!userData) {
    console.log('Could not find user')
    return
  }

  let foundAgencyId = agencyId

  if (!foundAgencyId) {
    if (!subAccountId) {
      throw new Error('You need to provide at least an agency ID or sub account ID')
    }

    const response = await db.subAccount.findUnique({
      where: {
        id: subAccountId,
      },
    })

    if (response) {
      foundAgencyId = response.agencyId
    }
  }

  if (subAccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        subAccount: {
          connect: {
            id: subAccountId,
          },
        },
      },
    })
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        user: {
          connect: {
            id: userData.id,
          },
        },
        agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    })
  }
}

export const getNotificationAndUser = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: {
        agencyId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return response
  } catch (error) {
    console.log(error)
  }
}
