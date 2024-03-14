'use client'
import { selectedClientState } from '@/store/atoms/clients'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Card } from './ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import useTxnsList from '@/store/hooks/useTxns'
import { AddNewTransaction } from './AddTransaction'
import { EditClient } from './EditClient'
import { formatDate } from '@/utils/formatDate'
import { EditTransaction } from './EditTxn'

const TransactionsList = () => {
  const selectedClient = useRecoilValue(selectedClientState)
  const [totalNet, setTotalNet] = React.useState(0)
  const [totalGave, setTotalGave] = React.useState(0)
  const [totalGot, setTotalGot] = React.useState(0)

  const columns = ['Date', 'Description', 'You Gave', 'You Got']
  const { txnsList, getTxnsList } = useTxnsList()

  useEffect(() => {
    setTotalNet(0)
    setTotalGave(0)
    setTotalGot(0)

    if (txnsList && txnsList.length > 0) {
      let totalGave = 0
      let totalGot = 0

      // Loop through the transaction data
      txnsList.forEach((transaction: any) => {
        if (transaction.txn_type === 'GAVE') {
          // If transaction type is "GAVE", add the amount to totalGave
          totalGave += transaction.amount
        } else if (transaction.txn_type === 'GOT') {
          // If transaction type is "GOT", add the amount to totalGot
          totalGot += transaction.amount
        }
      })
      setTotalGave(totalGave)
      setTotalGot(totalGot)
      const totalNet = totalGot - totalGave
      setTotalNet(totalNet)
    }
  }, [txnsList])

  const [selectedTxn, setSelectedTxn] = useState(null)
  const [editTxn, setEditTxn] = useState(false)

  const handleClick = (item: any) => {
    console.log('clicked', item)
    setSelectedTxn(item)
    setEditTxn(true)
  }

  const handleEditReset = () => {
    setEditTxn(false)
    setSelectedTxn(null)
  }

  if (selectedClient === null) {
    return (
      <div className="flex items-center justify-center w-full h-[800px]">
        <p className="text-center text-gray-500 mt-4 text-2xl">
          No Client Selected
        </p>
      </div>
    )
  }

  return (
    <>
      {editTxn && (
        <EditTransaction
          selectedTxn={selectedTxn}
          handleEditReset={handleEditReset}
        />
      )}

      <div className="flex flex-col space-y-4 w-full">
        <div className="bg-gray-100 rounded-lg p-2 md:flex items-start justify-between dark:bg-black dark:text-white">
          <div>
            <p>
              <b>Name:</b> {selectedClient?.name}
            </p>
            <p>
              <b>Phone:</b> {selectedClient?.phone}
            </p>
          </div>
          <p className="w-1/2">
            <b>Address:</b> {selectedClient?.address}
          </p>
          <EditClient />
        </div>
        <div className="bg-gray-100 rounded-lg md:flex items-center justify-between p-2 dark:bg-black dark:text-white">
          <div>
            <p>Net Balance</p>
            <p
              className={cn(
                totalNet === 0
                  ? 'light:text-black dark:text-white'
                  : totalGave > totalGot
                    ? 'text-red-500'
                    : 'text-green-500'
              )}
            >
              ₹ {totalNet}
            </p>
          </div>
          <div className="text-red-500">
            <p>You Gave</p>
            <p>₹ {totalGave}</p>
          </div>
          <div className="text-green-500">
            <p>You Got</p>
            <p>₹ {totalGot}</p>
          </div>
          <a
            className={cn(
              (totalGave === totalGot || totalGot > totalGave) &&
                'pointer-events-none'
            )}
            href={`//api.whatsapp.com/send?phone=${selectedClient.phone}&text=Hi ${selectedClient.name},%0A%0APayment of amount ₹${totalGave - totalGot} is pending for last settelement.%0A%0APlease make the payment as soon as possible.%0A%0AThanks,%0A${selectedClient.name}`}
            target="_blank"
          >
            {' '}
            <Button
              variant={'outline'}
              className={cn(
                (totalGave === totalGot || totalGot > totalGave) &&
                  'light:bg-zinc-100 dark:bg-zinc-900 pointer-events-none'
              )}
            >
              {' '}
              <img
                src="/whatsapp.png"
                className="w-6 bg-blend-screen mr-2"
                alt=""
              />
              Send Reminders
            </Button>
          </a>
        </div>

        <Card className="bg-gray-100 rounded-md min-h-[500px] w-full p-0 dark:bg-black dark:text-white relative dark:border-black">
          <CardHeader columns={columns} />

          {txnsList.length === 0 && (
            <div className="flex items-center justify-center h-96 absolute top-50 w-full">
              <p className="text-center text-gray-500 mt-4 text-2xl">
                No Data Available
              </p>
            </div>
          )}

          <ScrollArea className="h-[600px] w-full overflow-y-scroll">
            {txnsList.map((item: any) => (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                className="flex items-center justify-between px-5 py-3 w-full even:bg-zinc-200 dark:even:bg-zinc-800 cursor-pointer text-sm"
              >
                <p className="w-full text-start">{formatDate(item.date)}</p>
                <p className="w-full text-center ">{item.description}</p>
                <p className="w-full text-center text-red-500 pl-10">
                  {item.txn_type === 'GAVE' ? item.amount : '-'}
                </p>
                <p className="w-full text-end text-green-500">
                  {item.txn_type === 'GOT' ? item.amount : '-'}
                </p>
              </div>
            ))}
          </ScrollArea>
        </Card>
        <div className="flex flex-col justify-start md:flex-row md:justify-center w-full md:space-x-12">
          <AddNewTransaction txnType="GAVE" getTxnsList={getTxnsList} />
          <AddNewTransaction txnType="GOT" getTxnsList={getTxnsList} />
        </div>
      </div>
    </>
  )
}

export default TransactionsList

const TxnRow = ({ item }: any) => {
  return (
    <>
      <div className="flex items-center justify-between px-5 py-3 w-full even:bg-zinc-200 dark:even:bg-zinc-800 cursor-pointer text-sm">
        <p className="w-full text-start">{formatDate(item.date)}</p>
        <p className="w-full text-start">{item.description}</p>
        <p className="w-full text-center text-red-500 pl-10">
          {item.txn_type === 'GAVE' ? item.amount : '-'}
        </p>
        <p className="w-full text-end text-green-500">
          {item.txn_type === 'GOT' ? item.amount : '-'}
        </p>
      </div>
    </>
  )
}
const CardHeader = ({ columns }: { columns: any }) => {
  return (
    <div className="flex items-center justify-between px-5 py-2 bg-gray-200 dark:bg-black dark:text-white rounded-t-md">
      {columns.map((item: any, index: any) => (
        <CardHeaderItem key={index} className="first:text-start last:text-end">
          {item}
        </CardHeaderItem>
      ))}
    </div>
  )
}
const CardHeaderItem = ({ className, children }: any) => {
  const defaultClass = 'w-full text-center font-bold'
  return <p className={cn(defaultClass, className)}>{children}</p>
}
