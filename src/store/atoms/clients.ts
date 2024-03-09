'use client'

import { IClientType } from '@/types/client'
import { atom, selector } from 'recoil'

export const clientListState = atom<IClientType[]>({
  key: 'clientListState',
  default: [],
})
export const selectedClientState = atom<IClientType | null>({
  key: 'selectedClientState',
  default: null,
})

export const customerSelector = selector({
  key: 'customerSelector',
  get: ({ get }) => {
    const clients = get(clientListState)
    return clients.filter((client) => client.client_type === 'CUSTOMER')
  },
})
export const supplierSelector = selector({
  key: 'supplierSelector',
  get: ({ get }) => {
    const clients = get(clientListState)
    return clients.filter((client) => client.client_type === 'SUPPLIER')
  },
})
