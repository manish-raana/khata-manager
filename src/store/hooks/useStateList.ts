"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { stateListState } from "../atoms/stateList";

const useStateList = () => {
  const [stateList, setStateList] = useRecoilState(stateListState);
  const supabase = createClient();

  const getStateList = async () => {
    if (stateList.length > 0) stateList;
    const { data, error } = await supabase.from("states").select("*");
    if (error) {
      console.error("Error fetching stores: ", error);
      return;
    }
    setStateList(data);
  };
  useEffect(() => {
    getStateList();
  }, [supabase]);

  return { stateList };
};

export default useStateList;
