import { getTransactionByOrderID } from "@/actions/transaction/transaction";
import DetailPayment from "@/features/pages/payment/detail-payment";

export default async function PaymentPage({ params }) {
  const order_id = (await params).order_id;
  const detailTransaction = await getTransactionByOrderID(order_id)

  return (
    <div className={`min-h-screen bg-gray-900 text-white py-8`}>
      <DetailPayment detailTransaction={detailTransaction}/>
    </div>
  );
}