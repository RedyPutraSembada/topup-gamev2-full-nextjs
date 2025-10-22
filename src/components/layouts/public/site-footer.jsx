export default function Footer() {
    return (
      <footer className={`mt-16 border-tborder-gray-800 bg-gray-900 text-white`}>
        <div className="px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">GameVault</h3>
              <p className="text-sm text-gray-400">
                Platform top up game terpercaya dan terlengkap di Indonesia
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Beranda</a></li>
                <li><a href="#" className="hover:text-white">Semua Games</a></li>
                <li><a href="#" className="hover:text-white">Cek Transaksi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Dukungan Pelanggan</a></li>
                <li><a href="#" className="hover:text-white">Kebijakan Privasi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@gamevault.com</li>
                <li>WhatsApp: +62 812 3456 7890</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2025 GameVault. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }