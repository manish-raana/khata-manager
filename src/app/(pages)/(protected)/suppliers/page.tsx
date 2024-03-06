import { CalendarDateRangePicker } from '@/components/dashboard/date-range-picker';
import { Button } from '@/components/ui/button';
import React from 'react'

const SupplierPage = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
    </div>
  );
}

export default SupplierPage