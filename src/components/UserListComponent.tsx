'use client'
import { Search } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import TimeAgo from 'react-timeago'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { cn } from '@/lib/utils'
import { ScrollArea } from './ui/scroll-area'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { IClientType } from '@/types/client'
import { clientListState, selectedClientState } from '@/store/atoms/clients'
import { selectedStoresState } from '@/store/atoms/stores'
import { createClient } from '@/utils/supabase/client'
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'

const UserListComponent = ({
  clientType,
}: {
  clientType: 'SUPPLIER' | 'CUSTOMER' | 'EMPLOYEE'
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const selectedStore = useRecoilValue(selectedStoresState)
  const [clientList, setClientList] = useRecoilState(clientListState)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const setSelectedClient = useSetRecoilState(selectedClientState)

  useEffect(() => {
    setSelectedClient(null)
  }, [])
  const handleFilterChange = (filterValue: any) => {
    //console.log('filterValue', filterValue)
    setSelectedFilter(filterValue)
  }

  const supabase = createClient()

  const getClientList = async (_clientType: string, _storeId: number) => {
    if (!_storeId) return
    setClientList([])
    //console.log('fetching client list')
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_type', _clientType)
      .eq('store_id', _storeId)

    if (error) {
      console.error('Error fetching clients: ', error)
      return
    }
    if (data && data.length > 0) {
      setClientList(data)
      console.log(data)
    }
  }

  const memoizedGetClientList = useMemo(
    () => getClientList,
    [clientType, selectedStore?.id!]
  )

  const updateClientEvent = (payload: any) => {
    //console.log('client update event received!', payload)
    //console.log('clients', clientList)
    setClientList((prev) => {
      return prev.map((item) => {
        if (item.id === payload.new.id) {
          return payload.new // Replace the item with the updated payload
        }
        return item // Return unchanged items
      })
    })
  }

  const addClientEvent = (payload: any) => {
    //console.log('client add event received!', payload)
    setClientList((prev) => {
      return [payload.new, ...prev]
    })
  }
  const deleteClientEvent = (payload: any) => {
    //console.log('client delete event received!', payload)
    setClientList((prev) => {
      return prev.filter((item) => item.id !== payload.old.id)
    })
  }
  useEffect(() => {
    const channels = supabase
      .channel('clients-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
        },
        (payload) => {
          //console.log('client Change received!', payload)
          if (payload && payload.eventType === 'UPDATE') {
            updateClientEvent(payload)
          }
          if (payload && payload.eventType === 'INSERT') {
            addClientEvent(payload)
          }
          if (payload && payload.eventType === 'DELETE') {
            deleteClientEvent(payload)
          }
        }
      )
      .subscribe()
    return () => {
      channels.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    memoizedGetClientList(clientType, selectedStore?.id!)
  }, [memoizedGetClientList, clientType, selectedStore?.id!])

  /*  const filteredClientList = useMemo(() => {
    return clientList.filter(
      (client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery.toLowerCase())
    )
  }, [clientList, searchQuery]) */
  // Filtered client list based on search query and selected filter
  const filteredClientList = useMemo(() => {
    //console.log('selectedFilter', selectedFilter)
    return clientList.filter((client) => {
      // Filter by search query
      const matchesSearchQuery =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery.toLowerCase())

      // Filter by selected filter
      if (selectedFilter === 'all') {
        return matchesSearchQuery
      } else if (selectedFilter === 'give') {
        return matchesSearchQuery && client.net_balance > 0
      } else if (selectedFilter === 'get') {
        return matchesSearchQuery && client.net_balance < 0
      } else if (selectedFilter === 'settled') {
        return matchesSearchQuery && client.net_balance === 0
      }
      return false
    })
  }, [clientList, searchQuery, selectedFilter])

  const dynamicColumn =
    clientType === 'EMPLOYEE' ? 'Salary Amount' : 'NET Balance'
  const columns = ['Name', 'Phone', dynamicColumn]
  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex items-center space-x-4">
        <ListSearch clientType={clientType} setSearchQuery={setSearchQuery} />
        <ListFilter onFilterChange={handleFilterChange} />
      </div>
      <div className="bg-gray-100 rounded-md max-h-[690px] w-full p-0 dark:bg-black dark:text-white relative">
        <CardHeader columns={columns} />
        {filteredClientList.length === 0 && (
          <div className="flex w-full h-[600px] items-center justify-center absolute">
            <p className="text-center text-gray-500 mt-4 text-2xl">
              No Data Available
            </p>
          </div>
        )}
        <ScrollArea className="h-[450px] w-full">
          {filteredClientList.map((item: IClientType) => (
            <CardRow key={item.id} client={item} clientType={clientType} />
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

export default UserListComponent

const CardRow = ({
  client,
  clientType,
}: {
  client: IClientType
  clientType: 'SUPPLIER' | 'CUSTOMER' | 'EMPLOYEE'
}) => {
  const setSelectedClient = useSetRecoilState(selectedClientState)
  const selectedClient = useRecoilValue(selectedClientState)
  const [showSalary, setShowSalary] = useState(false)
  return (
    <div
      className={cn(
        'flex items-start justify-between px-5 py-3 w-full cursor-pointer text-sm',
        selectedClient?.id === client.id
          ? 'bg-purple-200 dark:bg-neutral-500'
          : 'odd:bg-gray-50 odd:dark:bg-zinc-900 dark:text-white'
      )}
      onClick={(e) => setSelectedClient(client)}
    >
      <p className="w-full text-start flex flex-col">
        <span>{client.name}</span>{' '}
        <span
          className={cn(
            'text-xs font-normal ml-1',
            selectedClient?.id === client.id ? 'text-gray-800' : 'text-gray-400'
          )}
        >
          <TimeAgo date={client.updated_at} />
        </span>
      </p>
      <p className="w-full text-start">{client.phone}</p>
      {clientType === 'EMPLOYEE' ? (
        <p className={cn('w-full text-end flex justify-end')}>
          <span className="mr-1">₹ </span>
          {showSalary ? <span>{client.salary || 0}</span> : <span>*****</span>}
          <span
            className="cursor-pointer"
            onClick={() => setShowSalary(!showSalary)}
          >
            {showSalary ? (
              <EyeOpenIcon className="w-8" />
            ) : (
              <EyeNoneIcon className="w-8" />
            )}
          </span>
        </p>
      ) : (
        <p className={cn('w-full text-end flex flex-col')}>
          <span
            className={cn(
              client.net_balance < 0 && 'text-red-600',
              client.net_balance > 0 && 'text-green-600'
            )}
          >
            ₹ {client.net_balance || '0.0'}
          </span>
          {(client.net_balance > 0 || client.net_balance < 0) && (
            <span className="capitalize text-xs">
              {client.net_balance > 0 ? "You'll Give" : "You'll get"}
            </span>
          )}
        </p>
      )}
    </div>
  )
}
const CardHeader = ({ columns }: { columns: any }) => {
  return (
    <div className="flex items-center justify-between px-5 py-2 bg-gray-200 light:text-black rounded-t-md dark:bg-black">
      {columns.map((item: any, index: any) => (
        <CardHeaderItem
          key={index}
          className={index === columns.length - 1 && 'text-end'}
        >
          {item}
        </CardHeaderItem>
      ))}
    </div>
  )
}
const CardHeaderItem = ({ className, children }: any) => {
  const defaultClass = 'w-full text-start font-bold'
  return <p className={cn(defaultClass, className)}>{children}</p>
}
const ListFilter = ({ onFilterChange }: any) => {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const handleFilterChange = (value: any) => {
    setSelectedFilter(value)
    onFilterChange(value)
  }

  useMemo(() => {
    console.log(selectedFilter)
  }, [selectedFilter])
  return (
    <div className="w-40">
      <Label>Filter By</Label>
      <Select onValueChange={handleFilterChange} defaultValue={selectedFilter}>
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
  )
}
const ListSearch = ({ clientType, setSearchQuery }: any) => {
  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value)
  }
  return (
    <div className="w-full">
      <Label>
        Search for{' '}
        {clientType === 'CUSTOMER'
          ? 'Customer'
          : clientType === 'SUPPLIER'
            ? 'Supplier'
            : 'Employee'}
      </Label>
      <div className="relative">
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="search by name or phone number"
          className="pl-8"
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}
