'use client'
import { createClient } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'

const ClientsCount = () => {
  const [clientCount, setClientCount] = useState({
    customers: 0,
    employees: 0,
    suppliers: 0,
  })

  const supabase = createClient()

  const getClientCount = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('client_type')
      .in('client_type', ['CUSTOMER', 'SUPPLIER', 'EMPLOYEE'])

    // Initialize counts for each type
    let customerCount = 0
    let supplierCount = 0
    let employeeCount = 0

    // Count occurrences of each type
    if (data) {
      data.forEach((row) => {
        switch (row.client_type) {
          case 'CUSTOMER':
            customerCount++
            break
          case 'SUPPLIER':
            supplierCount++
            break
          case 'EMPLOYEE':
            employeeCount++
            break
          default:
            break
        }
      })
    }
    setClientCount({
      customers: customerCount,
      employees: employeeCount,
      suppliers: supplierCount,
    })
    if (error) {
      console.error(error)
      return
    }
  }

  useEffect(() => {
    getClientCount()
  }, [])
  return (
    <div>
      <p className="flex items-center justify-between w-full">
        Customers <span>{clientCount.customers}</span>
      </p>
      <p className="flex items-center justify-between w-full">
        Suppliers <span> {clientCount.suppliers}</span>
      </p>
      <p className="flex items-center justify-between w-full">
        Employees <span>{clientCount.employees}</span>
      </p>
    </div>
  )
}

export default ClientsCount
