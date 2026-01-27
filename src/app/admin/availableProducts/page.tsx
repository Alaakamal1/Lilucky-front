import React from 'react'
import { Typography } from '@mui/material';
import MainButton from '@/src/components/ui/MainButton';
import Link from 'next/link';
const page = () => {
  return (
    <>
      <div className='w-full '>
        <div>
          {/*Filter */}
        </div>
        <div className='flex justify-between m-10 items-center'>
          <Typography variant="h5" className="mb-4 text-center text-secondary-text">
            المنتجات المتاحة
          </Typography>
          <Link href="/admin/availableProducts/addProduct">
          <MainButton
            text="اضافة منتج جديد"
            className="cursor-pointer bg-primary hover:bg-primary-hover text-background duration-300 ease-in-out rounded-md  p-3  "
          />
</Link>
        </div>
        <div>
          {/* Products List */}
        </div>
      </div>
    </>
  )
}

export default page