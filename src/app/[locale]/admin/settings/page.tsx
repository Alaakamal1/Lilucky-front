import HomeImagesSettings from "./HomeImagesSettings/HomeImagesSettings";
import ShippingSettings from "./ShippingSettings/ShippingSettings";

export default function Page() {
  return (
    <div className="w-full">

      <HomeImagesSettings/>
      <ShippingSettings />
    </div>
  );
}