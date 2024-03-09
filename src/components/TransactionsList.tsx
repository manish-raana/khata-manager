'use client';
import { selectedClientState } from '@/store/atoms/selectedClient';
import React from 'react'
import { useRecoilValue } from 'recoil';

const TransactionsList = () => {
  const selectedClient = useRecoilValue(selectedClientState);
  return (
    <div>
      <h1>Client Details</h1>
      {selectedClient?.name}
      { selectedClient?.id}
      { selectedClient?.phone}
      { selectedClient?.txnType}
    </div>
  );
}

export default TransactionsList;