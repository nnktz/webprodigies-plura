'use client'

import * as z from 'zod'
import { Agency, SubAccount } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 } from 'uuid'

import { formSubAccountSchema } from '@/lib/schemas'
import { saveActivityLogsNotification } from '@/actions/notification'
import { upsertSubAccount } from '@/actions/subaccount'
import { useModal } from '@/providers/modal-provider'

import { useToast } from '../ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { FileUpload } from '../global/file-upload'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loading } from '../global/loading'

type Props = {
  agencyDetails: Agency
  details?: Partial<SubAccount>
  userId: string
  userName: string
}

export const SubAccountDetail = ({ agencyDetails, details, userId, userName }: Props) => {
  const { toast } = useToast()
  const { setClose } = useModal()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSubAccountSchema>>({
    resolver: zodResolver(formSubAccountSchema),
    defaultValues: {
      name: details?.name,
      companyEmail: details?.companyEmail,
      companyPhone: details?.companyPhone,
      address: details?.address,
      city: details?.city,
      zipCode: details?.zipCode,
      state: details?.state,
      country: details?.country,
      subAccountLogo: details?.subAccountLogo,
    },
  })

  const isLoading = form.formState.isLoading

  useEffect(() => {
    if (details) {
      form.reset(details)
    }
  }, [details, form])

  const onSubmit = async (values: z.infer<typeof formSubAccountSchema>) => {
    try {
      const response = await upsertSubAccount({
        id: details?.id ? details.id : v4(),
        address: values.address,
        subAccountLogo: values.subAccountLogo,
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        zipCode: values.zipCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyEmail: values.companyEmail,
        agencyId: agencyDetails.id,
        connectionAccountId: '',
        goal: 5000,
      })

      if (!response) {
        throw new Error('No response from server')
      }

      await saveActivityLogsNotification({
        agencyId: response.agencyId,
        description: `${userName} | updated sub account | ${response.name}`,
        subAccountId: response.id,
      })

      toast({
        title: 'Sub account details saved',
        description: 'Successfully saved your sub account details',
      })

      setClose()
      router.refresh()
    } catch (error) {
      console.log(error)

      toast({
        title: 'Oppse!',
        description: 'Could not save sub account details',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sub Account Information</CardTitle>
        <CardDescription>Please enter business details.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="subAccountLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Logo</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subAccountLogo"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 md:flex-row">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sub Account Name</FormLabel>
                    <FormControl>
                      <Input autoFocus placeholder="Your sub account name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Agency Email</FormLabel>
                    <FormControl>
                      <Input type="email" readOnly placeholder="Email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 md:flex-row">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Agency Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 st" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 md:flex-row">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Zipcode</FormLabel>
                    <FormControl>
                      <Input placeholder="Zipcode" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loading /> : 'Save Sub Account Information'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
