'use client';
import { Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ProductTable from '@/src/components/ui/BasicTable';
const page = () => {

  const columns = [
    { id: 'orderId', label: 'رقم العميل' },
    { id: 'customerName', label: 'اسم العميل'},
    { id: 'totalPrice', label: 'الايميل' },
    { id: 'orderDate', label: 'رقم الهاتف' },
    { id: 'paymentMethod', label: 'اخر عمليه' },
    { id: 'orderStatus', label: 'العنوان ' },
    { id: 'actions', label: 'ملحوظات', isAction: true },
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
            العملاء
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
      </div>
    </>
  )
}

export default page