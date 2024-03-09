"use client";

import { IClientType } from "@/types/client";
import { atom } from "recoil";

export const clientListState = atom<IClientType[]>({
  key: "clientListState",
  default: [],
});
export const selectedClientState = atom<IClientType | null>({
  key: "selectedClientState",
  default: null,
});
