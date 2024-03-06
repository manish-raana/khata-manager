'use client';
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedStoresState, storesListState } from "../atoms/stores";

const useStoreList = () => {
    const [storeList, setStoreList] = useRecoilState(storesListState);
    const [selectedStore, setSelectedStore] = useRecoilState(selectedStoresState);
    const supabase = createClient();

    const getStoreList = async () => {
        const { data, error } = await supabase.from("store").select("*");
        if (error) {
            console.error("Error fetching stores: ", error);
            return;
        }
        console.log(data);
        if (data && data.length > 0) {
            setStoreList(data)
            setSelectedStore(data[0]);
            console.log(data);
        }
    }
    useEffect(() => { getStoreList(); }, [supabase]);

    return { selectedStore,setSelectedStore, storeList, getStoreList };
}

export default useStoreList;