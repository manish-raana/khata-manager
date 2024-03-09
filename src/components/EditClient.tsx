import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { PhoneInput } from './ui/phone-input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Icons } from './ui/icons'
import { useEffect, useState } from 'react'
import { AddClientFormSchema, AddClientFormType } from '@/lib/zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedClientState } from '@/store/atoms/clients'
import { createClient } from '@/utils/supabase/client'
import useClients from '@/store/hooks/useClients'
import { useToast } from '@/components/ui/use-toast'

export function EditClient() {
  const [showSheet, setShowSheet] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] =
    useRecoilState(selectedClientState)
  const { getClientList } = useClients('CUSTOMER')
  //console.log('selectedClient', selectedClient)
  const { toast } = useToast()
  const supabase = createClient()
  const form = useForm<AddClientFormType>({
    resolver: zodResolver(AddClientFormSchema),
    defaultValues: selectedClient!,
  })

  async function onSubmit(values: AddClientFormType) {
    console.log(values)
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: values.name,
        address: values.address,
        phone: values.phone,
        client_type: values.client_type,
      })
      .eq('id', selectedClient?.id)
      .select()
    console.log('data', data)
    if (data) {
      getClientList()
      setSelectedClient(data[0])
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Client has been updated successfully!',
      })
    }
    console.log('error', error)
    //handleCloseSheet();
    setLoading(false)
  }
  const handleDelete = async () => {
    console.log('deleting...')
    setDeleting(true)
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', selectedClient?.id)
    if (error) {
      console.log('error', error)
      toast({
        variant: 'default',
        title: 'Error deleting client',
        description: 'An error occurred while deleting client',
      })
    } else {
      getClientList()
      setSelectedClient(null)
      handleCloseSheet()
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Client has been deleted successfully!',
      })
    }
    setDeleting(false)
  }
  const handleCloseSheet = () => {
    form.reset()
    setShowSheet(false)
  }
  useEffect(() => {
    form.reset(selectedClient!)
  }, [selectedClient])

  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setShowSheet(true)}>
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Edit partner profile data</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2 pb-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      defaultValue={field.value}
                      placeholder={`Enter partner name...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-left">Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput placeholder="Enter a phone number" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={`Enter partner address...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Client Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-10"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="CUSTOMER" />
                        </FormControl>
                        <FormLabel className="font-normal">Customer</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="SUPPLIER" />
                        </FormControl>
                        <FormLabel className="font-normal">Supplier</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-4 pt-5">
              <SheetFooter>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-4">
                    <Button
                      onClick={handleCloseSheet}
                      disabled={loading || deleting}
                      variant={'destructive'}
                      className="px-5"
                    >
                      Cancel
                    </Button>
                    <Button disabled={loading || deleting} type="submit">
                      {loading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                  <Button
                    disabled={loading || deleting}
                    onClick={handleDelete}
                    variant={'outline'}
                    className="px-24 border-red-500 text-red-500 hover:bg-red-500 hover:text-white absolute bottom-10"
                  >
                    {deleting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                  </Button>
                </div>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
