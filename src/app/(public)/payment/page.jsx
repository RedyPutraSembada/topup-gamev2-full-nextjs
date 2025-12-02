import { getTransactionByOrderID, getTransactionByReference } from "@/actions/transaction/transaction";
import DetailPayment from "@/features/pages/payment/detail-payment";

export default async function PaymentPage(props) {
  
  // 1. Ambil Query Parameters. Menggunakan 'await props.searchParams'
  // untuk mengatasi error Next.js yang menganggap searchParams sebagai Promise/Dynamic API.
  const searchParams = await props.searchParams;
  
  // Gunakan 'reference' sebagai ID unik transaksi dari URL Query.
  const reference = searchParams.reference; 
  
  if (!reference) {
    // Handle jika parameter kunci hilang (misalnya, diakses tanpa query parameter)
    return (
      <div className={`min-h-screen bg-gray-900 text-white py-8 px-4 text-center`}>
        <h1 className="text-xl font-bold text-red-500">Error: Reference ID not found in URL.</h1>
        <p className="mt-4 text-gray-400">Pastikan URL Anda memiliki parameter '?reference=...'</p>
      </div>
    );
  }

  // 2. Lakukan Lookup Transaksi berdasarkan Reference
  const detailTransaction = await getTransactionByReference(reference)

  // 3. Handle jika transaksi tidak ditemukan di database
  if (!detailTransaction) {
     return (
      <div className={`min-h-screen bg-gray-900 text-white py-8 px-4 text-center`}>
        <h1 className="text-xl font-bold text-yellow-500">Transaksi Tidak Ditemukan</h1>
        <p className="mt-4 text-gray-400">Order dengan Reference ID <span className="font-mono text-white">{reference}</span> tidak ditemukan di sistem kami.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 text-white py-8`}>
      <DetailPayment detailTransaction={detailTransaction}/>
    </div>
  );
}