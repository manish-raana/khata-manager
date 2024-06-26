'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { selectedClientState } from '../atoms/clients'

const useTxnsList = () => {
  const [txnsList, setTxnsList] = useState<any>([])
  const supabase = createClient()
  const selectedClient = useRecoilValue(selectedClientState)

  const getTxnsList = async () => {
    setTxnsList([])
    //console.log('selectedClient', selectedClient)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_id', `${selectedClient?.id!}`)
      .order('date', { ascending: false })
    if (error) {
      console.error('Error fetching txns: ', error)
      return
    }
    //console.log(data)
    if (data && data.length > 0) {
      setTxnsList(data)
      //console.log(data)
    }
  }

  const addTxnEvent = (payload: any) => {
    console.log('addTxnEvent', payload)
    setTxnsList((prev: any) => [payload.new, ...prev])
  }
  const updateTxnEvent = (payload: any) => {
    console.log('updateTxnEvent', payload)
    setTxnsList((prev: any) => {
      return prev.map((txn: any) => {
        if (txn.id === payload.new.id) {
          return payload.new // Replace the item with the updated payload
        }
        return txn // Return unchanged items
      })
    })
  }
  const deleteTxnEvent = (payload: any) => {
    console.log('deleteTxnEvent', payload)
    setTxnsList((prev: any) => {
      return prev.filter((txn: any) => txn.id !== payload.old.id)
    })
  }

  useEffect(() => {
    const channels = supabase
      .channel('trasactions-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          console.log('Change received!', payload)
          if (payload.eventType === 'INSERT') {
            addTxnEvent(payload)
          }
          if (payload.eventType === 'UPDATE') {
            updateTxnEvent(payload)
          }
          if (payload.eventType === 'DELETE') {
            deleteTxnEvent(payload)
          }
        }
      )
      .subscribe()
    if (selectedClient) {
      getTxnsList()
    }
    return () => {
      channels.unsubscribe()
    }
  }, [selectedClient, supabase])

  return { txnsList, getTxnsList }
}

export default useTxnsList
