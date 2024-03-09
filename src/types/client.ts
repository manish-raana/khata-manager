export type ITxnType = "give" | "get" | "settled";
export type IClientType = {
  id: number;
  name: string;
  phone: string;
  netBalance: number;
  date: string;
  txnType?: ITxnType;
  updated_at:string
};
