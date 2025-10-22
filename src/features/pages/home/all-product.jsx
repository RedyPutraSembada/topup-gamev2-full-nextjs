export default function AllProduct() {
    const games = [
      { title: 'Genshin Impact', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop' },
      { title: 'Honkai Star Rail', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop' },
      { title: 'Wuthering Waves', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop' },
      { title: 'Honkai Impact', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop' },
      { title: 'Zenless Zone Zero', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop' },
      { title: 'Punishing Gray Raven', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=400&fit=crop' },
      { title: 'Mobile Legends', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&h=400&fit=crop' },
      { title: 'Magic Chess', image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=400&fit=crop' },
      { title: 'Honor of Kings', image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=400&fit=crop' },
      { title: 'Arena of Valor', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop' },
      { title: 'League of Legends', image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=300&h=400&fit=crop' },
      { title: 'Fate/Grand Order', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=400&fit=crop' },
      { title: 'Snowbreak', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop' },
      { title: 'Valorant', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop' },
      { title: 'Call of Duty Mobile', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop' },
      { title: 'PUBG Mobile', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop' },
      { title: 'Free Fire', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&h=400&fit=crop' },
      { title: 'Free Fire MAX', image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=400&fit=crop' },
      { title: 'Omyoji', image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&h=400&fit=crop' },
      { title: 'Marvel Rivals', image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=300&h=400&fit=crop' },
      { title: 'Delta Force', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop' },
      { title: 'Racing Master', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop' },
      { title: 'Roblox', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=400&fit=crop' },
      { title: 'Elden Ring', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop' },
    ];
  
    return (
      <div className="px-4 lg:px-8 pb-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Games</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium">Top Up</button>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium bg-gray-800}`}>Voucher</button>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium bg-gray-800}`}>Joki</button>
          </div>
        </div>
  
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {games.map((game, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-medium">{game.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }