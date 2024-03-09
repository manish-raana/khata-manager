'use client';
import { Plus, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { useSetRecoilState } from 'recoil';
import { IClientType } from '@/types/client';
import { selectedClientState } from '@/store/atoms/selectedClient';
import { AddNewClient } from './AddClient';

const UserListComponent = () => {
  const [customerList, setCustomerList] = useState<IClientType[]>([
      {
        id: 1,
        name: "John Doe",
        phone: "1234567890",
        netBalance: 1000,
        date: "2021-10-10",
        txnType: "give",
      },
      {
        id: 2,
        name: "Jane Doe",
        phone: "1234567890",
        netBalance: -1000,
        date: "2021-10-10",
        txnType: "get",
      },
      {
        id: 3,
        name: "John Doe",
        phone: "1234567890",
        netBalance: 0,
        date: "2021-10-10",
        txnType: "settled",
      },
      {
        id: 4,
        name: "Bob Johnson",
        phone: "(456) 789-0123",
        netBalance: 0,
        date: "2022-03-15",
        txnType: "settled",
      },
      {
        id: 5,
        name: "Alice Brown",
        phone: "(789) 012-3456",
        netBalance: 567,
        date: "2022-08-22",
        txnType: "give",
      },
      {
        id: 6,
        name: "David Miller",
        phone: "(123) 456-7890",
        netBalance: 789,
        date: "2022-01-07",
        txnType: "get",
      },
      {
        id: 7,
        name: "Jane Smith",
        phone: "(789) 012-3456",
        netBalance: 0,
        date: "2022-05-18",
        txnType: "settled",
      },
      {
        id: 8,
        name: "John Doe",
        phone: "(456) 789-0123",
        netBalance: 456,
        date: "2022-11-30",
        txnType: "give",
      },
      {
        id: 9,
        name: "Bob Johnson",
        phone: "(789) 012-3456",
        netBalance: 0,
        date: "2022-04-10",
        txnType: "settled",
      },
      {
        id: 10,
        name: "Alice Brown",
        phone: "(123) 456-7890",
        netBalance: 234,
        date: "2022-09-25",
        txnType: "get",
      },
      {
        id: 11,
        name: "David Miller",
        phone: "(456) 789-0123",
        netBalance: 567,
        date: "2022-06-03",
        txnType: "get",
      },
      {
        id: 12,
        name: "Jane Smith",
        phone: "(789) 012-3456",
        netBalance: 0,
        date: "2022-02-14",
        txnType: "settled",
      },
      {
        id: 13,
        name: "John Doe",
        phone: "(123) 456-7890",
        netBalance: 123,
        date: "2022-10-19",
        txnType: "give",
      },
      {
        id: 14,
        name: "Bob Johnson",
        phone: "(456) 789-0123",
        netBalance: 456,
        date: "2022-07-28",
        txnType: "get",
      },
      {
        id: 15,
        name: "Alice Brown",
        phone: "(789) 012-3456",
        netBalance: 0,
        date: "2022-12-05",
        txnType: "settled",
      },
      {
        id: 16,
        name: "David Miller",
        phone: "(123) 456-7890",
        netBalance: 234,
        date: "2022-03-20",
        txnType: "get",
      },
      {
        id: 17,
        name: "Jane Smith",
        phone: "(789) 012-3456",
        netBalance: 0,
        date: "2022-08-10",
        txnType: "settled",
      },
      {
        id: 18,
        name: "John Doe",
        phone: "(456) 789-0123",
        netBalance: 890,
        date: "2022-01-15",
        txnType: "get",
      },
      {
        id: 19,
        name: "Bob Johnson",
        phone: "(789) 012-3456",
        netBalance: 123,
        date: "2022-05-30",
        txnType: "get",
      },
      {
        id: 20,
        name: "Alice Brown",
        phone: "(123) 456-7890",
        netBalance: 0,
        date: "2022-10-14",
        txnType: "settled",
      },
      {
        id: 21,
        name: "David Miller",
        phone: "(456) 789-0123",
        netBalance: 789,
        date: "2022-04-25",
        txnType: "get",
      },
      {
        id: 22,
        name: "Jane Smith",
        phone: "(789) 012-3456",
        netBalance: 0,
        date: "2022-09-10",
        txnType: "settled",
      },
      {
        id: 23,
        name: "John Doe",
        phone: "(123) 456-7890",
        netBalance: 567,
        date: "2022-06-15",
        txnType: "get",
      },
      {
        id: 24,
        name: "Bob Johnson",
        phone: "(456) 789-0123",
        netBalance: 890,
        date: "2022-02-20",
        txnType: "give",
      },
    ]);
  const columns = ["Date", "Name", "Phone", "NET Balance"];
    return (
      <div className="flex flex-col space-y-4 w-full">
        <div className="flex items-center space-x-4">
          <ListSearch />
          <ListFilter />
        </div>
        <Card className="bg-gray-100 rounded-xl min-h-[500px] w-full p-0">
          <CardHeader columns={ columns} />
          <div className="items-center justify-center h-96 hidden">
            <p className="text-center text-gray-500 mt-4 text-2xl">No Data Available</p>
          </div>
          <ScrollArea className="h-[580px] w-full rounded-md border">
            {customerList.map((item: IClientType) => (
              <CardRow key={item.id} client={item} />
            ))}
          </ScrollArea>
        </Card>
        <div className="flex justify-end w-full">
          <AddNewClient />
        </div>
      </div>
    );
}

export default UserListComponent

const CardRow = ({ client }: { client: IClientType}) => {
  const setSelectedClient = useSetRecoilState(selectedClientState);
  return (
    <div className="flex items-center justify-between px-5 py-5 w-full even:bg-gray-50 cursor-pointer" onClick={(e) => setSelectedClient(client)}>
      <p className="w-full text-start">{client.date}</p>
      <p className="w-full text-start">{client.name}</p>
      <p className="w-full text-start">{client.phone}</p>
      <p className={cn("w-full text-end flex flex-col")}>
        <span
          className={cn(
            client.netBalance > 0 && client.txnType === "give" && "text-red-500",
            client.netBalance > 0 && client.txnType === "get" && "text-green-500"
          )}
        >
          ₹ {client.netBalance > 0 ? client.netBalance : "0.0"}
        </span>
        {client.netBalance > 0 && <span className="capitalize text-xs">You'll {client.txnType}</span>}
      </p>
    </div>
  );
};
const CardHeader = ({ columns }: {columns:any}) => {
    return (
      <div className="flex items-center justify-between px-5 py-2 bg-black text-white rounded-t-xl">
        {columns.map((item:any, index:any) => (
          <CardHeaderItem key={index} className={index === columns.length - 1 && "text-end"}>
            {item}
          </CardHeaderItem>
        ))}
      </div>
    );
}
const CardHeaderItem = ({ className, children }: any) => {
  const defaultClass = "w-full text-start font-bold";
  return (
    <p className={cn(defaultClass, className)}>
      {children}
    </p>
  );
};
const ListFilter = () => {
    const [selectedFilter, setSelectedFilter] = useState("all");
    useMemo(() => {
      console.log(selectedFilter);
    }, [selectedFilter]);
    return (
        <div className="w-28">
          <Label>Filter By</Label>
          <Select onValueChange={setSelectedFilter} defaultValue={selectedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="all">
                <span className="font-medium">All</span>
              </SelectItem>
              <SelectItem className="cursor-pointer" value="give">
                <span className="font-medium">You'll Give</span>
              </SelectItem>
              <SelectItem className="cursor-pointer" value="get">
                <span className="font-medium">You'll Get</span>
              </SelectItem>
              <SelectItem className="cursor-pointer" value="setteled">
                <span className="font-medium">Setteled</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
    );
}

const ListSearch = () => { 
    return (
        <div className='w-full'>
            <Label>Search for customers</Label>
            <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="search by name or phone number" className="pl-8" />
            </div>
        </div>
    );
}