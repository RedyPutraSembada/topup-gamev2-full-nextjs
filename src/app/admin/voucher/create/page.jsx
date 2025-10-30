import BackMenu from "@/components/global/back-menu";
import { FormCreateVoucher } from "@/features/admin/voucher/create/form-create-voucher";

export default async function page() {
  return (
    <div className="container mx-auto p-10">
      <BackMenu href={"/admin/voucher"} />
      <FormCreateVoucher/>
    </div>
  );
}
