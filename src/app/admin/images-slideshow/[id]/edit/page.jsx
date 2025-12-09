import { checkExistdataWebsite } from "@/actions/admin/data-website/data-website";
import { checkExistDataImageSlideShow } from "@/actions/admin/images-slideshow/images-slideshow";
import BackMenu from "@/components/global/back-menu";
import { NotFound } from "@/components/global/error/not-found";
import { FormEditDataWebsite } from "@/features/admin/data-website/edit/form-edit-data-website";
import { FormEditImagesSlideShow } from "@/features/admin/images-slideshow/edit/form-edit-data-images-slideshow";

export default async function page({ params }) {
  const id = (await params).id;
  const data = await checkExistDataImageSlideShow(id);
  if (!data) {
    return <NotFound href="/admin/images-slideshow" />;
  }
  return (
    <div className="container mx-auto py-10 pt-0">
      <BackMenu href={"/admin/images-slideshow"} />
      <FormEditImagesSlideShow data={data} />
    </div>
  );
}
