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
import { useTranslations, useLocale } from "next-intl";

const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const withLocale = (path: string) => `/${locale}${path}`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient(
          `${Endpoints.category}/names?lang=${locale}`
        );

        setCategories(res.data?.data?.categoryNames || []);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [locale]);

  return (
    <div className="bg-thirdary text-secondary-text py-10 px-5">

      <div className="flex flex-col items-center text-center text-xl md:flex-row md:justify-around md:items-start md:text-left gap-10 md:gap-0">

        <div className="flex flex-col py-2">
          <h5 className="font-semibold mb-3">{t("footer.categories")}</h5>

          {categories.map((item) => (
            <Link
              key={item._id}
              href={`${withLocale("/customer/products")}?category=${item._id}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Gender */}
        <div className="flex flex-col py-2">
          <h5 className="font-semibold mb-3">{t("products.adminProducts.gender")}</h5>

          <Link href={`${withLocale("/customer/products")}?gender=girls`}>
            {t("common.girls")}
          </Link>
          <Link href={`${withLocale("/customer/products")}?gender=boys`}>
            {t("common.boys")}
          </Link>
        </div>

        {/* Help */}
        <div className="flex flex-col">
          <h5 className="font-semibold mb-3">{t("footer.help")}</h5>

          <Link href="">{t("footer.shipping")}</Link>
          <Link href={`${withLocale("/customer/aboutus")}`}>{t("footer.faq")}</Link>
          {/* <Link href={""}>{t("footer.returns")}</Link> */}
        </div>

        {/* Social */}
        <div className="flex flex-col">
          <h5 className="font-semibold mb-3">{t("footer.follow")}</h5>

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
          <Image
            src="/Lilucky.svg"
            alt="logo"
            width={150}
            height={150}
          />
        </div>

      </div>
    </div>
  );
};

export default Footer;