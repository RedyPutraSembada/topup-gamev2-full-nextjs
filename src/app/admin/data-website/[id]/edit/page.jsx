import { checkExistdataWebsite } from "@/actions/admin/data-website/data-website";
import BackMenu from "@/components/global/back-menu";
import { NotFound } from "@/components/global/error/not-found";
import { FormEditDataWebsite } from "@/features/admin/data-website/edit/form-edit-data-website";

export default async function page({ params }) {
  const id = (await params).id;
  const data = await checkExistdataWebsite(id);
  if (!data) {
    return <NotFound href="/admin/data-website" />;
  }
  return (
    <div className="container mx-auto py-10 pt-0">
      <BackMenu href={"/admin/data-website"} />
      <FormEditDataWebsite data={data} />
    </div>
  );
}
