'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { selectedClientState } from '../atoms/clients'

const useSalaryPayouts = () => {
  const [txnsList, setTxnsList] = useState<any>([])
  const supabase = createClient()
  const selectedClient = useRecoilValue(selectedClientState)

  const getTxnsList = async () => {
    setTxnsList([])
    //console.log('selectedClient', selectedClient)
    const currentDate = new Date()
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
    const formattedFirstDayOfMonth = firstDayOfMonth.toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_id', `${selectedClient?.id!}`)
      .gt('date', formattedFirstDayOfMonth)
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

  useEffect(() => {
    if (selectedClient) {
      getTxnsList()
    }
  }, [selectedClient, supabase])

  return { txnsList, getTxnsList }
}

export default useSalaryPayouts
