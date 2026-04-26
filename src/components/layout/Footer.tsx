"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { apiClient } from "@/src/utils/apiClient";
import { Endpoints } from "@/src/utils/endpoints";
import { Category } from "@/src/interfaces/Category";

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient(`${Endpoints.category}/names?lang=ar`);
        const data = res.data;
        console.log("Fetched categories:", data.data.categoryNames);
        setCategories(data.data.categoryNames || []);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const boys = categories.filter((item) => item.categoryType === "boys");
  const girls = categories.filter((item) => item.categoryType === "girls");

  return (
    <div className="bg-thirdary text-secondary-text py-10 px-5">
      <div className="flex flex-col items-center text-center text-xl md:flex-row md:justify-around md:items-start md:text-left gap-10 md:gap-0">

        {/* Boys Categories */}
        <div className="flex flex-col py-2">
          <h5 className="font-semibold mb-3">التصنيفات</h5>
          {categories.map((item) => (
            <Link key={item._id} href={`/category/${item._id}`}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Girls Categories */}
        <div className="flex flex-col py-2">
          <h5 className="font-semibold mb-3">النوع</h5>
          <Link href="/category/girls">بنات</Link>
          <Link href="/category/boys">أولاد</Link>
        </div>

        {/* Help Section */}
        <div className="flex flex-col">
          <h5 className="font-semibold mb-3">قسم المساعده</h5>
          <Link href="">الشحن</Link>
          <Link href="">اسئله عنا</Link>
          <Link href="">سياسه الابدال و الارجاع</Link>
        </div>

        {/* Social Media */}
        <div className="flex flex-col">
          <h5 className="font-semibold mb-3">تابعنا</h5>
          <div className="flex gap-4 mt-2 justify-center">
            <Link href="https://www.facebook.com/">
              <FacebookIcon fontSize="large" />
            </Link>
            <Link href="https://www.instagram.com/">
              <InstagramIcon fontSize="large" />
            </Link>
            <Link href="https://wa.me/201228987676">
              <WhatsAppIcon fontSize="large" />
            </Link>
          </div>
        </div>

        {/* Logo */}
        <div className="mt-5 md:mt-0">
          <Image src="/Lilucky.svg" alt="logo" width={150} height={150} />
        </div>

      </div>
    </div>
  );
};

export default Footer;