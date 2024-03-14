import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createClient } from '@/utils/supabase/client'
import { selectedClientState } from '@/store/atoms/clients'
import { useRecoilState } from 'recoil'
import { AddTxnFormSchema, AddTxnFormType } from '@/lib/zod'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Textarea } from './ui/textarea'
import { Icons } from './ui/icons'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import toast from 'react-hot-toast'
import { DeleteAlert } from './DeleteAlert'

export function EditTransaction({
  selectedTxn,
  handleEditReset,
}: {
  selectedTxn: any
  handleEditReset: any
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [showSheet, setShowSheet] = useState<boolean>(true)
  const [selectedClient, setSelectedClient] =
    useRecoilState(selectedClientState)

  const supabase = createClient()
  const form = useForm<AddTxnFormType>({
    resolver: zodResolver(AddTxnFormSchema),
    defaultValues: {
      amount: selectedTxn.amount,
      description: selectedTxn.description,
      date: new Date(selectedTxn.date),
      file: '',
      txn_type: selectedTxn.txn_type,
    },
  })

  const onSubmit = async (values: any) => {
    console.log('values', values)
    const reqdata = {
      amount: values.amount,
      description: values.description,
      date: values.date,
      client_id: selectedClient?.id,
      txn_type: selectedTxn.txn_type,
      store_id: selectedClient?.store_id,
      client_type: selectedClient?.client_type,
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .update(reqdata)
      .eq('id', selectedTxn?.id)
      .select()

    setLoading(false)

    if (data) {
      toast('Transaction Updated successfully', {
        icon: '🎉',
        style: { background: '#22c55e', color: 'white' },
      })
      console.log('data', data)
      //getTxnsList()
      form.reset()
      setShowSheet(false)
    } else {
      toast('Error updating transaction', {
        icon: '❌',
        style: { background: '#ef4444', color: 'white' },
      })
    }
  }
  const handleDelete = async () => {
    console.log('deleting...')
    setDeleting(true)
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', selectedTxn?.id)
    if (error) {
      console.log('error', error)
      toast('Error deleting txn', {
        icon: '❌',
        style: { background: '#ef4444', color: 'white' },
      })
    } else {
      handleCloseSheet()
      toast('Txn deleted successfully', {
        icon: '🎉',
        style: { background: '#22c55e', color: 'white' },
      })
    }
    setDeleting(false)
  }
  useEffect(() => {
    form.reset()
  }, [])

  useEffect(() => {
    if (showSheet === false) {
      handleCloseSheet()
    }
  }, [showSheet])

  const handleCloseSheet = () => {
    form.reset()
    setShowSheet(false)
    handleEditReset()
  }
  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      {/* <SheetTrigger asChild>
        <Button variant="outline" onClick={() => setShowSheet(true)}>
          Edit
        </Button>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Transaction Entry</SheetTitle>
          <SheetDescription>Edit transaction entry for client</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onKeyDown={(event) => {
              // Prevent form submission when Enter key is pressed
              if (event.key === 'Enter') {
                console.log('Enter key pressed')
                event.preventDefault()
                form.handleSubmit(onSubmit)()
              }
            }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2 pb-4"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Amount{' '}
                    <span
                      className={cn(
                        selectedTxn.txn_type === 'GOT'
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    >
                      You {selectedTxn.txn_type === 'GAVE' ? 'Gave' : 'Got'}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`Enter amount...`}
                      {...field}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      //defaultValue={field.value}
                      placeholder={`Enter description...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Payment</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach Bill</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      defaultValue={field.value}
                      placeholder={`select a bill...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="txn_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="GAVE" />
                        </FormControl>
                        <FormLabel className="font-normal">You Gave</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="GOT" />
                        </FormControl>
                        <FormLabel className="font-normal">You Got</FormLabel>
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
                      disabled={loading}
                      variant={'destructive'}
                      className="px-5"
                    >
                      Cancel
                    </Button>
                    <Button disabled={loading} type="submit">
                      {loading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                  {/* <div className="absolute bottom-10 w-full">
                    <DeleteAlert
                      recordType="transaction"
                      handleDelete={handleDelete}
                      className="px-24"
                    />
                  </div> */}
                </div>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
