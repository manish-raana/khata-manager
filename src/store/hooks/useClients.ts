'use client'
import { createClient } from '@/utils/supabase/client'
import { useRecoilState } from 'recoil'
import { clientListState, selectedClientState } from '../atoms/clients'

const useClientList = () => {
  const [clientList, setClientList] = useRecoilState(clientListState)
  const [selectedClient, setSelectedClient] =
    useRecoilState(selectedClientState)
  const supabase = createClient()

  const getClientList = async (clientType: string, storeId: number) => {
    setClientList([])
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_type', clientType)
      .eq('store_id', storeId)
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

  return { setSelectedClient, selectedClient, clientList, getClientList }
}

export default useClientList
