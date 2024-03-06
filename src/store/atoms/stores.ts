"use client";

import { IStore } from "@/types/store";
import { atom } from "recoil";

export const storesListState = atom<IStore[]>({
  key: "storesList",
  default: [],
});

export const selectedStoresState = atom<IStore | null>({
  key: "selectedStoresState",
  default: null,
});
