'use client';
import { selectedClientState } from '@/store/atoms/clients';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { Card } from './ui/card';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';
import useTxnsList from '@/store/hooks/useTxns';
import { AddNewTransaction } from './AddTransaction';
import { EditClient } from './EditClient';

const TransactionsList = () => {
  const selectedClient = useRecoilValue(selectedClientState);
  const columns = ["Date", "You Gave", "You Got"];
  const { txnsList } = useTxnsList();
  console.log('txnsList', txnsList)
  if (selectedClient === null) { 
    return (
      <div className="flex items-center justify-center w-full h-[800px]">
        <p className="text-center text-gray-500 mt-4 text-2xl">No Client Selected</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="bg-gray-100 rounded-lg p-2 flex items-start justify-between dark:bg-black dark:text-white">
        <div>
          <p>
            <b>Name:</b> {selectedClient?.name}
          </p>
          <p>
            <b>Phone:</b> {selectedClient?.phone}
          </p>
        </div>
        <p className="w-1/2">
          <b>Address:</b> {selectedClient?.address}
        </p>
        <EditClient />
      </div>
      <div className="bg-gray-100 rounded-lg flex items-center justify-between p-2 dark:bg-black dark:text-white">
        <div>
          <p>Net Balance</p>
          <p>₹ 50000</p>
        </div>
        <div className="text-red-500">
          <p>You Gave</p>
          <p>₹ 50000</p>
        </div>
        <div className="text-green-500">
          <p>You Got</p>
          <p>₹ 50000</p>
        </div>
        <Button>Send Reminders</Button>
      </div>

      <Card className="bg-gray-100 rounded-md min-h-[500px] w-full p-0 dark:bg-black dark:text-white">
        <CardHeader columns={columns} />
        <div className="items-center justify-center h-96 hidden">
          <p className="text-center text-gray-500 mt-4 text-2xl">No Data Available</p>
        </div>
        <ScrollArea className="h-[610px] w-full rounded-md border">
          {txnsList.map((item: any) => (
            <div className="flex items-center justify-between px-5 py-5 w-full even:bg-gray-50 cursor-pointer">
              <p className="w-full text-start">{item.date}</p>
              <p className="w-full text-start">{item.txnType === "gave" ? item.amount : "-"}</p>
              <p className="w-full text-start">{item.txnType === "got" ? item.amount : "-"}</p>
            </div>
          ))}
        </ScrollArea>
      </Card>
      <div className="flex justify-center w-full space-x-24">
        <AddNewTransaction />
        <button className="px-10 py-2 rounded-lg text-white font-semibold bg-red-500">Gave</button>
        <button className="px-10 py-2 rounded-lg text-white font-semibold bg-green-500">Got</button>
      </div>
    </div>
  );
}

export default TransactionsList;

const CardHeader = ({ columns }: { columns: any }) => {
  return (
    <div className="flex items-center justify-between px-5 py-2 bg-gray-200 dark:text-white rounded-t-md">
      {columns.map((item: any, index: any) => (
        <CardHeaderItem key={index} className={index === columns.length - 1 && "text-end"}>
          {item}
        </CardHeaderItem>
      ))}
    </div>
  );
};
const CardHeaderItem = ({ className, children }: any) => {
  const defaultClass = "w-full text-start font-bold";
  return <p className={cn(defaultClass, className)}>{children}</p>;
};