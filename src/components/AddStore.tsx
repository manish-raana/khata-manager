'use client'
import { Input } from './ui/input'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AddStoreFormSchema, AddStoreFormType } from '@/lib/zod'
import { Icons } from './ui/icons'
import toast from 'react-hot-toast'
import { useSetRecoilState } from 'recoil'
import { storesListState } from '@/store/atoms/stores'

const AddStore = ({ setShowNewStoreDialog }: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const supabase = createClient()
  const setStoreList = useSetRecoilState(storesListState)

  const form = useForm<AddStoreFormType>({
    resolver: zodResolver(AddStoreFormSchema),
    defaultValues: {
      name: '',
      address: '',
    },
  })

  const addStore = async (storeData: { name: string; address: string }) => {
    const { data: storeResponse, error: storeError } = await supabase
      .from('store')
      .insert([storeData])
      .select()
    if (storeError) {
      console.error('Error adding store: ', storeError)
      toast('Error adding store', {
        icon: '❌',
        style: { background: '#ef4444', color: 'white' },
      })
      return
    }
    toast('Store added successfully', {
      icon: '🎉',
      style: { background: '#22c55e', color: 'white' },
    })
    setStoreList((prev) => {
      return prev.concat(storeResponse)
    })
    return storeResponse
  }
  async function onSubmit(values: AddStoreFormType) {
    console.log(values)
    setLoading(true)
    const { data: stores } = await supabase
      .from('store')
      .select('*')
      .ilike('name', `%${values.name}%`)
    if (stores && stores.length > 0) {
      toast('Store already exists', {
        icon: '❌',
        style: { background: '#ef4444', color: 'white' },
      })
      setLoading(false)
      return
    }
    await addStore(values)
    setShowNewStoreDialog(false)

    setLoading(false)
  }
  return (
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
                  placeholder="Enter store name..."
                  {...field}
                />
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
                  placeholder="Enter store address..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowNewStoreDialog(false)}
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddStore
