export type ITxnType = 'give' | 'get' | 'settled'
export type IClientType = {
  id: number
  name: string
  phone: string
  net_balance: number
  date: string
  txnType?: ITxnType
  address: string
  updated_at: string
  store_id: number
  client_type: 'CUSTOMER' | 'SUPPLIER' | 'EMPLOYEE'
}
