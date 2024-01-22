import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error404Page = () => {
  const navigate=useNavigate()
  return (
    <div className='w-full h-screen flex items-center justify-center '>

        <div className='flex flex-col items-center gap-8'>
            <div className='text-7xl font-semibold'> Oops!</div>
            <div className='text-lg font-[500]'>The page you're looking for does not exist.</div>
            <button className='px-6 py-2.5 bg-secondary text-white text-lg rounded-md' onClick={()=>navigate('/')}>Go to Home Page</button>
        </div>
      
    </div>
  )
}

export default Error404Page
