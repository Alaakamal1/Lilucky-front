"use client";
import { Typography } from "@mui/material";
import MainButton from "../../components/ui/MainButton";
// import CardItem from "../../components/ui/CardItem";
import OptionSelector from "../../components/ui/OptionSelector";
import { useState } from "react";
import Link from "next/link";
export default function page() {
  const [size, setSize] = useState<string>("");

  return (
    <>
      <div>
        <div
          className="h-screen bg-cover bg-center  flex items-center justify-center"
          style={{
            backgroundImage: "url('/HomeImage.svg')",
          }}
        >
          <div className="flex flex-col min-w-10/12  ">
            <Typography variant="h4" component="h3">
              اختار الأجمل لطفلك..
            </Typography>
            <Typography variant="h4" component="h3">
              لأن كل يوم يستاهل لوك جديد
            </Typography>
            <Link href="/customer/products">
            <MainButton
              text="تسوق الان"
              className="cursor-pointer bg-background hover:bg-background-hover duration-300 ease-in-out rounded-md w-44 py-6  m-10 text-3xl text-secondary-text hover:text-secondary-text-hover"
            />
            </Link>
          </div>
        </div>

        <div className=""></div>
      </div>
      <div className=" my-4">
        <Typography
          variant="h4"
          component="h4"
          className="text-primary-text text-center"
        >
          الأكتر مبيعا
        </Typography>
        {/* <div className="flex w-full justify-center items-center gap-6 flex-col md:flex-row my-16">
          <CardItem />
          <CardItem />
          <CardItem />
        </div> */}
      </div>
      <div>
        <div
          className="min-h-120 bg-cover bg-center flex  justify-center flex-col "
          style={{
            backgroundImage: "url('/HomeImag2.jpg')",
          }}
        >
          <div className="flex flex-col mx-8">
            <Typography variant="h2" component="h2" className="">
              اطقم اطفال تبدا من
            </Typography>
            <Typography variant="h2" component="h2" className="text-red-500">
              200 EGY
            </Typography>
          </div>
         <Link href="/customer/products">
            <MainButton
              text="تسوق الان"
              className="cursor-pointer bg-background hover:bg-background-hover duration-300 ease-in-out rounded-md w-44 py-6  m-10 text-3xl text-secondary-text hover:text-secondary-text-hover"
            />
            </Link>
        </div>
      </div>
      <div className="my-6">
        <Typography
          variant="h4"
          component="h4"
          className="text-primary-text text-center"
        >
          اختار حسب الفئه العمريه
        </Typography>
        <OptionSelector
          label=""
          options={["1  سنه" ,"2 سنه", "3 سنوات", "4 سنوات", "5 سنوات", "6 سنوات", "7 سنوات", "8 سنوات"]}
          selected={size}
          onSelect={setSize}
          className={
            "p-6 border bg-primary-text hover:bg-primary-text-hover text-white  rounded-md cursor-pointer duration-300 easy-in"
          }
        />
      </div>
      <div
        className="min-h-120 bg-cover bg-center flex  justify-center items-end flex-col px-12"
        style={{
          backgroundImage: "url('/HomeImage3.jpg')",
        }}
      >
        <div className="flex flex-col text-white">
          <Typography variant="h4" component="h2" className="">
            ملابس شتويه
          </Typography>
          <Typography variant="h4" component="h2" className="">
            خصومات لحد 70%
          </Typography>
        </div>
        <Link href="/customer/products">
        <MainButton
          text="تسوق الان"
          className="bg-background w-32 h-10 text-xl  md:w-44 md:h-20 rounded-md m-10 md:text-3xl text-primary-text cursor-pointer"
        />
        </Link>
      </div>
 
    </>
  );
}
