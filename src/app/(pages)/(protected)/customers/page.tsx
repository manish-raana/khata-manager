import TransactionsList from '@/components/TransactionsList';
import UserListComponent from '@/components/UserListComponent';
import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import { Button } from '@/components/ui/button';
import React from 'react'

export default async function CustomerPage() {
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <div className="hidden md:flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <div className='md:flex items-start gap-4 w-full'>
        <div className="md:w-[45%] w-full">
          <UserListComponent />
          
        </div>
        <div className="md:w-[45%] w-full">
        
          <TransactionsList />
        </div>
      </div>
    </div>
  );
}