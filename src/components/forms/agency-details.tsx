'use client'

import * as z from 'zod'
import { Agency } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NumberInput } from '@tremor/react'
import { v4 } from 'uuid'

import { formAgencySchema } from '@/lib/schemas'
import { deleteAgency, updateAgencyDetails, upsertAgency } from '@/actions/agency'
import { saveActivityLogsNotification } from '@/actions/notification'
import { initUser } from '@/actions/user'

import { useToast } from '../ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { FileUpload } from '../global/file-upload'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'
import { Loading } from '../global/loading'

type Props = {
  data?: Partial<Agency>
}

export const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast()
  const router = useRouter()

  const [deletingAgency, setDeletingAgency] = useState(false)

  const form = useForm<z.infer<typeof formAgencySchema>>({
    resolver: zodResolver(formAgencySchema),
    mode: 'onChange',
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    },
  })

  const isLoading = form.formState.isLoading

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data, form])

  const onSubmit = async (values: z.infer<typeof formAgencySchema>) => {
    try {
      let newUserData
      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line_1: values.address,
              postal_code: values.zipCode,
              state: values.state,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line_1: values.address,
            postal_code: values.zipCode,
            state: values.state,
          },
        }
      }

      newUserData = await initUser({ role: 'AGENCY_OWNER' })

      if (!data?.id) {
        await upsertAgency({
          id: data?.id ? data.id : v4(),
          address: values.address,
          agencyLogo: values.agencyLogo,
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectionAccountId: '',
          goal: 5,
        })

        toast({
          title: 'Created Agency',
        })

        return router.refresh()
      }
    } catch (error) {
      console.log(error)

      toast({
        title: 'Oppse!',
        description: 'Could not create your agency',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAgency = async () => {
    if (!data?.id) {
      return
    }

    setDeletingAgency(true)

    try {
      await deleteAgency(data.id)

      toast({
        title: 'Deleted Agency',
        description: 'Deleted your agency and all sub accounts',
      })

      router.refresh()
    } catch (error) {
      console.log(error)

      toast({
        title: 'Oppse!',
        description: 'Could not delete your agency',
        variant: 'destructive',
      })
    } finally {
      setDeletingAgency(false)
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for you business. You can edit agency settings later from agency
            settings tab.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
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
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input autoFocus placeholder="Your agency name" {...field} />
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
                name="whiteLabel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
                    <div>
                      <FormLabel>Whitelabel Agency</FormLabel>
                      <FormDescription>
                        Turning on whitelabel mode will show you agency logo to all sub accounts by
                        default. You can overwrite this functionality through sub account settings.
                      </FormDescription>
                    </div>

                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

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

              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for your agency. As your business grows your goals grow too so
                    don&apos;t forget to set the bar higher!
                  </FormDescription>

                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val) => {
                      if (!data.id) {
                        return
                      }

                      await updateAgencyDetails(data.id, { goal: val })
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        subAccountId: undefined,
                        description: `Updated the agency goal to | ${val} sub account`,
                      })

                      router.refresh()
                    }}
                    min={1}
                    className="!border !border-input bg-background px-4"
                    placeholder="Sub account goal"
                  />
                </div>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : 'Save Agency Information'}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-destructive p-4">
              <div>Danger Zone</div>

              <div className="text-muted-foreground">
                Deleting your agency cannot be undone. This will also delete all sub accounts and
                all data related to your sub accounts. Sub accounts will no longer have access to
                funnels, contacts, etc.
              </div>

              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="mt-2 whitespace-nowrap rounded-md p-2 text-center text-red-600 hover:bg-red-600 hover:text-white"
              >
                {deletingAgency ? 'Deleting...' : 'Delete Agency'}
              </AlertDialogTrigger>
            </div>
          )}

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the Agency account and
                all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}
