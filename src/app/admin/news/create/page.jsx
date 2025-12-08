import BackMenu from "@/components/global/back-menu";
import { FormCreateNews } from "@/features/admin/news/create/form-create-news";

export default async function page() {
  return (
    <div className="container mx-auto p-10">
      <BackMenu href={"/admin/news"} />
      <FormCreateNews />
    </div>
  );
}
