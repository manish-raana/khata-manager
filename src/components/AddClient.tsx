'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useToast } from './ui/use-toast'
import { createClient } from '@/utils/supabase/client'
import {
  AddClientFormSchema,
  AddClientFormType,
  CLIENT_TYPE_ENUM,
} from '@/lib/zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Icons } from './ui/icons'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { PhoneInput } from '@/components/ui/phone-input'
import useClients from '@/store/hooks/useClients'
import { useRecoilValue } from 'recoil'
import { selectedStoresState } from '@/store/atoms/stores'

export function AddNewClient({
  clientType,
}: {
  clientType: 'CUSTOMER' | 'SUPPLIER' | 'EMPLOYEE'
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [showNewStoreDialog, setShowNewStoreDialog] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()
  const selectedStore = useRecoilValue(selectedStoresState)

  const form = useForm<AddClientFormType>({
    resolver: zodResolver(AddClientFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      client_type: clientType,
      address: '',
    },
  })

  const addClient = async (clientData: {
    name: string
    phone: string
    address: string
    store_id: number
    client_type: string
  }) => {
    const { data: storeResponse, error: storeError } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
    if (storeError) {
      console.error('Error adding client: ', storeError)
      toast({
        variant: 'default',
        title: 'Error adding store',
        description: 'An error occurred while adding store address',
      })
      return
    }
    toast({
      variant: 'success',
      title: 'Success',
      description: 'Your store has been added successfully!',
    })
    handleModalClose()
    return storeResponse
  }
  async function onSubmit(values: AddClientFormType) {
    console.log(values)
    setLoading(true)
    const clientResponse = await addClient({
      ...values,
      store_id: selectedStore?.id!,
    })
    console.log('client', clientResponse)
    setLoading(false)
  }
  const handleModalClose = () => {
    setShowNewStoreDialog(false)
    form.reset()
  }
  return (
    <Dialog open={showNewStoreDialog}>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="space-x-2"
          onClick={() => setShowNewStoreDialog(true)}
        >
          <Plus className="w-6 h-6" />
          <span> Add New {clientType.toLowerCase()}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New {clientType}</DialogTitle>
          <DialogDescription>
            Enter the below details to add a new {clientType}
          </DialogDescription>
        </DialogHeader>
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
                      placeholder={`Enter ${clientType.toLowerCase()} name...`}
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
                      placeholder={`Enter ${clientType.toLocaleLowerCase()} address...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-4 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create {clientType.toLowerCase()}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
