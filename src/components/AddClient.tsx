import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function AddNewClient() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="space-x-2">
          <Plus className="w-6 h-6" />
          <span> Add New Customer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>Enter the below details to add a new client</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="name" className="text-start w-1/4">
              Name
            </Label>
            <Input id="name" placeholder="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="phone" className="text-start w-1/4">
              Phone
            </Label>
            <Input id="phone" placeholder="9999-9999-99" className="col-span-3" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="address" className="text-start w-1/4">
              Address
            </Label>
            <Input id="address" placeholder="jahangirpur" className="col-span-3" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="city" className="text-start w-1/4">
              City
            </Label>
            <Input id="city" placeholder="jahangirpur" className="col-span-3" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="state" className="text-start w-1/4">
              State
            </Label>
            <Input id="state" placeholder="jahangirpur" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Client</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
