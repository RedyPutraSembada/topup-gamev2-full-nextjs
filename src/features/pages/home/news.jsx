export default function News() {
    return (
      <div className="px-4 lg:px-8 pb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Artikel terbaru seputar berita game</h2>
        <p className="text-sm text-gray-400 mb-6">
          Dapatkan informasi terbaru seputar dunia game! Temukan panduan lengkap untuk meningkatkan pengalaman bermain, serta berita terkini mengenai promo, update terkini, dan komunitas gamer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className={`rounded-xl overflow-hidden bg-gray-800 border border-gray-700 }`}>
              <div className="relative h-48">
                <img
                  src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=300&fit=crop"
                  alt="Article"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">5 alasan kenapa kamu itu karbii</h3>
                <button className="text-sm text-indigo-400 hover:text-indigo-300">
                  Lihat semua berita →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }