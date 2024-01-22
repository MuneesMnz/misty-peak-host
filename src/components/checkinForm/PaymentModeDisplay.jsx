import React from 'react'

const PaymentModeDisplay = ({item}) => {
  return (
    <div className='flex-1 rounded-lg bg-white shadow-lg px-3 py-2 flex flex-col gap-2 items-center justify-center '>
      <div className='text-secondary  font-[500]'>{item?.paymentMode}</div>
      <div className='text-lg font-[600]'>
      &#8377; {item?.paidMoney} 
      </div>
    </div>
  )
}

export default PaymentModeDisplay
