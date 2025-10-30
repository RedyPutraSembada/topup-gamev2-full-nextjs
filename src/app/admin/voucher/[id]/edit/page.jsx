import { checkExistVoucher } from "@/actions/admin/voucher/voucher";
import BackMenu from "@/components/global/back-menu";
import { NotFound } from "@/components/global/error/not-found";
import { FormEditVoucher } from "@/features/admin/voucher/edit/form-edit-voucher";

export default async function page({ params }) {
  const id = (await params).id;
  const data = await checkExistVoucher(id);
  if (!data) {
    return <NotFound href="/admin/voucher" />;
  }
  return (
    <div className="container mx-auto py-10 pt-0">
      <BackMenu href={"/admin/voucher"} />
      <FormEditVoucher data={data} />
    </div>
  );
}
