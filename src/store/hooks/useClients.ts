'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { clientListState, selectedClientState } from '../atoms/clients'
import { selectedStoresState } from '../atoms/stores'

const useClientList = (client_type: string) => {
  const [clientList, setClientList] = useRecoilState(clientListState)
  const selectedStore = useRecoilValue(selectedStoresState)
  const [selectedClient, setSelectedClient] =
    useRecoilState(selectedClientState)
  const supabase = createClient()

  const getClientList = async () => {
    setClientList([])
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_type', client_type)
      .eq('store_id', `${selectedStore?.id!}`)
    if (error) {
      console.error('Error fetching stores: ', error)
      return
    }
    console.log(data)
    if (data && data.length > 0) {
      setClientList(data)
      console.log(data)
    }
  }
  useEffect(() => {
    if (client_type) {
      getClientList()
    }
  }, [supabase])

  return { setSelectedClient, selectedClient, clientList, getClientList }
}

export default useClientList
