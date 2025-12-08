import { getLogoWebsite } from "@/actions/public/global-data/global-data";
import Footer from "@/components/layouts/public/site-footer";
import Header from "@/components/layouts/public/site-header";
import Sidebar from "@/components/layouts/public/site-sidebar";

export default async function PublicLayout({ children }) {
    const dataLogo = await getLogoWebsite();
    return (
        <div className={`min-h-screen bg-gray-900 text-white}`}>
            <Sidebar dataLogo={dataLogo.data} />
            <div className="lg:ml-48">
                <Header />
                <main className="flex flex-1 flex-col">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
  }