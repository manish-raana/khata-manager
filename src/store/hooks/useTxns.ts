"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { txnsListState } from "../atoms/txns";
import { selectedClientState } from "../atoms/clients";

const useTxnsList = () => {
  const [txnsList, setTxnsList] = useRecoilState(txnsListState)
  const supabase = createClient();
  const selectedClient = useRecoilValue(selectedClientState);

  const getTxnsList = async () => {
    console.log('selectedClient', selectedClient)
    const { data, error } = await supabase.from("transactions").select("*").eq("id", `${selectedClient?.id!}`);
    if (error) {
      console.error("Error fetching txns: ", error);
      return;
    }
    console.log(data);
    if (data && data.length > 0) {
      setTxnsList(data);
      console.log(data);
    }
  };

  useEffect(() => {
    getTxnsList();
  }, [selectedClient, supabase]);

  return { txnsList, getTxnsList };
};

export default useTxnsList;
