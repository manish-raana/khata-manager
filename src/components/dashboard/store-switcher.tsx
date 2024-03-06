"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type IStore = {
  label: string;
  id: number;
};

type ILocation = {
  label: string;
  stores: IStore[];
}
const locations = [
  {
    label: "Noida",
    stores: [
      {
        label: "Store 1",
        id: 1,
      },
    ],
  },
  {
    label: "Delhi",
    stores: [
      {
        label: "Store 2",
        id: 2,
      },
      {
        label: "Store 3",
        id: 3,
      },
    ],
  },
];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {}

export default function StoreSwitcher({ className }: StoreSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewStoreDialog, setShowNewStoreDialog] = React.useState(false);
  const [selectedStore, setSelectedStore] = React.useState<IStore>(locations[0].stores[0]);

  return (
    <Dialog open={showNewStoreDialog} onOpenChange={setShowNewStoreDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a store"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage src={`https://avatar.vercel.sh/${selectedStore.id}.png`} alt={selectedStore.label} className="grayscale" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedStore.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search store..." />
              <CommandEmpty>No store found.</CommandEmpty>
              {locations.map((location: ILocation) => (
                <CommandGroup key={location.label} heading={location.label}>
                  {location.stores.map((store: IStore) => (
                    <CommandItem
                      key={store.id}
                      onSelect={() => {
                        setSelectedStore(store);
                        setOpen(false);
                      }}
                      className="text-sm cursor-pointer"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage src={`https://avatar.vercel.sh/${store.id}.png`} alt={store.label} className="grayscale" />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {store.label}
                      <CheckIcon className={cn("ml-auto h-4 w-4", selectedStore.id === store.id ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    className="cursor-pointer"
                    onSelect={() => {
                      setOpen(false);
                      setShowNewStoreDialog(true);
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
          <DialogDescription>Add a new store to manage suppliers and customers.</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter store name ..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">City</Label>
              <Input id="city" placeholder="Enter store city ..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">State</Label>
              <Input id="state" placeholder="Enter store state ..." />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewStoreDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
