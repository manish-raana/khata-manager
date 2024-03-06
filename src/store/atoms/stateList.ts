"use client";

import { IState } from "@/types/state";
import { atom } from "recoil";

export const stateListState = atom<IState[]>({
  key: "stateListState",
  default: [],
});