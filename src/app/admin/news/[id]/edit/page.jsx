import { checkExistNews } from "@/actions/admin/news/news";
import BackMenu from "@/components/global/back-menu";
import { NotFound } from "@/components/global/error/not-found";
import { FormEditNews } from "@/features/admin/news/edit/form-edit-product";

export default async function page({ params }) {
  const id = (await params).id;
  const data = await checkExistNews(id);

  if (!data) {
    return <NotFound href="/admin/news" />;
  }
  return (
    <div className="container mx-auto py-10 pt-0">
      <BackMenu href={"/admin/news"} />
      <FormEditNews data={data} />
    </div>
  );
}
