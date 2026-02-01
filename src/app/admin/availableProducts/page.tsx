'use client';
import { Typography } from '@mui/material';
import MainButton from '@/src/components/ui/MainButton';
import Link from 'next/link';
import ProductTable from '@/src/components/ui/BasicTable';
import Filter from '@/src/components/ui/Filter';
import { useState } from 'react';
const page = () => {

  const [selectedAgeRange, setSelectedAgeRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const[selectedType,setSelectedType]=useState("all");
  const[selectedStatus,setSelectedStatus]=useState("all");

  const columns = [
    { id: 'name', label: 'اسم المنتج' },
    { id: 'image', label: 'صوره المنتج', isImage: true },
    { id: 'price', label: 'السعر' },
    { id: 'quantity', label: 'الكميه' },
    { id: 'status', label: 'الحاله' },
    { id: 'actions', label: 'تفاصيل \\ تعديل \\ حذف', isAction: true },
  ];

  const rows = [
    {
      name: 'منتج 1',
      image: '/path/to/image1.jpg',
      price: 250,
      quantity: 10,
      status: 'متوفر',
    },
    {
      name: 'منتج 2',
      image: '/path/to/image2.jpg',
      price: 300,
      quantity: 5,
      status: 'غير متوفر',
    },
  ];


  const ageRange = [
    { label: "الكل", value: "all" },
    { label: "Fruits", value: "fruits" },
    { label: "Vegetables", value: "vegetables" },
  ];

  
  const categories = [
    { label: "الكل", value: "all" },
    { label: "Fruits", value: "fruits" },
    { label: "Vegetables", value: "vegetables" },
  ];

  
  const types = [
    { label: "الكل", value: "all" },
    { label: "ذكر", value: "fruits" },
    { label: "أنثى", value: "vegetables" },
  ];

  
  const statuses = [
    { label: "الكل", value: "all" },
    { label: "متوفر", value: "available" },
    { label: "غير متوفر", value: "unavailable" },
  ];

  const handleFilterAgeRange = (value) => {
    setSelectedAgeRange(value);
  };

  
  const handleFilterCateigoryType = (value) => {
    setSelectedCategory(value);
  };

  
  const handleFilterChange = (value) => {
    setSelectedCategory(value);
  };

  
  const handleFilterType = (value) => {
    setSelectedType(value);
    console.log("Selected type:", value);
  };

  const handleFilterStatus = (value) => {
    setSelectedStatus(value);
  };

  return (
    <>
      <div className='w-full'>
       
      <div className='flex gap-4 justify-evenly bg-thirdary my-4 p-2'>
      <Filter
        label="الفئه العمرييه"
        options={ageRange}
        selected={selectedAgeRange}
        onChange={handleFilterAgeRange}
      />
      <Filter
        label="نوع المنتج"
        options={categories}
        selected={selectedCategory}
        onChange={handleFilterCateigoryType}
      />
        <Filter
        label="النوع"
        options={types}
        selected={selectedType}
        onChange={handleFilterType}
      />
        <Filter
        label="الحاله"
        options={statuses}
        selected={selectedStatus}
        onChange={handleFilterStatus}
      />
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