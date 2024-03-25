'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { selectedStoresState } from '@/store/atoms/stores'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

export function RecentSales() {
  const [transactionsList, setTransactionsList] = useState<any[] | null>([])
  const supabase = createClient()
  const selectedStore = useRecoilValue(selectedStoresState)

  const getClientTransactions = async () => {
    setTransactionsList([])
    const { data, error } = await supabase
      .from('transactions')
      .select(`*, clients( name, client_type, phone )`)
      .eq('store_id', selectedStore?.id)
      .limit(5)
      .order('created_at', { ascending: false })
    //console.log('transactions: ', data)
    setTransactionsList(data)
  }
  useEffect(() => {
    if (selectedStore && selectedStore.id) {
      getClientTransactions()
    }
  }, [selectedStore])

  if (transactionsList?.length === 0) {
    return (
      <div className="flex items-center">
        <p>No transactions found</p>
      </div>
    )
  }
  return (
    <div className="space-y-8 w-full">
      {transactionsList?.map((transaction) => (
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>
              {transaction?.clients?.client_type === 'EMPLOYEE'
                ? 'E'
                : transaction?.clients?.client_type === 'SUPPLIER'
                  ? 'S'
                  : 'C'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction?.clients?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction?.clients?.phone}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <span
              className={cn(
                transaction.txn_type === 'GOT'
                  ? 'text-green-500'
                  : 'text-red-500'
              )}
            >
              {transaction.txn_type === 'GOT' ? '+' : '-'} ₹{' '}
              {transaction?.amount}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
