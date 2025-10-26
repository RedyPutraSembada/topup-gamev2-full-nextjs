import BackMenu from "@/components/global/back-menu";
import { FormCreateDataWebsite } from "@/features/admin/data-website/create/form-create-data-website";

export default function page() {
  return (
    <div className="container mx-auto p-10">
      <BackMenu href={"/admin/data-website"} />
      <FormCreateDataWebsite />
    </div>
  );
}
