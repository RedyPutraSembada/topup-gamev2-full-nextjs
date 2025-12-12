import { getLogoWebsite } from "@/actions/public/global-data/global-data";
import LayoutWrapper from "@/components/layouts/public/layout-wrapper";

export default async function PublicLayout({ children }) {
    const dataLogo = await getLogoWebsite();
    
    return (
        <LayoutWrapper dataLogo={dataLogo.data}>
            {children}
        </LayoutWrapper>
    );
}