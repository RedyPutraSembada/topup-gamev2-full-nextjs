import { getAllDataNews} from "@/actions/public/all-news/all-news";
import { CardNews } from "@/components/news/card-news";

export default async function News() {
  const newsData = await getAllDataNews();
  
  return (
    <div className="px-4 lg:px-8 pb-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Artikel terbaru seputar berita game</h2>
      <p className="text-sm text-gray-400 mb-6">
        Dapatkan informasi terbaru seputar dunia game! Temukan panduan lengkap untuk meningkatkan pengalaman bermain, serta berita terkini mengenai promo, update terkini, dan komunitas gamer.
      </p>
      
      {newsData?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.data.map((item) => (
            <CardNews item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-12">
          Belum ada berita tersedia
        </p>
      )}
    </div>
  );
}