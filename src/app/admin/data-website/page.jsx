import { DataWebsiteList } from "@/features/admin/data-website/data-website-list";

export default async function page() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <DataWebsiteList/>
        </div>
    )
}