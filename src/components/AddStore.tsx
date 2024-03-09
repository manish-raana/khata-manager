'use client'
import { Input } from './ui/input';
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from '@/utils/supabase/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AddStoreFormSchema, AddStoreFormType } from "@/lib/zod";
import { Icons } from './ui/icons';
import { useToast } from "@/components/ui/use-toast";
import useStateList from '@/store/hooks/useStateList';

type IState = {
  id: string;
  name: string;
};

const AddStore = ({ getStoreList, setShowNewStoreDialog }:any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const supabase = createClient();
    const { stateList } = useStateList();

    const form = useForm<AddStoreFormType>({
      resolver: zodResolver(AddStoreFormSchema),
      defaultValues: {
          name: "",
          address: "",
      },
    });
    const addAddress = async (addressData:{city:string, state:string}) => {
        const { data: addressResponse, error: addressError } = await supabase.from("address").insert([addressData]).select();
        if (addressError) {
          console.error("Error adding address: ", addressError);
          toast({
            variant: "default",
            title: "Error adding store",
            description: "An error occurred while adding store address",
          });
          return;
        }
        return addressResponse[0];
    };
    const addStore = async (storeData: { name: string, address: string }) => {
      const { data: storeResponse, error: storeError } = await supabase.from("store").insert([storeData]).select();
      if (storeError) {
        console.error("Error adding store: ", storeError);
        toast({
          variant: "default",
          title: "Error adding store",
          description: "An error occurred while adding store address",
        });
        return;
      }
      toast({
        variant: "success",
        title: "Success",
        description: "Your store has been added successfully!",
      });
      return storeResponse;
    };
    async function onSubmit(values: AddStoreFormType) {
      console.log(values);
      setLoading(true);
      const { data: stores } = await supabase.from("store").select("*").ilike("name", `%${values.name}%`);
      if (stores && stores.length > 0) { 
        toast({
          variant: "destructive",
          title: "Error: Duplicate store name",
          description: "Store with this name already exists!",
        });
        setLoading(false);
        return;
      }
        const storeResponse = await addStore(values);
        console.log("storeResponse", storeResponse);
        getStoreList();
        setShowNewStoreDialog(false);
      
      setLoading(false);
    }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 pb-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter store name..." {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter store address..." {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        
        <div className="flex items-center space-x-4">
          <Button type='button' variant="outline" onClick={() => setShowNewStoreDialog(false)}>
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddStore