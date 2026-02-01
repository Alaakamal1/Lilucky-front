'use client';
import { Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ProductTable from '@/src/components/ui/BasicTable';
const page = () => {

  const columns = [
    { id: 'orderId', label: 'رقم الطلب' },
    { id: 'customerName', label: 'اسم العميل'},
    { id: 'totalPrice', label: 'اجمالي السعر' },
    { id: 'orderDate', label: 'تاريخ العمليه' },
    { id: 'paymentMethod', label: 'طريقه الدفع' },
    { id: 'orderStatus', label: 'حاله الطلب' },
    { id: 'actions', label: 'تفاصيل \\ تعديل \\ حذف', isAction: true },
  ];

  const rows = [
    {
      orderId: '1001',
      customerName: 'محمد علي',
      totalPrice: 500,
      orderDate: '2024-06-15',
      paymentMethod: 'بطاقه ائتمانيه',
      orderStatus: 'قيد المعالجه',
    },
  ];



  return (
    <>
      <div className='w-full '>
        <div>
          {/*Filter */}
        </div>
        <div className='flex justify-between m-10 items-center'>
          <Typography variant="h5" className="mb-4 text-center text-secondary-text">
           الطلبات المتوفره
          </Typography>
       
        </div>
        <div className='w-4xl mx-auto  mb-15'>
          <ProductTable
            columns={columns}
            rows={rows}
            onEdit={(row) => console.log('Edit', row)}
            onDelete={(row) => console.log('Delete', row)}
          />
        </div>
               <div className='w-4xl mx-auto  mb-20'>
          <ProductTable
            columns={columns}
            rows={rows}
            onEdit={(row) => console.log('Edit', row)}
            onDelete={(row) => console.log('Delete', row)}
          />
        </div>
      </div>
    </>
  )
}

export default page