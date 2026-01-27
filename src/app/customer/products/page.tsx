"use client";

import CardItem from "@/src/components/ui/CardItem";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

interface Clothes {
  name?: string;
  category?: string;
}

const Page = ({ clothes = [] }: { clothes?: Clothes[] }) => {  // ✅ القيمة الافتراضية هنا
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const filteredClothes = selectedCategory
    ? clothes.filter((item) => item.category === selectedCategory)
    : clothes;

  return (
    <div>
      <Typography variant="h4" component="h4" className="text-secondary-text mb-4">
        {selectedCategory
          ? `منتجات ${selectedCategory}`
          : "أشيك لبس لأجمل عيال"}
      </Typography>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredClothes.length > 0 ? (
          filteredClothes.map((item, index) => (
            <CardItem key={index} item={item} />
          ))
        ) : (
          <Typography variant="h6" component="p">
            لا توجد منتجات في هذا القسم.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Page;
