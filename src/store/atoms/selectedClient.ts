"use client";

import { IClientType } from "@/types/client";
import { atom } from "recoil";

export const selectedClientState = atom<IClientType | null>({
  key: "selectedClientState",
  default: null,
});
