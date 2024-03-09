import { AddNewClient } from '@/components/AddClient'
import TransactionsList from '@/components/TransactionsList'
import UserListComponent from '@/components/UserListComponent'
import React from 'react'

export default function SupplierPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 px-24">
      <div className="md:flex justify-between items-start mt-0 gap-4 w-full">
        <div className="md:w-[48%] w-full space-y-10">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
            <AddNewClient clientType={'SUPPLIER'} />
          </div>

          <UserListComponent clientType={'SUPPLIER'} />
        </div>
        <div className="md:w-[48%] w-full">
          <TransactionsList />
        </div>
      </div>
    </div>
  )
}
