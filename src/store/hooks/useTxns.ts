"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { txnsListState } from "../atoms/txns";

const useTxnsList = () => {
  const [txnsList, setTxnsList] = useRecoilState(txnsListState)
  const supabase = createClient();

  const getTxnsList = async () => {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) {
      console.error("Error fetching stores: ", error);
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
  }, [supabase]);

  return { txnsList, getTxnsList };
};

export default useTxnsList;
