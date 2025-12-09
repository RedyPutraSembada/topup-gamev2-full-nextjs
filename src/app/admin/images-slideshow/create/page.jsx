import BackMenu from "@/components/global/back-menu";
import { FormCreateImagesSlideShow } from "@/features/admin/images-slideshow/create/form-create-images-slideshow";

export default function page() {
  return (
    <div className="container mx-auto p-10">
      <BackMenu href={"/admin/images-slideshow"} />
      <FormCreateImagesSlideShow />
    </div>
  );
}
