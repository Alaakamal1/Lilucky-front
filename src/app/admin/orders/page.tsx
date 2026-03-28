'use client';
import { Typography, CircularProgress } from '@mui/material';
import ProductTable from '@/src/components/ui/BasicTable';
import { useEffect, useState } from 'react';
const Page = () => {
  const [rows,setRows]=useState([]);
  const[loading,setLoading]=useState(true);

  const columns = [
    { id: 'orderId', label: 'رقم الطلب' },
    { id: 'customerName', label: 'اسم العميل'},
    { id: 'totalPrice', label: 'اجمالي السعر' },
    { id: 'orderDate', label: 'تاريخ العمليه' },
    { id: 'paymentMethod', label: 'طريقه الدفع' },
    { id: 'orderStatus', label: 'حاله الطلب' },
    { id: 'actions', label: 'تفاصيل \\ تعديل \\ حذف', isAction: true },
  ];

useEffect (() =>{
  const fetchData = async () =>{
    try{
      const res = await fetch('http://localhost:5000/api/orders');
      if(!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setRows (data);
    }catch(error){
      console.error('Error fetching orders:', error);
    }finally{
      setLoading(false);
  }
};
fetchData();
},[])


  return (
    <>
     <div className="w-full px-4 md:px-10 py-6">
           <div className="w-full overflow-x-auto">
             {loading ? (
               // 🌀 Loading State
               <div className="flex justify-center items-center h-64">
                 <CircularProgress />
               </div>
             ) : rows.length === 0 ? (
               // ⚠️ Empty State
               <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                 <Typography variant="body1" className="text-center">
                   لا يوجد طلبات بعد
                 </Typography>
                 <Typography variant="body2" className="text-center text-gray-400">
                   سيتم عرض الطلبات هنا بمجرد إضافتهم.
                 </Typography>
               </div>
             ) : (
               <div>
                 <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                   <Typography
                     variant="h5"
                     className="text-center md:text-left text-secondary-text mb-4 md:mb-0"
                   >
                      الطلبات
                   </Typography>
                 </div>
                 <div className="min-w-sm md:min-w-md lg:min-w-lg">
                   <ProductTable
                     columns={columns}
                     rows={rows}
                     onEdit={(row) => console.log('Edit', row)}
                     onDelete={(row) => console.log('Delete', row)}
                   />
                 </div>
               </div>
             )}
           </div>
         </div>
    </>
  )
}

export default Page;