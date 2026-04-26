"use client";

import { Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      
      {/* TITLE */}
      <Typography variant="h3" className="text-primary font-bold text-center">
        About Us
      </Typography>

      {/* INTRO */}
      <div className="text-center text-gray-600 leading-relaxed">
        <p>
          احنا منصة متخصصة في تقديم أفضل المنتجات بجودة عالية وأسعار مناسبة.
        </p>
        <p className="mt-2">
          هدفنا هو توفير تجربة تسوق سهلة وسريعة وآمنة لكل العملاء.
        </p>
      </div>

      {/* SECTION 1 */}
      <div>
        <Typography variant="h5" className="mb-2 font-semibold text-primary">
          رؤيتنا
        </Typography>
        <p className="text-gray-600 leading-relaxed">
          نسعى لنكون من أفضل منصات التجارة الإلكترونية في المنطقة من خلال
          تقديم خدمات متميزة وتجربة مستخدم رائعة.
        </p>
      </div>

      {/* SECTION 2 */}
      <div>
        <Typography variant="h5" className="mb-2 font-semibold text-primary">
          مهمتنا
        </Typography>
        <p className="text-gray-600 leading-relaxed">
          نوفر منتجات عالية الجودة مع دعم فني سريع وخدمة عملاء ممتازة لضمان
          رضا العملاء.
        </p>
      </div>

      {/* SECTION 3 */}
      <div>
        <Typography variant="h5" className="mb-2 font-semibold text-primary">
          ليه تختارنا؟
        </Typography>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>منتجات بجودة عالية</li>
          <li>أسعار تنافسية</li>
          <li>دعم فني سريع</li>
          <li>تجربة استخدام سهلة</li>
        </ul>
      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 pt-6 border-t">
        <p>© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
      </div>

    </div>
  );
}