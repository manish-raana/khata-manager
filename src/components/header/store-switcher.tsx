'use client'
import * as React from 'react'
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import AddStore from '../AddStore'
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { useEffect, useState } from 'react'
import { selectedStoresState, storesListState } from '@/store/atoms/stores'
import { useRecoilState, useSetRecoilState } from 'recoil'

type IStore = {
  id: number
  name: string
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {}

export default function StoreSwitcher({
  storeData,
}: {
  storeData: IStore[] | []
}) {
  const [open, setOpen] = useState(false)
  const [showNewStoreDialog, setShowNewStoreDialog] = useState(false)
  const [selectedStore, setSelectedStore] = useRecoilState(selectedStoresState)
  const [storeList, setStoreList] = useRecoilState(storesListState)

  useEffect(() => {
    setStoreList(storeData)
    if (storeData.length > 0) {
      setSelectedStore(storeData[0])
    }
  }, [storeData])
  return (
    <Dialog open={showNewStoreDialog} onOpenChange={setShowNewStoreDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a store"
            className={cn('w-[200px] justify-between')}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedStore?.id}.png`}
                alt={selectedStore?.name}
                className="grayscale"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedStore?.name}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search store..." />
              <CommandEmpty>No store found.</CommandEmpty>

              {storeList?.map((store: IStore) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => {
                    setSelectedStore(store)
                    setOpen(false)
                  }}
                  className="text-sm cursor-pointer"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${store.id}.png`}
                      alt={store.name}
                      className="grayscale"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {store.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedStore?.id === store.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    className="cursor-pointer"
                    onSelect={() => {
                      setOpen(false)
                      setShowNewStoreDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create new Store
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogDescription>
            Add a new store to manage suppliers and customers.
          </DialogDescription>
        </DialogHeader>
        <AddStore setShowNewStoreDialog={setShowNewStoreDialog} />
        {/* <DialogFooter>
          
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
