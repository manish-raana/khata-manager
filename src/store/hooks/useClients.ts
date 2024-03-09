"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { clientListState, selectedClientState } from "../atoms/clients";

const useStoreList = () => {
  const [clientList, setClientList] = useRecoilState(clientListState);
  const [selectedClient, setSelectedClient] = useRecoilState(selectedClientState);
  const supabase = createClient();

  const getClientList = async () => {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) {
      console.error("Error fetching stores: ", error);
      return;
    }
    console.log(data);
    if (data && data.length > 0) {
      setClientList(data);
      console.log(data);
    }
  };
  useEffect(() => {
    getClientList();
  }, [supabase]);

  return { setSelectedClient, selectedClient, clientList, getClientList };
};

export default useStoreList;
