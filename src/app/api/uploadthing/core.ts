import { auth } from '@clerk/nextjs'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

const authUser = () => {
  const user = auth()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  subAccountLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authUser)
    .onUploadComplete(() => {}),
  avatar: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authUser)
    .onUploadComplete(() => {}),
  agencyLogo: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authUser)
    .onUploadComplete(() => {}),
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(authUser)
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
