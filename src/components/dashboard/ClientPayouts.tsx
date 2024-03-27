'use client'
import { cn } from '@/lib/utils'
import { selectedStoresState } from '@/store/atoms/stores'
import { createClient } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const ClientPayouts = ({
  clientType,
}: {
  clientType: 'SUPPLIER' | 'CUSTOMER' | 'EMPLOYEE'
}) => {
  const initialPayouts = {
    gave: 0,
    got: 0,
  }
  const [payouts, setPayouts] = useState(initialPayouts)
  const selectedStore = useRecoilValue(selectedStoresState)
  const supabase = createClient()

  const getPayouts = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('net_balance')
      .eq('client_type', clientType)

    let gavePayout = 0
    let receivedPayout = 0

    if (data) {
      data.forEach((row) => {
        if (row.net_balance < 0) {
          gavePayout += row.net_balance
        } else {
          receivedPayout += row.net_balance
        }
      })
    }
    // console.log(clientType, ' - Gave payout:', gavePayout)
    //console.log(clientType, ' - Received payout:', receivedPayout)
    setPayouts({
      gave: gavePayout,
      got: receivedPayout,
    })
  }

  useEffect(() => {
    if (selectedStore && selectedStore.id) {
      getPayouts()
    }
  }, [selectedStore])
  return (
    <div>
      <p className="flex items-center justify-between">
        Debited
        <span
          className={cn(
            payouts.gave < 0 && 'text-red-500',
            payouts.gave > 0 && 'text-green-500'
          )}
        >
          {payouts.gave < 0 && '-'} {payouts.gave > 0 && '+'} ₹{' '}
          {Math.abs(payouts.gave)}
        </span>
      </p>
      <p className="flex items-center justify-between">
        Credited
        <span
          className={cn(
            payouts.got < 0 && 'text-red-500',
            payouts.got > 0 && 'text-green-500'
          )}
        >
          {payouts.got < 0 && '-'} {payouts.got > 0 && '+'} ₹ {payouts.got}
        </span>
      </p>
    </div>
  )
}

export default ClientPayouts
