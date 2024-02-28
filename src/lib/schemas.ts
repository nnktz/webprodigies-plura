import * as z from 'zod'

export const formAgencySchema = z.object({
  name: z.string().min(2, {
    message: 'Agency name must be at least 2 characters',
  }),
  companyEmail: z.string().email().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),
})

export const formSubAccountSchema = z.object({
  name: z.string(),
  companyEmail: z.string().email(),
  companyPhone: z.string().min(1),
  address: z.string(),
  city: z.string(),
  subAccountLogo: z.string(),
  zipCode: z.string(),
  state: z.string(),
  country: z.string(),
})
