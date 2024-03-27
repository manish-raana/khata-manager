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
import toast from 'react-hot-toast'
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

export function AddNewTransaction({
  txnType,
  getTxnsList,
}: {
  txnType: 'GAVE' | 'GOT'
  getTxnsList: any
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [showSheet, setShowSheet] = useState<boolean>(false)
  const [selectedClient, setSelectedClient] =
    useRecoilState(selectedClientState)

  const supabase = createClient()
  const form = useForm<AddTxnFormType>({
    resolver: zodResolver(AddTxnFormSchema),
    defaultValues: {
      amount: 0,
      description: '',
      date: new Date(),
      file: '',
    },
  })

  const onSubmit = async (values: any) => {
    console.log('values', values)
    const reqdata = {
      amount: values.amount,
      description: values.description,
      date: values.date,
      client_id: selectedClient?.id,
      txn_type: txnType,
      store_id: selectedClient?.store_id,
      client_type: selectedClient?.client_type,
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .insert([reqdata])
      .select()
    setLoading(false)
    if (data) {
      toast('Transaction added successfully', {
        icon: '🎉',
        style: { background: '#22c55e', color: 'white' },
      })
      console.log('data', data)
      //getTxnsList()
      form.reset()
      setShowSheet(false)
    } else {
      toast('Error adding transaction', {
        icon: '❌',
        style: { background: '#ef4444', color: 'white' },
      })
    }
  }
  useEffect(() => {
    form.reset()
  }, [])

  const handleCloseSheet = () => {
    form.reset()
    setShowSheet(false)
  }
  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      <SheetTrigger asChild>
        <Button
          className={cn(
            'px-24',
            txnType === 'GAVE'
              ? 'bg-red-200 text-red-500'
              : 'bg-green-200 text-green-500'
          )}
          variant="outline"
          onClick={() => setShowSheet(true)}
        >
          {txnType === 'GAVE'
            ? selectedClient?.client_type === 'EMPLOYEE'
              ? 'Pay Amount'
              : 'Debit'
            : 'Credit'}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Entry</SheetTitle>
          <SheetDescription>
            Add new transaction entry for client
          </SheetDescription>
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
                        txnType === 'GOT' ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      You {txnType === 'GAVE' ? 'Gave' : 'Got'}
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
                      Add Entry
                    </Button>
                  </div>
                </div>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
