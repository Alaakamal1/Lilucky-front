import MainButton from "@/src/components/ui/MainButton";
import { Typography } from "@mui/material";
import Link from "next/link";
const page = () => {
  return (
    <>
      <div className=" min-h-lvh">
        <div className="mx-25">
          <Typography variant="h4" gutterBottom>
            سلة المشتريات
          </Typography>
        </div>
        <div className="flex justify-evenly max-md:flex-col max-md:items-center ">
          <div className="min-w-xl max-w-xl  ">
        {/* Table */}

          </div>
          <div className="flex flex-col max-md:w-xl max-md:my-10 items-center py-2 border border-neutral-500 rounded-md">
           <div className="max-md:flex max-md:justify-evenly max-md:w-90">
            <Typography variant="h5" gutterBottom>
              السعر الكلي
            </Typography>
            <Typography variant="h5" gutterBottom>
              500 EGY{" "}
            </Typography>
            </div>
            <Link href="#">
            <MainButton
              text="شراء"
              className="bg-secondary hover:bg-secondary-hover duration-400 ease-in  w-40  py-3  m-8 max-md:m-4 text-xl text-primary-text cursor-pointer "
            />
            </Link>
          </div>
        </div>
        <div className="text-center my-10 text-primary ">
          <Typography variant="h4" gutterBottom>
        منتجات ممكن تعجبك
          </Typography>
          <div>
{/*cards */}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
