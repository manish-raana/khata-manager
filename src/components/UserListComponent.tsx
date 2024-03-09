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
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { IClientType } from '@/types/client';
import { selectedClientState } from '@/store/atoms/clients';
import { AddNewClient } from './AddClient';
import useClients from '@/store/hooks/useClients';

const UserListComponent = () => {
  const {clientList, getClientList} = useClients();

  const columns = ["Date", "Name", "Phone", "NET Balance"];
    return (
      <div className="flex flex-col space-y-4 w-full">
        <div className="flex items-center space-x-4">
          <ListSearch />
          <ListFilter />
        </div>
        <div className="bg-gray-100 rounded-md max-h-[650px] w-full p-0 dark:bg-black dark:text-white">
          <CardHeader columns={columns} />
          <div className="items-center justify-center h-96 hidden">
            <p className="text-center text-gray-500 mt-4 text-2xl">No Data Available</p>
          </div>
          <ScrollArea className="h-[650px] w-full  border">
            {clientList.map((item: IClientType) => (
              <CardRow key={item.id} client={item} />
            ))}
          </ScrollArea>
        </div>
        
      </div>
    );
}

export default UserListComponent

const CardRow = ({ client }: { client: IClientType}) => {
  const setSelectedClient = useSetRecoilState(selectedClientState);
  const selectedClient = useRecoilValue(selectedClientState);
  const formatDate = (timestamp:string) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" };
    const formattedDate = new Date(timestamp).toLocaleString("en-US");
    return formattedDate;
  };
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-5 w-full cursor-pointer",
        selectedClient?.id === client.id ? "bg-gray-400" : "even:bg-gray-50 even:dark:bg-gray-900 dark:text-white"
      )}
      onClick={(e) => setSelectedClient(client)}
    >
      <p className="w-full text-start">{formatDate(client.updated_at)}</p>
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
      <div className="flex items-center justify-between px-5 py-2 bg-gray-200 light:text-black rounded-t-md">
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
      <div className="w-full">
        <Label>Search for customers</Label>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="search by name or phone number" className="pl-8" />
        </div>
      </div>
    );
}