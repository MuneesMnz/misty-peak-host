import React from 'react'

const FormErrorMessage = ({error}) => {
  return (
    <div className='text-red-500 text-sm mt-2' >
      {error}
    </div>
  )
}

export default FormErrorMessage
