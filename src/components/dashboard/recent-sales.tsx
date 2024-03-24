'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export function RecentSales() {
  const [transactionsList, setTransactionsList] = useState<any[] | null>([])
  const supabase = createClient()

  const getClientTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`*, clients( name, client_type, phone )`)
      .limit(5)
      .order('created_at', { ascending: false })
    console.log('transactions: ', data)
    setTransactionsList(data)
  }
  useEffect(() => {
    getClientTransactions()
  }, [])
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
