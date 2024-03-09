"use client";

import { atom } from "recoil";

export const txnsListState = atom<any[]>({
  key: "txnsListState",
  default: [],
});
