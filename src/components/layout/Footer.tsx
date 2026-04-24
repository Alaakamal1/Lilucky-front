import Image from "next/image";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
const Footer = () => {
  return (
    <div className="bg-thirdary text-secondary-text py-10 px-5">
      <div className="flex flex-col items-center text-center text-xl md:flex-row md:justify-around md:items-start md:text-left gap-10 md:gap-0">
                <div className="flex flex-col py-2 ">
          <h5 className="font-semibold mb-3">ملابس</h5>
          <Link href="">تيشرتات</Link>
          <Link href="">بنطلونات</Link>
          <Link href="">فساتين</Link>
          <Link href="">هوديز</Link>
          <Link href="">سوت</Link>
          <Link href="">سالوبيتات</Link>
          <Link href="">جواكت</Link>
          <Link href="">بيجامات</Link>
        </div>

        {/* Category Section */}
        <div className="flex flex-col">
          <h5 className="font-semibold mb-3">التصنيف</h5>
          <Link href="">ولاد</Link>
          <Link href="">بنات</Link>
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
            <Link href="">
              <FacebookIcon fontSize="large" />
            </Link>
            <Link href="">
              <InstagramIcon fontSize="large" />
            </Link>
            <Link href="">
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
