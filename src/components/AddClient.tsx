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
import useStoreList from '@/store/hooks/useStoreList'
import useClients from '@/store/hooks/useClients'

export function AddNewClient({ clientType }: { clientType: string }) {
  const [loading, setLoading] = useState<boolean>(false)
  const [showNewStoreDialog, setShowNewStoreDialog] = useState(false)
  const { selectedStore } = useStoreList()
  const { toast } = useToast()
  const supabase = createClient()
  const { getClientList } = useClients(clientType)

  const form = useForm<AddClientFormType>({
    resolver: zodResolver(AddClientFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      client_type: CLIENT_TYPE_ENUM.Values.CUSTOMER,
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
    getClientList()
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
          className="space-x-2"
          onClick={() => setShowNewStoreDialog(true)}
        >
          <Plus className="w-6 h-6" />
          <span> Add New {clientType}</span>
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
                      placeholder={`Enter ${clientType} name...`}
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
                      placeholder={`Enter ${clientType} address...`}
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
                Create {clientType}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
